const isPlainObject = require("lodash/isPlainObject")
const defaults = require("lodash/defaults")
const label = require("../reaks/label").reaks
const ctxComponent = require("../reaks/ctx-level-helpers/component")
const seq = require("reaks/seq")
const clickable = require("../reaks/clickable").reaksMixin
const style = require("reaks/style")
const innerMargin = require("../reaks-layout/innerMargin")
const align = require("../reaks-layout/align")
const size = require("reaks/size")
const colors = require("material-colors")

module.exports = ctxComponent(
  (arg, action) => {
    if (!isPlainObject(arg)) {
      arg = { label: arg }
    }
    const { label: text, color = colors.black } = arg

    return seq([
      clickable(action),
      label(text),
      align({ h: "center", v: "center" }),
      size({ h: 36 }),
      innerMargin({ h: 16 }),
      style({
        color,
        textTransform: "uppercase",
        fontSize: "14px",
        fontWeight: 500,
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
        color: ctx => (primary ? ctx.colors.secondary : colors.grey[600]),
      }),
      action,
    ]
  }
)
