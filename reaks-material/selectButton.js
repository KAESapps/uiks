const clickable = require("../reaks/clickable")
const hFlex = require("../reaks/hFlex")
const label = require("../reaks/label")
const style = require("../reaks/style")
const icon = require("../reaks-material/icon")
const textInputLook = require("./textInputLook")
const dropDownIcon = require("./icons/navigation/arrowDropDown")
const hoverable = require("../reaks/hoverable")

module.exports = function(lab, onAction) {
  return hoverable(
    {
      over: style.mixin({ backgroundColor: "rgba(0,0,0,0.1)" }),
    },
    clickable(
      onAction,
      textInputLook(
        hFlex([label(lab), ["fixed", icon({ icon: dropDownIcon })]])
      )
    )
  )
}
