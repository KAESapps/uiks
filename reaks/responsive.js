const ctxCmp = require("./ctx-level-helpers/component")
const elementResizeDetectorMaker = require("element-resize-detector")
const seq = require("reaks/seq")
const swap = require("reaks/swap")

const erd = elementResizeDetectorMaker({
  strategy: "scroll", //<- For ultra performance.
})

const { observable } = require("kobs")

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

module.exports = ctxCmp(({ breakWidth, narrowView, largeView }) => {
  const responsiveView = observableDedupe(null, width => {
    if (width === null) return

    if (width > breakWidth) {
      return largeView
    } else {
      return narrowView
    }
  })

  return seq([widthDetector(responsiveView), swap(responsiveView)])
})
