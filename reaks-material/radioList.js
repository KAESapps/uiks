const ctxCmp = require("../reaks/ctx-level-helpers/component")
const vPile = require("reaks-layout/vPile")
const checkbox = require("./checkbox").reaks
const map = require("lodash/map")
const defaults = require("lodash/defaults")

const radioUnchecked = require("./icons/toggle/radioUnchecked")
const radioChecked = require("./icons/toggle/radioChecked")

const radioButton = ({
  label,
  getValue,
  setValue,
  checkedIconColor,
  uncheckedIconColor,
}) =>
  checkbox({
    label,
    getValue,
    setValue,
    checkedIcon: radioChecked,
    uncheckedIcon: radioUnchecked,
    checkedIconColor,
    uncheckedIconColor,
  })

module.exports = ctxCmp(
  ({ choices, getValue, setValue, checkedIconColor, uncheckedIconColor }) => {
    return vPile(
      map(choices, (label, key) =>
        radioButton({
          label,
          getValue: () => getValue() === key,
          setValue: () => setValue(key),
          checkedIconColor,
          uncheckedIconColor,
        })
      )
    )
  },
  function(arg) {
    return [
      defaults({}, arg, {
        checkedIconColor: ctx => ctx.colors.secondary,
        uncheckedIconColor: ctx => ctx.colors.primary,
      }),
    ]
  }
)
