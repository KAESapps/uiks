const ctxComponent = require("../reaks/ctx-level-helpers/component")
const seq = require("reaks/seq")
const style = require("reaks/style")
const innerMargin = require("../reaks-layout/innerMargin")
const colors = require("material-colors")

module.exports = ctxComponent(content => {
  return seq([
    innerMargin(10),
    style({
      backgroundColor: colors.white,
      borderRadius: 2,
      boxShadow:
        "rgba(0, 0, 0, 0.2) 0px 1px 4px, rgba(0, 0, 0, 0.2) 0px 1px 2px",
    }),
    content,
  ])
})
