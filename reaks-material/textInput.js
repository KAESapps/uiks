const child = require("reaks/child")
const style = require("reaks/style")
const size = require("reaks/size")
const seq = require("reaks/seq")
const ctxCmp = require("../reaks/ctx-level-helpers/component")
const textInputLook = require("./textInputLook")
const valueAttr = require("reaks/valueAttr")
const attrs = require("reaks/attrs")
const onEvent = require("reaks/onEvent")
const defaults = require("lodash/defaults")

module.exports = ctxCmp(
  ({
    placeholder = "",
    value,
    setValue,
    password = false,
    autoFocus = false,
  }) =>
    child(
      seq([
        style({
          border: "none",
          outline: "none",
          font: "inherit",
          backgroundColor: "transparent",
        }),
        size({ w: "100%" }),
        textInputLook.reaksMixin(),
        attrs({
          placeholder: placeholder,
          type: password ? "password" : null,
        }),
        valueAttr(value), // specialized attr handler that prevent cursor jumping
        onEvent("input", ev => {
          setValue(ev.target.value || null)
        }),
        autoFocus &&
          (domNode => {
            domNode.focus()
            process.env.PLATFORM === "windows" && domNode.click()
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
