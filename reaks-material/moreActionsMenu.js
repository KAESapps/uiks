const assign = require("lodash/assign")
const menuIcon = require("./icons/navigation/moreVertical")
const iconButton = require("./iconButton")
const actionsPopup = require("./actionsPopup")
const { isPlainObject } = require("lodash")

module.exports = function (arg, arg2) {
  let actions, opts
  if (arguments.length === 2) {
    actions = arg2
    opts = arg
  } else {
    if (isPlainObject(arg)) {
      actions = arg.actions
      opts = arg
    } else {
      actions = arg
      opts = {}
    }
  }
  return iconButton(
    assign(
      {
        icon: menuIcon,
        color: ctx => ctx.fgColor || ctx.colors.textOnPrimary,
      },
      opts.iconButtonOpts
    ),
    actionsPopup({ actions, title: opts.title })
  )
}
