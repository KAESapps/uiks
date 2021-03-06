const { observable } = require("kobs")
const seq = require("reaks/seq")
const onEvent = require("reaks/onEvent")
const swap = require("reaks/swap")
const ctxWrap = require("./ctx-level-helpers/wrapper")

module.exports = ctxWrap(({ over: mouseOverMixin, out: mouseOutMixin }) => {
  return node => {
    const mouseOver = observable(false)
    return seq([
      onEvent("mouseenter", () => mouseOver(true)),
      onEvent("mouseleave", () => mouseOver(false)),
      swap(() => (mouseOver() ? mouseOverMixin : mouseOutMixin)),
    ])(node)
  }
})
