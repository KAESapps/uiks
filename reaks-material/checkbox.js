const ctxCmp = require("../reaks/ctx-level-helpers/component")
const hFlex = require("reaks-layout/hFlex")
const svgIcon = require("reaks/svgIcon")
const label = require("../reaks/label").reaks
const margin = require("reaks-layout/margin")
const seq = require("reaks/seq")
const swap = require("reaks/swap")
const clickable = require("../reaks/clickable").reaksWrapper
const defaultCheckedIcon = require("./icons/toggle/checkbox")
const defaultUncheckedIcon = require("./icons/toggle/checkboxOutline")

const { observable } = require("reactivedb/obs")

module.exports = ctxCmp(
  ({
    checkedIcon = defaultCheckedIcon,
    uncheckedIcon = defaultUncheckedIcon,
    uncheckedIconColor = "black",
    checkedIconColor = "black",
    label: labelText,
  }) => {
    const isChecked = observable(false)
    const checked = svgIcon(checkedIcon)({
      size: { h: 24 },
      color: checkedIconColor,
    })
    const unchecked = svgIcon(uncheckedIcon)({
      size: { h: 24 },
      color: uncheckedIconColor,
    })

    return clickable(() => {
      isChecked(!isChecked())
    }, hFlex([[{ weight: null }, swap(() => (isChecked() ? checked : unchecked))], seq([margin({ l: 24 }), label(labelText)])]))
  }
)
