const switchBoolean = require("../reaks/switchBoolean")
module.exports = function() {
  console.warn(
    "switchBoolean has moved from uiks/core/switchBoolean to uiks/reaks/switchBoolean"
  )
  return switchBoolean.apply(switchBoolean, arguments)
}
