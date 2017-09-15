const defaults = require("lodash/defaults")
const isFunction = require("lodash/isFunction")
const clickable = require("../reaks/clickable").reaksMixin
const svgIcon = require("reaks/svgIcon")
const seq = require("reaks/seq")
const child = require("reaks/child")
const size = require("reaks/size")
const align = require("../reaks-layout/align")
const component = require("../reaks/ctx-level-helpers/component")

module.exports = component(
  (iconArg, action) =>
    child(
      seq([
        clickable(action),
        size({ h: 36, w: 36 }),
        align({ v: "center", h: "center" }),
        svgIcon(iconArg.icon)({ size: { h: 24 }, color: iconArg.color }),
      ])
    ),
  function(iconArg, action) {
    return [
      ctx =>
        defaults({}, isFunction(iconArg) ? iconArg(ctx) : iconArg, {
          color: ctx.colors.textOnPrimary,
        }),
      action,
    ]
  }
)
