const defaults = require("lodash/defaults")
const label = require("../reaks/label").reaks
const ctxComponent = require("../reaks/ctx-level-helpers/component")
const seq = require("reaks/seq")
const clickable = require("../reaks/clickable").reaksMixin
const style = require("reaks/style")
const align = require("reaks-layout/align")
const size = require("reaks/size")
const colors = require("material-colors")

module.exports = ctxComponent(
  (text, action, opts) => {
    const { textColor, backgroundColor } = defaults({}, opts, {
      textColor: colors.white,
      backgroundColor: colors.pink["a200"],
    })
    return seq([
      clickable(action),
      label(text),
      align({ h: "center", v: "center" }),
      size({ h: 36 }),
      style({
        color: textColor,
        backgroundColor,
        textTransform: "uppercase",
        borderRadius: 2,
        boxShadow:
          "rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px",
        paddingLeft: 16,
        paddingRight: 16,
        fontSize: "14px",
        fontWeight: 500,
      }),
    ])
  },
  function(text, action, opts) {
    return [
      text,
      action,
      ctx =>
        defaults({}, opts, {
          textColor: ctx.colors.textOnSecondary,
          backgroundColor: ctx.colors.secondary,
        }),
    ]
  }
)
