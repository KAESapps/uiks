const child = require("reaks/child")
const style = require("reaks/style")
const size = require("reaks/size")
const seq = require("reaks/seq")
const ctxCmp = require("../reaks/ctx-level-helpers/component")
const border = require("reaks-layout/border")
const attr = require("reaks/attr")
const onEvent = require("reaks/onEvent")

module.exports = ctxCmp(({ placeholder, getValue, setValue }) =>
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
      attr("placeholder", () => placeholder),
      attr("value", getValue),
      onEvent("input", ev => {
        setValue(ev.target.value)
      }),
    ]),
    () => document.createElement("input")
  )
)
