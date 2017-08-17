const component = require("./ctx-level-helpers/component")
const text = require("reaks/text")
const style = require("reaks/style")
const seq = require("reaks/seq")

module.exports = component(
  function(arg) {
    return seq([
      text(arg),
      style({
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
      }),
    ])
  },
  // map arguments
  function() {
    if (arguments.length === 0) {
      return [ctx => ctx.value]
    }
    return arguments
  }
)
