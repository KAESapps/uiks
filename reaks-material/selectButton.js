const isFunction = require("lodash/isFunction")
const isString = require("lodash/isString")
const clickable = require("../reaks/clickable")
const hFlex = require("../reaks/hFlex")
const label = require("../reaks/label")
const style = require("../reaks/style")
const icon = require("../reaks-material/icon")
const textInputLook = require("./textInputLook")
const dropDownIcon = require("./icons/navigation/arrowDropDown")
const hoverable = require("../reaks/hoverable")

module.exports = function(opts, onAction) {
  const { label: labelArg, iconColor } =
    isString(opts) || isFunction(opts) ? { label: opts } : opts

  return hoverable(
    {
      over: style.mixin({ backgroundColor: "rgba(0,0,0,0.1)" }),
    },
    clickable(
      onAction,
      textInputLook(
        opts,
        hFlex([
          label(labelArg),
          ["fixed", icon({ icon: dropDownIcon, color: iconColor })],
        ])
      )
    )
  )
}
