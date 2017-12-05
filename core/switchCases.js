const switchCases = require("../reaks/switchCases")
module.exports = function() {
  console.warn(
    "switchCases has moved from uiks/core/switchCases to uiks/reaks/switchCases"
  )
  return switchCases.apply(switchCases, arguments)
}
