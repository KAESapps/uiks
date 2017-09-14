const orderedArgsCmp = require("../reaks/ctx-level-helpers/orderedArgs")
const hPile = require("../reaks/hPile").reaks
const isString = require("lodash/isString")
const clickable = require("../reaks/clickable").reaksMixin
const label = require("../reaks/label").reaks
const style = require("../reaks/style")
const size = require("../reaks/size")
const align = require("../reaks/align").reaksMixin
const innerMargin = require("../reaks/innerMargin").reaksMixin
const seq = require("reaks/seq")
const defaults = require("lodash/defaults")

const toggleButton = (
  text,
  onAction,
  isActive,
  { activeTextColor, defaultTextColor, activeBackgroundColor }
) =>
  seq([
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
    label(text),
  ])

module.exports = orderedArgsCmp(
  function(opts, args) {
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
          "rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px",
      },
      size.reaksWrapper(
        { h: 36 },
        hPile(
          args.map(([{ isActive, onAction }, label]) =>
            toggleButton(label, onAction, isActive, {
              activeTextColor,
              defaultTextColor,
              activeBackgroundColor,
            })
          )
        )
      )
    )
  },
  {
    itemArg: function(opts, items) {
      if (arguments.length === 1) {
        items = opts
        opts = {}
      }
      return [
        defaults({}, opts, {
          activeBackgroundColor: ctx => ctx.colors.secondary,
          activeTextColor: ctx => ctx.colors.textOnSecondary,
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
