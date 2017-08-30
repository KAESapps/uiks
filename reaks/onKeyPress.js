const onEvent = require("reaks/onEvent")
const wrapper = require("../reaks/ctx-level-helpers/wrapper")

module.exports = wrapper(({ keyCode, action }) => {
  return onEvent("keypress", function(ev) {
    if (ev.code === keyCode) {
      action()
    }
  })
})
