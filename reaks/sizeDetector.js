const elementResizeDetectorMaker = require("element-resize-detector")

const erd = elementResizeDetectorMaker({
  strategy: "scroll", //<- For ultra performance.
})

module.exports = onSizeChange => node => {
  erd.listenTo(node, onSizeChange)
  return () => erd.uninstall(node)
}
