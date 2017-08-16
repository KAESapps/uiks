const ctxCmp = require("../reaks/ctx-level-helpers/component")
const vPile = require("reaks-layout/vPile")
const checkbox = require("./checkbox").reaks
const map = require("lodash/map")

const radioUnchecked = require("./icons/toggle/radioUnchecked")
const radioChecked = require("./icons/toggle/radioChecked")

const radioButton = ({ label, getValue, setValue }) =>
  checkbox({
    label,
    getValue,
    setValue,
    checkedIcon: radioChecked,
    uncheckedIcon: radioUnchecked,
  })

module.exports = ctxCmp(({ choices, getValue, setValue }) => {
  return vPile(
    map(choices, (label, key) =>
      radioButton({
        label,
        getValue: () => getValue() === key,
        setValue: () => setValue(key),
      })
    )
  )
})
