const component = require("./ctx-level-helpers/component")
const text = require("reaks/text")

module.exports = component(
  text,
  // map arguments
  function() {
    if (arguments.length === 0) {
      return [ctx => ctx.value]
    }
    return arguments
  }
)
