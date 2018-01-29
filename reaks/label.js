const isFunction = require("lodash/isFunction")
const component = require("./ctx-level-helpers/component")
const text = require("reaks/text")
const style = require("reaks/style")
const seq = require("reaks/seq")

const nonBreakingWhitespaceChar = "\xa0"
module.exports = component(
  function(arg1, arg2) {
    let labelArg, opt
    if (arguments.length === 1) {
      labelArg = arg1
      opt = { ellipsis: true }
    } else {
      labelArg = arg2
      opt = arg1
    }

    let textArg
    // keep height even with empty value
    if (isFunction(labelArg)) {
      textArg = () => labelArg() || nonBreakingWhitespaceChar
    } else {
      textArg = labelArg || nonBreakingWhitespaceChar
    }

    const styleArg = {
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: opt.ellipsis && "ellipsis",
    }

    return seq([text(textArg), style(styleArg)])
  },
  // map arguments
  function() {
    if (arguments.length === 0) {
      return [ctx => ctx.value]
    }
    return arguments
  }
)
