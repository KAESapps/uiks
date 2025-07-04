const sum = require("lodash/sum")
const difference = require("lodash/difference")
const create = require("lodash/create")
const isFunction = require("lodash/isFunction")
const seq = require("reaks/seq")
const child = require("reaks/child")
const style = require("reaks/style")
const onEvent = require("reaks/onEvent")
const { observable } = require("kobs")
const withSize = require("./withSize")

const { autorun } = require("kobs")
const sizeDetector = require("./sizeDetector")

const attrDefer = (attr, getValue) => domNode =>
  autorun(() => {
    const val = getValue()
    setTimeout(() => (domNode[attr] = val))
  })

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

const listWindow =
  ({ getItemIds, getRange, createCmp, itemHeight, getItemTop }) =>
  parentNode => {
    const createItem = id =>
      seq([
        style({
          position: "absolute",
          minWidth: "100%",
          boxSizing: "border-box",
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
      //if (cmps.has(id)) return
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
      const newFullIds = getItemIds()
      const newIds =
        newFullIds && newFullIds.slice
          ? newFullIds.slice(currentRange[0], currentRange[1])
          : []

      // console.time("value change : diffArrays")
      const diff = diffArrays(currentIds, newIds)
      // add/remove items
      diff.forEach(part => {
        if (part.added || part.removed) {
          part.value.forEach(part.added ? addItem : removeItem)
        }
      })
      flushRecycling()
      // console.timeEnd("value change = diffArrays")

      currentFullIds = newFullIds
      currentIds = newIds

      if (!cancelRangeObservation) {
        cancelRangeObservation = autorun(() => {
          const newRange = getRange()

          // console.time("range change = diffRanges")
          // console.info(
          //   "diffRanges",
          //   "new = ",
          //   newRange,
          //   "current = ",
          //   currentRange
          // )
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
          // console.timeEnd("range change = diffRanges")

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

// pré-rendu avant et après exprimé en px (hauteurs variables)
const overscanPx = 500

module.exports = ({
  itemHeight: itemHeightArg,
  item,
  getDefaultVisibleItem: getDefaultVisibleItemGetter,
  disableEnsureItemVisible: getDisableEnsureItemVisibleFn,
  onScroll,
  listAvailWidthObs, // observable à fournir pour activer l'option
  selfSizingHeight, // hauteur variable en fonction du contenu et d'un éventuel max,
  selfSizingMaxItems, // si selfSizingHeight = true, hauteur maximale calculée selon la taille des selfSizingMaxItems premiers éléments
}) => {
  return withSize(ctx => {
    const onScrollCb = onScroll && onScroll(ctx)
    const listAvailWidth = listAvailWidthObs && listAvailWidthObs(ctx)

    const getItemIds = observable(
      isFunction(ctx.value) ? () => ctx.value() || [] : ctx.value || []
    )
    const itemHeight = isFunction(itemHeightArg)
      ? itemHeightArg(ctx)
      : itemHeightArg

    const getItemTop = isFunction(itemHeight)
      ? id => {
          const idx = getItemIds().indexOf(id)
          if (idx === -1) return

          return sum(getItemIds().slice(0, idx).map(itemHeight))
        }
      : id => {
          const idx = getItemIds().indexOf(id)
          if (idx === -1) return
          return idx * itemHeight
        }

    let getDefaultVisibleItem =
        getDefaultVisibleItemGetter && getDefaultVisibleItemGetter(ctx),
      disableEnsureItemVisible,
      scrollTop = 0,
      defaultScrollTop = () => 0
    if (getDefaultVisibleItem && !selfSizingHeight) {
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

        // in other cases, don't scroll
        return scrollWindowTop
      }
    }

    const scrollTopObs = observable()
    const setScrollTop = value => {
      // console.log("scroll event", Math.abs(scrollTop - value))
      scrollTop = value
      scrollTopObs(value)
    }

    let programmaticScroll = false

    const getRange = isFunction(itemHeight)
      ? () => {
          const containerHeight = ctx.size().height
          const scrollTop = scrollTopObs()
          let idx = 0
          let heightSum = 0
          const ids = getItemIds()
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
          const maxIndex = getItemIds().length
          return [
            Math.min(startIndex, maxIndex),
            Math.min(startIndex + nbItemsRendered, maxIndex),
          ]
        }

    return seq([
      // définit le scroll initial (une seule fois)
      () => scrollTopObs(defaultScrollTop()),
      style({
        position: "relative",
        willChange: "transform",
        overflow: "auto",
      }),
      // hauteur max si self-sizing
      selfSizingHeight &&
        selfSizingMaxItems &&
        style(
          isFunction(itemHeight)
            ? () => ({
                maxHeight: sum(
                  getItemIds()
                    .slice(0, selfSizingMaxItems)
                    .map(itemHeight)
                    .filter(v => v)
                ),
              })
            : { maxHeight: selfSizingMaxItems * itemHeight }
        ),

      onEvent("scroll", ev => {
        setScrollTop(ev.target.scrollTop)
        if (programmaticScroll) {
          programmaticScroll = false
        } else if (getDefaultVisibleItem && disableEnsureItemVisible) {
          getDefaultVisibleItem() != null && disableEnsureItemVisible()
        }
        onScrollCb && onScrollCb(ev)
      }),
      child(
        seq([
          // si option activée, détection dynamique de la largeur disponible pour le contenu, hors scrollbar
          listAvailWidth &&
            sizeDetector(node => {
              const currentWidth = listAvailWidth()
              const newWidth = node.offsetWidth
              if (newWidth !== currentWidth) {
                listAvailWidth(newWidth)
              }
            }),
          style({
            position: "relative",
            //overflow: "hidden", // retiré pour permettre le scroll horizontal si les lignes sont plus larges, à voir si ça peut poser pb dans certains cas ?
          }),
          style(
            isFunction(itemHeight)
              ? () => ({
                  height: sum(
                    getItemIds()
                      .map(itemHeight)
                      .filter(v => v)
                  ),
                })
              : () => ({
                  height: getItemIds().length * itemHeight,
                })
          ),
          listWindow({
            getItemIds,
            getRange,
            createCmp: id => item(create(ctx, { value: id })),
            itemHeight,
            getItemTop,
          }),
        ])
      ),
      getDefaultVisibleItem &&
        attrDefer("scrollTop", () => {
          // on utilise attrDefer pour être sûr que le scrollTop est appliqué après l'application du height (ci-dessus)
          // sinon le scroll ne fonctionnera pas si la hauteur scrollable n'a pas d'abord été mise à jour et que l'on veut scroller au maximum (en bas)
          programmaticScroll = true
          return defaultScrollTop()
        }),
    ])
  })
}
