const component = require("../reaks/ctx-level-helpers/component")
const singleLineText = require("../reaks/label").reaks
const seq = require("reaks/seq")
const style = require("reaks/style")
const vPile = require("../reaks-layout/vPile")
const colors = require("material-colors")
const margin = require("../reaks-layout/margin")

module.exports = component(function (label, opts, cmp) {
  if (arguments.length === 2) {
    cmp = opts
    opts = { margin: 0 }
  }
  return vPile([
    seq([
      singleLineText(label),
      style({
        fontSize: 12,
        color: colors.darkText.secondary,
      }),
      margin({ b: opts.margin }),
    ]),
    cmp,
    opts.desc &&
      seq([
        singleLineText(opts.desc),
        style({
          fontSize: 10,
          color: colors.darkText.secondary,
        }),
      ]),
  ])
})
