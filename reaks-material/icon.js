const defaults = require("lodash/defaults")
const isFunction = require("lodash/isFunction")
const svgIcon = require("reaks/svgIcon")
const seq = require("reaks/seq")
const child = require("reaks/child")
const size = require("reaks/size")
const align = require("../reaks-layout/align")
const component = require("../reaks/ctx-level-helpers/component")

module.exports = component(
  iconArg => {
    const { icon, size: sizeArg = { h: 24, w: 24 }, color } = iconArg
    return child(
      seq([
        size(sizeArg),
        align({ v: "center", h: "center" }),
        svgIcon(icon, { size: sizeArg, color }),
      ])
    )
  },
  function(iconArg) {
    return [
      defaults({}, iconArg, {
        color: ctx => ctx.colors.textOnPrimary,
      }),
    ]
  }
)
