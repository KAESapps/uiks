const isFunction = require("lodash/isFunction")
const isString = require("lodash/isString")
const clickable = require("uiks/reaks/clickable")
const label = require("uiks/reaks/label")
const hFlex = require("../reaks/hFlex")
const style = require("../reaks/style")
const icon = require("../reaks-material/icon")
const textInputLook = require("./textInputLook")
const dropDownIcon = require("./icons/navigation/arrowDropDown")
const hoverable = require("../reaks/hoverable")

module.exports = function(opts, onAction) {
  const { label: labelArg, valueDisplayer: valueDisplayerArg, iconColor } =
    isString(opts) || isFunction(opts) ? { label: opts } : opts

  const valueDisplayer = valueDisplayerArg ? valueDisplayerArg : label(labelArg)

  return clickable(
    onAction,
    hoverable(
      { over: style.mixin({ backgroundColor: "rgba(0,0,0,0.1)" }) },
      textInputLook(
        opts,
        hFlex([
          valueDisplayer,
          ["fixed", icon({ icon: dropDownIcon, color: iconColor })],
        ])
      )
    )
  )
}
