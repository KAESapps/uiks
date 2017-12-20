const create = require("lodash/create")
const range = require("lodash/range")
const seq = require("reaks/seq")
const child = require("reaks/child")
const style = require("reaks/style")
const onEvent = require("reaks/onEvent")
const { observable } = require("kobs")
const withSize = require("uiks/reaks/withSize")

const { autorun } = require("kobs")

const listWindow = (getValue, getRange, createCmp) => parentNode => {
  const domNodes = new Map()
  const cmps = new Map()
  const prevIds = []
  const cancelObservation = autorun(() => {
    const ids = getValue() || []
    const rangeIds = getRange().map(i => ids[i])

    for (let i = prevIds.length - 1; i >= 0; i--) {
      const id = prevIds[i]
      const newIndex = rangeIds.indexOf(id)
      // remove ids no more in use
      if (newIndex < 0) {
        const unmount = cmps.get(id)
        unmount()
        cmps.delete(id)
        const domNode = domNodes.get(id)
        parentNode.removeChild(domNode)
        domNodes.delete(id)
        prevIds.splice(i, 1)
      }
    }
    // move current ids and add new ones
    getRange().forEach((i, renderIdx) => {
      const id = ids[i]
      if (prevIds[renderIdx] === id) return // nothing to do

      const prevIndex = prevIds.indexOf(id)
      if (prevIndex >= 0) {
        //move
        const domNode = domNodes.get(id)
        const refId = prevIds[renderIdx]
        const refNode = domNodes.get(refId)
        parentNode.insertBefore(domNode, refNode)
        prevIds.splice(prevIndex, 1)
        prevIds.splice(renderIdx, 0, id)
      } else {
        // add
        const domNode = document.createElement("div")
        const refId = prevIds[renderIdx]
        const refNode = domNodes.get(refId)
        parentNode.insertBefore(domNode, refNode)
        const cmp = createCmp(id, () => getValue().indexOf(id))
        cmps.set(id, cmp(domNode))
        domNodes.set(id, domNode)
        prevIds.splice(renderIdx, 0, id)
      }
    })
  }, "listWindow")
  return () => {
    cancelObservation()
    cmps.forEach(unmount => unmount())
    domNodes.forEach(domNode => parentNode.removeChild(domNode))
  }
}

const observableDedupe = function(initValue, mapValue) {
  let prevValue = mapValue(initValue)
  const obs = observable(prevValue)
  return function(val) {
    if (arguments.length) {
      // set
      const mappedVal = mapValue(val)
      if (prevValue !== mappedVal) {
        prevValue = mappedVal
        obs(mappedVal)
      }
    } else {
      return obs()
    }
  }
}

// nombre d'éléments pré-rendus avant et après
const nbExtraItems = 40
// distance de scroll en nombre d'éléments avant un re-rendu
// TODO: on pourrait plutôt se baser sur RAF non ?
const nbScrolledItemsBeforeRerender = 1

module.exports = ({ itemHeight, item }) =>
  withSize(ctx => {
    // start index = index du premier élément rendu
    const startIndex = observableDedupe(
      0,
      scrollTop =>
        Math.floor(
          scrollTop / itemHeight -
            (scrollTop / itemHeight) % nbScrolledItemsBeforeRerender
        ) - nbExtraItems
    )
    const setScrollTop = startIndex

    return seq([
      style({
        position: "relative",
        willChange: "transform",
        overflow: "auto",
      }),
      onEvent("scroll", ev => setScrollTop(ev.target.scrollTop)),
      child(
        seq([
          style({
            position: "relative",
            overflow: "hidden",
          }),
          style(() => ({
            height: ctx.value().length * itemHeight,
          })),
          listWindow(
            ctx.value,
            () => {
              const containerHeight = ctx.size().height
              let nbItemsRendered =
                Math.ceil(containerHeight / itemHeight) + nbExtraItems * 2
              // nombre pair d'éléments
              nbItemsRendered -= nbItemsRendered % 2
              return range(
                Math.max(0, startIndex()),
                Math.min(startIndex() + nbItemsRendered, ctx.value().length)
              )
            },
            (id, getIndex) =>
              seq([
                style({
                  position: "absolute",
                  width: "100%",
                  height: itemHeight,
                }),
                style(() => ({
                  top: getIndex() * itemHeight + "px",
                })),
                item(create(ctx, { value: id })),
              ])
          ),
        ])
      ),
    ])
  })
