const child = require("reaks/child")
const style = require("reaks/style")
const size = require("reaks/size")
const seq = require("reaks/seq")
const ctxCmp = require("../reaks/ctx-level-helpers/component")
const border = require("reaks-layout/border")

module.exports = ctxCmp(() =>
  child(
    seq([
      style({
        border: "none",
        outline: "none",
        font: "inherit",
      }),
      size({ h: 48, w: "100%" }),
      border({
        b: {
          width: 2,
        },
      }),
    ]),
    () => document.createElement("input")
  )
)
