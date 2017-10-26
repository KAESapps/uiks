const seq = require("reaks/seq")
const style = require("reaks/style")
const onEvent = require("reaks/onEvent")

module.exports = (opts = {}) => {
  const { onScroll } = opts
  return seq([
    style({
      overflow: "auto",
    }),
    onScroll && onEvent("scroll", onScroll),
  ])
}
