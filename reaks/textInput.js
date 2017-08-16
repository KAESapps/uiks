const child = require("reaks/child")
const onEvent = require("reaks/onEvent")
const createInput = () => document.createElement("input")
const ctxCmp = require("./ctx-level-helpers/component")

module.exports = ctxCmp(action =>
  child(
    onEvent("change", ev => {
      const str = ev.target.value
      ev.target.value = ""
      action(str)
    }),
    createInput
  )
)
