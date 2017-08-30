const ctxCmp = require("../reaks/ctx-level-helpers/component")
const vPile = require("reaks-layout/vPile")
const checkbox = require("./checkbox").reaks
const map = require("lodash/map")
const defaults = require("lodash/defaults")

const radioUnchecked = require("./icons/toggle/radioUnchecked")
const radioChecked = require("./icons/toggle/radioChecked")

const radioButton = ({
  label,
  value,
  setValue,
  checkedIconColor,
  uncheckedIconColor,
}) =>
  checkbox({
    label,
    value,
    setValue,
    checkedIcon: radioChecked,
    uncheckedIcon: radioUnchecked,
    checkedIconColor,
    uncheckedIconColor,
  })

module.exports = ctxCmp(
  ({ choices, value, setValue, checkedIconColor, uncheckedIconColor }) => {
    return vPile(
      map(choices, (label, key) =>
        radioButton({
          label,
          value: () => value() === key,
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
        value: ctx => ctx.value,
        setValue: ctx => ctx.setValue,
      }),
    ]
  }
)
