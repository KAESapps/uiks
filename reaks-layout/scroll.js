const seq = require("reaks/seq")
const child = require("reaks/child")
const style = require("reaks/style")
const onEvent = require("reaks/onEvent")

module.exports = function(opts, content) {
  if (arguments.length === 1) {
    content = opts
    opts = {}
  }
  const { onScroll } = opts
  return seq([
    style({
      overflow: "auto",
      display: "flex",
      flexDirection: "column",
    }),
    onScroll && onEvent("scroll", onScroll),
    child(seq([style({ flex: 1 }), content])),
  ])
}
