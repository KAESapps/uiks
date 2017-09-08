const child = require("reaks/child")
const style = require("reaks/style")
const size = require("reaks/size")
const seq = require("reaks/seq")
const ctxCmp = require("../reaks/ctx-level-helpers/component")
const border = require("../reaks-layout/border")
const attr = require("reaks/attr")
const attrs = require("reaks/attrs")
const onEvent = require("reaks/onEvent")
const defaults = require("lodash/defaults")

module.exports = ctxCmp(
  ({ placeholder='', value, setValue, password = false }) =>
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
        attrs({
          placeholder: placeholder,
          type: password ? "password" : null,
        }),
        attr("value", value),
        onEvent("input", ev => {
          setValue(ev.target.value)
        }),
      ]),
      () => document.createElement("input")
    ),
  // defaults args from context
  function(arg) {
    return [
      defaults({}, arg, {
        value: ctx => ctx.value,
        setValue: ctx => ctx.setValue,
      }),
    ]
  }
)
