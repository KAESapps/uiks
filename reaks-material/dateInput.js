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
  ({ value, setValue }) =>
    child(
      seq([
        style({
          border: "none",
          outline: "none",
          font: "inherit",
          borderRadius: 2,
          padding: 8,
        }),
        border({
          all: {
            width: 1,
          },
        }),
        attrs({
          type: 'date',
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
