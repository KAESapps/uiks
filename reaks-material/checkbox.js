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

    const checkbox = swap(() => (value() ? checked : unchecked))

    return clickable(() => {
      setValue(!value())
    }, labelText ? hFlex([[{ weight: null, align: "center" }, checkbox], seq([margin({ l: 8 }), label(labelText)])]) : align({ h: "center", v: "center" }, checkbox))
  },
  function(arg) {
    return [
      defaults({}, arg, {
        uncheckedIconColor: ctx => ctx.colors.primary,
        checkedIconColor: ctx => ctx.colors.secondary,
        value: ctx => ctx.value,
        setValue: ctx => ctx.setValue,
      }),
    ]
  }
)
