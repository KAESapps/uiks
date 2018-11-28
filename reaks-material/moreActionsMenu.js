const assign = require("lodash/assign")
const menuIcon = require("./icons/navigation/moreVertical")
const iconButton = require("./iconButton")
const actionsPopup = require("./actionsPopup")

module.exports = function(opts, actions) {
  if (arguments.length === 1) {
    actions = opts
  }
  return iconButton(
    assign({ icon: menuIcon, color: ctx => ctx.colors.textOnPrimary }, opts),
    actionsPopup(actions)
  )
}
