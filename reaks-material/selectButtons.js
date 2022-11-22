const orderedArgsCmp = require("../reaks/ctx-level-helpers/orderedArgs")
const hFlex = require("../reaks/hFlex").reaks
const vPile = require("../reaks/vPile").reaks
const isString = require("lodash/isString")
const clickable = require("../reaks/clickable").reaksMixin
const label = require("../reaks/label").reaks
const style = require("../reaks/style")
const size = require("../reaks/size")
const align = require("../reaks/align").reaks
const innerMargin = require("../reaks/innerMargin").reaksMixin
const icon = require("./icon").reaks
const seq = require("reaks/seq")
const defaults = require("lodash/defaults")

const toggleButton = (
  text,
  iconDef,
  onAction,
  isActive,
  { activeTextColor, defaultTextColor, activeBackgroundColor }
) => {
  const iconCmp =
    iconDef &&
    icon({
      icon: iconDef,
      color: () => (isActive() ? activeTextColor : defaultTextColor),
    })
  const textCmp =
    text && style.reaksWrapper(iconDef ? { fontSize: 12 } : {}, label(text))
  const content =
    iconCmp && textCmp
      ? vPile({ align: "center" }, [iconCmp, textCmp])
      : iconCmp || textCmp

  return seq([
    clickable(onAction),
    innerMargin({ h: 16 }),
    align({ h: "center", v: "center" }),
    style.reaksMixin(() => {
      return isActive()
        ? {
            backgroundColor: activeBackgroundColor,
            color: activeTextColor,
          }
        : {
            color: defaultTextColor,
          }
    }),
    content,
  ])
}

module.exports = orderedArgsCmp(
  function (opts, args) {
    if (arguments.length === 1) {
      args = opts
      opts = {}
    }

    const {
      activeBackgroundColor = "blue",
      defaultBackgroundColor = null,
      activeTextColor = "white",
      defaultTextColor = "black",
    } = opts

    return style.reaksWrapper(
      {
        borderRadius: 2,
        backgroundColor: defaultBackgroundColor,
        boxShadow:
          "rgba(0, 0, 0, 0.2) 0px 1px 4px, rgba(0, 0, 0, 0.2) 0px 1px 2px",
      },
      size.reaksWrapper(
        { hMin: 36 },
        hFlex(
          args.map(([{ isActive, onAction }, arg]) => {
            const { text, icon: iconDef } = isString(arg) ? { text: arg } : arg
            return toggleButton(text, iconDef, onAction, isActive, {
              activeTextColor,
              defaultTextColor,
              activeBackgroundColor,
            })
          })
        )
      )
    )
  },
  {
    itemArg: function (opts, items) {
      if (arguments.length === 1) {
        items = opts
        opts = {}
      }
      return [
        defaults({}, opts, {
          activeBackgroundColor: ctx => ctx.colors.primary,
          activeTextColor: ctx => ctx.colors.textOnPrimary,
          defaultTextColor: ctx => ctx.colors.fadedDarkText,
        }),
        items,
      ]
    },
    itemArgMap: itemArg => {
      let [opts, cmp] = itemArg
      if (isString(opts)) {
        const activeValue = opts
        opts = {
          isActive: ctx => () => ctx.value() === activeValue,
          onAction: ctx => () => ctx.setValue(activeValue),
        }
      }
      return [opts, cmp]
    },
  }
)
