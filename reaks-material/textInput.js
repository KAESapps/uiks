const child = require("reaks/child")
const style = require("reaks/style")
const seq = require("reaks/seq")
const ctxCmp = require("../reaks/ctx-level-helpers/component")
const textInputLook = require("./textInputLook")
const valueAttr = require("reaks/valueAttr")
const attrs = require("reaks/attrs")
const onEvent = require("reaks/onEvent")
const defaults = require("lodash/defaults")
const pickBy = require("lodash/pickBy")

module.exports = ctxCmp(
  ({
    id,
    placeholder,
    value,
    setValue,
    password = false,
    autoFocus = false,
    autocomplete,
  }) =>
    seq([
      style({
        display: "flex",
        flexDirection: "column", // found this to be necessary for flex to work in all situations
      }),
      child(
        seq([
          style({
            flex: 1,
            border: "none",
            outline: "none",
            font: "inherit",
            backgroundColor: "transparent",
          }),
          textInputLook.reaksMixin(),
          attrs(
            pickBy({
              id,
              placeholder,
              type: password ? "password" : null,
              autocomplete,
            })
          ),
          valueAttr(value), // specialized attr handler that prevent cursor jumping
          onEvent("input", ev => {
            setValue(ev.target.value || null)
          }),
          onEvent("click", ev => {
            ev.stopPropagation() // prevent unwanted effects of propagation of the click event to container
          }),
          autoFocus &&
            (domNode => {
              domNode.focus()
              process.env.PLATFORM === "windows" && domNode.click()
            }),
        ]),
        () => document.createElement("input")
      ),
    ]),
  // defaults args from context
  function (arg) {
    return [
      defaults({}, arg, {
        value: ctx => ctx.value,
        setValue: ctx => ctx.setValue,
      }),
    ]
  }
)
