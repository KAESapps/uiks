const child = require("reaks/child")
const style = require("reaks/style")
const innerMargin = require("../reaks-layout/innerMargin")
const size = require("reaks/size")
const seq = require("reaks/seq")
const ctxCmp = require("../reaks/ctx-level-helpers/component")
const border = require("../reaks-layout/border")
const valueAttr = require("reaks/valueAttr")
const attrs = require("reaks/attrs")
const onEvent = require("reaks/onEvent")
const defaults = require("lodash/defaults")

module.exports = ctxCmp(
  ({ placeholder = "", value, setValue, autoFocus = false }) =>
    child(
      seq([
        style({
          outline: "none",
          font: "inherit",
        }),
        innerMargin(8),
        size({ w: "100%" }),
        border({ radius: 2 }),
        attrs({
          placeholder,
        }),
        valueAttr(value), // specialized attr handler that prevent cursor jumping
        onEvent("input", ev => {
          setValue(ev.target.value)
        }),
        onEvent("keydown", ev => {
          const key = ev.key
          if (key === "Enter") {
            // pour la compatibilité avec pickerInDialog
            ev.stopPropagation()
          }
        }),
        autoFocus && (domNode => domNode.focus()),
      ]),
      () => document.createElement("textarea")
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
