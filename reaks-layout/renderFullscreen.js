const seq = require("reaks/seq")
const style = require("reaks/style")
const child = require("reaks/child")

const layerStyle = style({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
})

const renderAppFullscreenInBody = insertApp =>
  seq([child(seq([layerStyle, insertApp]))])

module.exports = insertApp => () =>
  renderAppFullscreenInBody(insertApp)(document.body)
