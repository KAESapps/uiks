const isPlainObject = require("lodash/isPlainObject")
const defaults = require("lodash/defaults")
const label = require("../reaks/label").reaks
const ctxComponent = require("../reaks/ctx-level-helpers/component")
const seq = require("reaks/seq")
const clickable = require("../reaks/clickable").reaksMixin
const style = require("reaks/style")
const innerMargin = require("../reaks-layout/innerMargin")
const align = require("../reaks-layout/align")
const hoverable = require("../reaks/hoverable")
const size = require("reaks/size")
const colors = require("material-colors")

module.exports = ctxComponent(
  (arg, action) => {
    if (!isPlainObject(arg)) {
      arg = { label: arg }
    }
    const { label: text, color = colors.black } = arg

    return seq([
      hoverable.reaksMixin({
        over: style({ backgroundColor: "rgba(0,0,0,0.1)" }),
      }),
      clickable(action),
      label(text),
      align({ h: "center", v: "center" }),
      size({ h: 40 }),
      innerMargin({ h: 16 }),
      style({
        color,
        textTransform: "uppercase",
        fontSize: "14px",
        fontWeight: 500,
        borderRadius: 2,
      }),
    ])
  },
  function(arg, action) {
    if (!isPlainObject(arg)) {
      arg = { label: arg }
    }
    const { primary = true } = arg
    return [
      defaults({}, arg, {
        color: ctx =>
          primary ? ctx.colors.secondary : ctx.colors.fadedDarkText,
      }),
      action,
    ]
  }
)
