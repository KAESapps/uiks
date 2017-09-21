const clickable = require("../reaks/clickable")
const icon = require("./icon")

module.exports = (iconArg, action) =>
    clickable(action, icon(iconArg))
