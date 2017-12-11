const isFunction = require("lodash/isFunction")
const component = require("./ctx-level-helpers/component")
const text = require("reaks/text")
const style = require("reaks/style")
const seq = require("reaks/seq")

const nonBreakingWhitespaceChar = "\xa0"
module.exports = component(
  function(arg) {
    let textArg

    // keep height even with empty value
    if (isFunction(arg)) {
      textArg = () => arg() || nonBreakingWhitespaceChar
    } else {
      textArg = arg || nonBreakingWhitespaceChar
    }

    return seq([
      text(textArg),
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
