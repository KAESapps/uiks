const sum = require("lodash/sum")
const difference = require("lodash/difference")
const create = require("lodash/create")
const isFunction = require("lodash/isFunction")
const seq = require("reaks/seq")
const child = require("reaks/child")
const style = require("reaks/style")
const attr = require("reaks/attr")
const onEvent = require("reaks/onEvent")
const { observable } = require("kobs")
const withSize = require("./withSize")

const { autorun } = require("kobs")

const diffArrays = (oldArray, newArray) => {
  return [
    { removed: true, value: difference(oldArray, newArray) },
    { added: true, value: difference(newArray, oldArray) },
  ]
}

const diffRanges = (oldRange, newRange) => {
  const [oldStart, oldEnd] = oldRange
  const [newStart, newEnd] = newRange

  // A) ranges don't intersect
  if (newEnd < oldStart || oldEnd < newStart) {
    return [
      { removed: true, value: oldRange },
      { added: true, value: newRange },
    ]
  }

  let diff = []
  // B) ranges intersect
  if (oldStart < newStart) {
    diff.push({
      removed: true,
      value: [oldStart, newStart],
    })
  }
  if (newEnd < oldEnd) {
    diff.push({
      removed: true,
      value: [newEnd, oldEnd],
    })
  }
  if (newStart < oldStart) {
    diff.push({
      added: true,
      value: [newStart, oldStart],
    })
  }
  if (oldEnd < newEnd) {
    diff.push({
      added: true,
      value: [oldEnd, newEnd],
    })
  }
  return diff
}

const listWindow = ({
  getItemIds,
  getRange,
  createCmp,
  itemHeight,
  getItemTop,
}) => parentNode => {
  const createItem = id =>
    seq([
      style({
        position: "absolute",
        width: "100%",
      }),
      style(
        isFunction(itemHeight)
          ? () => ({
              height: itemHeight(id),
            })
          : { height: itemHeight }
      ),
      style(() => ({
        top: getItemTop(id) + "px",
      })),
      createCmp(id),
    ])

  const domNodes = new Map()
  const cmps = new Map()
  let currentFullIds
  let currentIds = []
  let currentRange = [0, 0]

  let nodeRecycling = []
  const flushRecycling = () => {
    nodeRecycling.forEach(n => parentNode.removeChild(n))
    nodeRecycling = []
  }

  const addItem = id => {
    let domNode = nodeRecycling.pop()
    if (!domNode) {
      domNode = document.createElement("div")
      parentNode.appendChild(domNode)
    }
    const cmp = createItem(id)
    cmps.set(id, cmp(domNode))
    domNodes.set(id, domNode)
  }

  const removeItem = id => {
    const unmount = cmps.get(id)
    unmount()
    cmps.delete(id)
    const domNode = domNodes.get(id)
    domNodes.delete(id)
    nodeRecycling.push(domNode)
  }

  let cancelRangeObservation
  const cancelValueObservation = autorun(() => {
    const newFullIds = getItemIds() || []
    const newIds = newFullIds.slice(currentRange[0], currentRange[1])
    const diff = diffArrays(currentIds, newIds)

    // add/remove items
    diff.forEach(part => {
      if (part.added || part.removed) {
        part.value.forEach(part.added ? addItem : removeItem)
      }
    })
    flushRecycling()

    currentFullIds = newFullIds
    currentIds = newIds

    if (!cancelRangeObservation) {
      cancelRangeObservation = autorun(() => {
        const newRange = getRange()

        const diff = diffRanges(currentRange, newRange)
        diff.forEach(part => {
          for (
            let idx = Math.min(part.value[0], currentFullIds.length);
            idx < Math.min(part.value[1], currentFullIds.length);
            idx++
          ) {
            ;(part.added ? addItem : removeItem)(currentFullIds[idx])
          }
        })
        flushRecycling()

        currentRange = newRange
        currentIds = currentFullIds.slice(currentRange[0], currentRange[1])
      }, "listWindowGetRange")
    }
  }, "listWindowGetValue")
  return () => {
    cancelValueObservation()
    cancelRangeObservation()
    cmps.forEach(unmount => unmount())
    domNodes.forEach(domNode => parentNode.removeChild(domNode))
  }
}

const observeWithDeduping = function(
  getValue,
  cb,
  isEqual = (a, b) => a === b
) {
  let currentValue

  return () =>
    autorun(() => {
      const newValue = getValue()
      if (!isEqual(currentValue, newValue)) {
        currentValue = newValue
        setTimeout(() => cb(newValue))
      }
    })
}

// pré-rendu avant et après exprimé en px (hauteurs variables)
const overscanPx = 500

module.exports = ({
  itemHeight,
  item,
  getDefaultVisibleItem: getDefaultVisibleItemGetter,
  disableEnsureItemVisible: getDisableEnsureItemVisibleFn,
}) => {
  return withSize(ctx => {
    const getItemIds = ctx.value
    itemHeight = isFunction(itemHeight) ? itemHeight(ctx) : itemHeight
    const getItemTop = isFunction(itemHeight)
      ? id => {
          const idx = getItemIds().indexOf(id)
          return sum(
            getItemIds()
              .slice(0, idx)
              .map(itemHeight)
          )
        }
      : id => getItemIds().indexOf(id) * itemHeight

    let getDefaultVisibleItem = getDefaultVisibleItemGetter(ctx),
      disableEnsureItemVisible,
      scrollTop = 0,
      defaultScrollTop = () => 0
    if (getDefaultVisibleItem) {
      disableEnsureItemVisible = getDisableEnsureItemVisibleFn(ctx)

      defaultScrollTop = () => {
        const scrollWindowTop = scrollTop
        const itemId = getDefaultVisibleItem()
        if (itemId == null) {
          return scrollWindowTop
        }

        const itemTop = getItemTop(itemId)
        const itemBottom =
          itemTop + (isFunction(itemHeight) ? itemHeight(itemId) : itemHeight)
        const containerHeight = ctx.size().height || 0
        const scrollWindowBottom = scrollWindowTop + containerHeight

        if (itemTop >= scrollWindowTop && itemBottom <= scrollWindowBottom) {
          // item already visible
          return scrollWindowTop
        } else if (itemBottom > scrollWindowTop) {
          return itemBottom - containerHeight
        } else if (itemTop < scrollWindowTop) {
          return itemTop
        }
      }
    }

    const scrollTopObs = observable()
    // TODO: debounce scroll events with RAF
    const setScrollTop = value => {
      scrollTop = value
      scrollTopObs(value)
    }

    let programmaticScroll = false

    const rangeObs = observable([0, 0])
    const observeRange = observeWithDeduping(
      isFunction(itemHeight)
        ? () => {
            const containerHeight = ctx.size().height
            const scrollTop = scrollTopObs()
            let idx = 0
            let heightSum = 0
            const ids = ctx.value()
            while (heightSum < Math.max(0, scrollTop - overscanPx)) {
              heightSum += itemHeight(ids[idx])
              idx++
            }
            const startIndex = idx
            while (
              heightSum < scrollTop + containerHeight + overscanPx &&
              idx < ids.length
            ) {
              heightSum += itemHeight(ids[idx])
              idx++
            }
            const endIndex = idx
            return [startIndex, endIndex]
          }
        : () => {
            const overscanNbItems = Math.floor(overscanPx / itemHeight)
            const containerHeight = ctx.size().height

            let nbItemsRendered = containerHeight
              ? Math.ceil(containerHeight / itemHeight) + overscanNbItems * 2
              : 0

            const scrollTop = scrollTopObs()
            // start index = index du premier élément rendu
            const startIndex = Math.max(
              Math.floor(scrollTop / itemHeight) - overscanNbItems,
              0
            )
            const maxIndex = ctx.value().length
            return [
              Math.min(startIndex, maxIndex),
              Math.min(startIndex + nbItemsRendered, maxIndex),
            ]
          },
      rangeObs,
      (r1, r2) => r1 && r2 && r1[0] == r2[0] && r1[1] == r2[1]
    )

    return seq([
      () => scrollTopObs(defaultScrollTop()),
      observeRange,
      style({
        position: "relative",
        willChange: "transform",
        overflow: "auto",
      }),
      onEvent("scroll", ev => {
        setScrollTop(ev.target.scrollTop)
        if (programmaticScroll) {
          programmaticScroll = false
        } else if (getDefaultVisibleItem) {
          getDefaultVisibleItem() != null && disableEnsureItemVisible()
        }
      }),
      child(
        seq([
          style({
            position: "relative",
            overflow: "hidden",
          }),
          style(
            isFunction(itemHeight)
              ? () => ({
                  height: sum(ctx.value().map(itemHeight)),
                })
              : () => ({
                  height: ctx.value().length * itemHeight,
                })
          ),
          listWindow({
            getItemIds,
            getRange: rangeObs,
            createCmp: id => item(create(ctx, { value: id })),
            itemHeight,
            getItemTop,
          }),
        ])
      ),
      getDefaultVisibleItem &&
        attr("scrollTop", () => {
          programmaticScroll = true
          return defaultScrollTop()
        }),
    ])
  })
}
