const elementResizeDetectorMaker = require("element-resize-detector")
const seq = require("reaks/seq")
const create = require("lodash/create")

const erd = elementResizeDetectorMaker({
  strategy: "scroll", //<- For ultra performance.
})

const { observable } = require("reactivedb/obs")

const widthDetector = setWidth => node => {
  erd.listenTo(node, function(node) {
    setWidth(node.offsetWidth)
  })
  return () => erd.uninstall(node)
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

module.exports = (breakWidth, wrappedCmp) => ctx => {
  const responsiveObs = observableDedupe(null, width => {
    if (width === null) return

    if (width > breakWidth) {
      return "large"
    } else {
      return "narrow"
    }
  })

  return seq([
    widthDetector(responsiveObs),
    wrappedCmp(
      create(ctx, {
        responsiveSize: responsiveObs,
      })
    ),
  ])
}
