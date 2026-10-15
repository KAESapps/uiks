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
const isFunction = require("lodash/isFunction")
const style = require("reaks/style")
const attrs = require("reaks/attrs")
const childSvg = require("reaks/childSvg")
const size = require("reaks/size")

// icône "checkbox" en 2 calques : le carré et la coche (au lieu d'une coche évidée laissant voir le fond)
const boxPath =
  "M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2z"
const checkMarkPath =
  "M10 17l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
const fillStyle = color =>
  style(isFunction(color) ? () => ({ fill: color() }) : { fill: color })
const twoColorsCheckedIcon = ({ boxColor, markColor }) =>
  seq([
    style({ display: "flex" }),
    childSvg(
      seq([
        attrs({ viewBox: "0 0 24 24" }),
        size({ h: 24 }),
        childSvg(seq([attrs({ d: boxPath }), fillStyle(boxColor)]), "path"),
        childSvg(
          seq([attrs({ d: checkMarkPath }), fillStyle(markColor)]),
          "path"
        ),
      ])
    ),
  ])

module.exports = ctxCmp(
  ({
    checkedIcon = defaultCheckedIcon,
    uncheckedIcon = defaultUncheckedIcon,
    uncheckedIconColor = colors.darkIcons.active,
    checkedIconColor = colors.teal[500],
    checkMarkColor, // si défini, la coche est dessinée de cette couleur (sinon, elle est évidée)
    label: labelText,
    value,
    setValue,
  }) => {
    const checked = checkMarkColor
      ? twoColorsCheckedIcon({
          boxColor: checkedIconColor,
          markColor: checkMarkColor,
        })
      : svgIcon(checkedIcon, {
          size: { h: 24 },
          color: checkedIconColor,
        })
    const unchecked = svgIcon(uncheckedIcon, {
      size: { h: 24 },
      color: uncheckedIconColor,
    })

    const checkbox = swap(() => (value() ? checked : unchecked))

    return clickable(
      () => {
        setValue(!value())
      },
      labelText
        ? hFlex({ align: "center" }, [
            ["fixed", checkbox],
            seq([margin({ l: 8 }), label(labelText)]),
          ])
        : align({ h: "center", v: "center" }, checkbox)
    )
  },
  function (arg) {
    return [
      defaults({}, arg, {
        uncheckedIconColor: ctx => ctx.colors.primary,
        checkedIconColor: ctx => ctx.colors.primary,
        value: ctx => ctx.value,
        setValue: ctx => ctx.setValue,
      }),
    ]
  }
)
