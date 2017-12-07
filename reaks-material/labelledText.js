const component = require("../reaks/ctx-level-helpers/component")
const labelled = require("./labelled").reaks
const singleLineText = require("../reaks/label").reaks

module.exports = component(
  (label, value) => labelled(label, { margin: 8 }, singleLineText(value)),
  function(arg) {
    if (arguments.length === 1) {
      return [arg, ctx => ctx.value]
    } else {
      return arguments
    }
  }
)
