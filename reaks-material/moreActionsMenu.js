const menuIcon = require("./icons/navigation/moreVertical")
const iconButton = require("./iconButton")
const actionsPopup = require("./actionsPopup")

module.exports = actions =>
  iconButton(
    { icon: menuIcon, color: ctx => ctx.colors.textOnPrimary },
    actionsPopup(actions)
  )
