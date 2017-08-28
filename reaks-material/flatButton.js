const isPlainObject = require("lodash/isPlainObject")
const label = require("../reaks/label").reaks
const ctxComponent = require("../reaks/ctx-level-helpers/component")
const seq = require("reaks/seq")
const clickable = require("../reaks/clickable").reaksMixin
const style = require("reaks/style")
const innerMargin = require("reaks-layout/innerMargin")
const align = require("reaks-layout/align")
const size = require("reaks/size")
const colors = require("material-colors")

module.exports = ctxComponent((arg, action) => {
  let text = arg,
    primary = true
  if (isPlainObject(arg)) {
    ;({ label: text, primary = true } = arg)
  }
  return seq([
    clickable(action),
    label(text),
    align({ h: "center", v: "center" }),
    size({ h: 36 }),
    innerMargin({ h: 16 }),
    style({
      color: primary ? colors.teal[500] : colors.grey[900],
      textTransform: "uppercase",
      fontSize: "14px",
      fontWeight: 500,
    }),
  ])
})
