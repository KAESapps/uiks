const child = require("reaks/child")
const size = require("reaks/size")
const seq = require("reaks/seq")
const ctxCmp = require("../reaks/ctx-level-helpers/component")
const valueAttr = require("reaks/valueAttr")
const attrs = require("reaks/attrs")
const onEvent = require("reaks/onEvent")
const defaults = require("lodash/defaults")

module.exports = ctxCmp(
  ({ value, setValue }) =>
    child(
      seq([
        size({ w: "100%" }),
        attrs({
          type: "color",
        }),
        valueAttr(value), // specialized attr handler that prevent cursor jumping
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
