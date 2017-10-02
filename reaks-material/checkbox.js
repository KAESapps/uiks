const ctxCmp = require("../reaks/ctx-level-helpers/component")
const defaults = require("lodash/defaults")
const hFlex = require("../reaks-layout/hFlex")
const svgIcon = require("reaks/svgIcon")
const label = require("../reaks/label").reaks
const margin = require("../reaks-layout/margin")
const align = require("../reaks/align").reaks
const seq = require("reaks/seq")
const swap = require("reaks/swap")
const clickable = require("../reaks/clickable").reaksWrapper
const defaultCheckedIcon = require("./icons/toggle/checkbox")
const defaultUncheckedIcon = require("./icons/toggle/checkboxOutline")
const colors = require("material-colors")

module.exports = ctxCmp(
  ({
    checkedIcon = defaultCheckedIcon,
    uncheckedIcon = defaultUncheckedIcon,
    uncheckedIconColor = colors.darkIcons.active,
    checkedIconColor = colors.teal[500],
    label: labelText,
    value,
    setValue,
  }) => {
    const checked = svgIcon(checkedIcon, {
      size: { h: 24 },
      color: checkedIconColor,
    })
    const unchecked = svgIcon(uncheckedIcon, {
      size: { h: 24 },
      color: uncheckedIconColor,
    })

    return clickable(() => {
      setValue(!value())
    }, hFlex([[{ weight: null }, swap(() => (value() ? checked : unchecked))], seq([margin({ l: 8 }), align({ v: "center" }, label(labelText))])]))
  },
  function(arg) {
    return [
      ctx =>
        defaults({}, arg, {
          uncheckedIconColor: ctx.colors.primary,
          checkedIconColor: ctx.colors.secondary,
          value: ctx => ctx.value,
          setValue: ctx => ctx.setValue,
        }),
    ]
  }
)
