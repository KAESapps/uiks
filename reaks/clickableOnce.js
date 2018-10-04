const wrapper = require("./ctx-level-helpers/wrapper")
const seq = require("reaks/seq")
const onEvent = require("reaks/onEvent")
const style = require("reaks/style")

module.exports = wrapper(action => {
  let canTriggerAction = true
  const preventTriggerAction = () => {
    console.log("preventTriggerAction")
    canTriggerAction = false
  }
  const allowTriggerAction = () => {
    console.log("allowTriggerAction")
    canTriggerAction = true
  }
  return seq([
    onEvent("click", ev => {
      ev.stopPropagation()
      canTriggerAction &&
        Promise.resolve(action(ev)).finally(allowTriggerAction)
      preventTriggerAction()
    }),
    style({ cursor: "pointer" }),
  ])
})
