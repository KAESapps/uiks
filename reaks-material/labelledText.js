const component = require("../reaks/ctx-level-helpers/component")
const singleLineText = require("../reaks/label").reaks
const seq = require("reaks/seq")
const style = require("reaks/style")
const vPile = require("../reaks-layout/vPile")
const colors = require("material-colors")
const margin = require("../reaks-layout/margin")

module.exports = component(
  (label, value) =>
    vPile([
      seq([
        singleLineText(label),
        style({
          fontSize: 12,
          color: colors.darkText.secondary,
        }),
        margin({ b: 8 }),
      ]),
      singleLineText(value),
    ]),
  function(arg) {
    if (arguments.length === 1) {
      return [arg, ctx => ctx.value]
    } else {
      return arguments
    }
  }
)
