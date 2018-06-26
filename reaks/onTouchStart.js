const seq = require("reaks/seq")
const style = require("reaks/style")
const onEvent = require("reaks/onEvent")

module.exports = action =>
  seq([
    onEvent("touchstart", ev => {
      ev.stopPropagation()
      ev.preventDefault() // prevent triggering mouse event
      action(ev)
    }),
    onEvent("mousedown", ev => {
      ev.stopPropagation()
      action(ev)
    }),
    style({ cursor: "pointer" }),
  ])
