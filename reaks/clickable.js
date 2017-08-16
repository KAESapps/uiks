const wrapper = require("./ctx-level-helpers/wrapper")
const seq = require("reaks/seq")
const onEvent = require("reaks/onEvent")
const style = require("reaks/style")

module.exports = wrapper(action => {
  return seq([onEvent("click", action), style({ cursor: "pointer" })])
})
