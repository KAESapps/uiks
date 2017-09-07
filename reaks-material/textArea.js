const child = require("reaks/child")
const style = require("reaks/style")
const innerMargin = require("reaks-layout/innerMargin")
const size = require("reaks/size")
const seq = require("reaks/seq")
const ctxCmp = require("../reaks/ctx-level-helpers/component")
const border = require("reaks-layout/border")
const attr = require("reaks/attr")
const attrs = require("reaks/attrs")
const onEvent = require("reaks/onEvent")
const defaults = require("lodash/defaults")

module.exports = ctxCmp(
  ({ placeholder = "", getValue, setValue }) =>
    child(
      seq([
        style({
          border: "none",
          outline: "none",
          font: "inherit",
          borderRadius: 2,
        }),
        innerMargin(8),
        size({ w: "100%" }),
        border({
          all: {
            width: 1,
          },
        }),
        attrs({
          placeholder,
        }),
        attr("value", getValue),
        onEvent("input", ev => {
          setValue(ev.target.value)
        }),
      ]),
      () => document.createElement("textarea")
    ),
  // defaults args from context
  function(arg) {
    return [
      defaults({}, arg, {
        getValue: ctx => ctx.value,
        setValue: ctx => ctx.setValue,
      }),
    ]
  }
)
