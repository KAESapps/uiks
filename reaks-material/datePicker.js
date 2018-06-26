const isFunction = require("lodash/isFunction")
const concat = require("lodash/concat")
const toString = require("lodash/toString")
const toInteger = require("lodash/toInteger")
const get = require("lodash/get")
const padStart = require("lodash/padStart")
const assign = require("lodash/assign")
const range = require("lodash/range")
const seq = require("reaks/seq")
const style = require("reaks/style")
const hFlex = require("uiks/reaks-layout/hFlex")
const vPile = require("uiks/reaks-layout/vPile")
const innerMargin = require("uiks/reaks-layout/innerMargin")
const clickable = require("uiks/reaks/clickable").reaksMixin
const label = require("uiks/reaks/label").reaks
const align = require("uiks/reaks-layout/align")
const size = require("reaks/size")
const child = require("reaks/child")
const colors = require("material-colors")
const iconButton = require("./iconButton").reaks
const clearIconDef = require("./icons/content/clear")
const { observable } = require("kobs")
const { observe } = require("kobs")

const hFlexGrid = ({ colMinWidth }, items) => {
  return seq(
    concat(
      style({
        display: "grid",
        gridTemplateColumns: `repeat(auto-fit, minmax(${colMinWidth}px, 1fr))`,
      }),
      items.map(c => child(c))
    )
  )
}

const formatDate = getValue => () => {
  const v = getValue()
  return v ? new Date(v).toLocaleDateString("fr") : ""
}
const display = val =>
  seq([
    label(formatDate(val)),
    align({ v: "center" }),
    innerMargin({ h: 10 }),
    style({
      fontSize: 18,
    }),
  ])

const padKeyStyle = (isActive, ctx) =>
  seq([
    align({ h: "center", v: "center" }),
    size({ h: 48 }),
    innerMargin({ h: 16 }),
    style({
      fontWeight: 500,
      fontSize: 20,
    }),
    style(
      () =>
        isActive()
          ? {
              color: ctx.colors.textOnPrimary,
              backgroundColor: ctx.colors.primary,
            }
          : {
              color: colors.grey[800],
              backgroundColor: colors.grey[100],
            }
    ),
  ])

const internalValuetoISOString = value => {
  if (!value) return null

  let str = ""

  if (value.year) {
    str += value.year
  }
  if (value.month) {
    str += "-" + padStart(value.month, 2, "0")
  }
  if (value.day) {
    str += "-" + padStart(value.day, 2, "0")
  }
  return str
}
const ISOStringToInternalValue = value => {
  if (!value) return null

  const [, year, month, day] = value
    .match(/(\d{4})-([01]\d)-([0-3]\d)/)
    .map(toInteger)
  return { year, month, day }
}

module.exports = () => {
  return ctx => {
    const { setValue, value } = ctx
    const internalValue = observable()
    const refYear = observable(new Date().getFullYear())

    function onUserInput() {
      const stringVal = internalValuetoISOString(internalValue())
      setValue(stringVal)
    }

    function setDateFragment(type, value) {
      const baseValue = internalValue()
      const patch = { [type]: value }

      if (type === "day") {
        if (!get(baseValue, "month")) {
          assign(patch, { month: new Date().getMonth() + 1 })
        }
      }
      if (type === "day" || type === "month") {
        if (!get(baseValue, "year")) {
          assign(patch, { year: new Date().getFullYear() })
        }
      }

      internalValue(assign(baseValue, patch))
      onUserInput()
    }

    function clearValue() {
      internalValue(null)
      onUserInput()
    }

    const updateFromExternalValue = function(externalValue) {
      if (externalValue !== internalValuetoISOString(internalValue())) {
        internalValue(ISOStringToInternalValue(externalValue))
        // on affiche les boutons d'année en cohérence avec la valeur externe
        get(internalValue(), "year") && refYear(internalValue().year)
      }
    }

    // sur changement de la valeur externe, on vérifie s'il faut mettre à jour la valeur interne
    const observeExternalChange = observe(value, function() {
      updateFromExternalValue(value())
    })

    const key = (getValue, fragmentType) => {
      return seq([
        label(() => toString(getValue())),
        clickable(() => setDateFragment(fragmentType, getValue())),
        padKeyStyle(
          () => get(internalValue(), fragmentType) === getValue(),
          ctx
        ),
      ])
    }

    const keysRow = (fragmentType, keys) =>
      hFlexGrid(
        { colMinWidth: 48 },
        keys.map(val => {
          let getValue = val
          if (!isFunction(val)) {
            getValue = () => val
          }
          return key(getValue, fragmentType)
        })
      )

    return seq([
      vPile([
        seq([
          size({ h: 48 }),
          hFlex([
            display(() => internalValuetoISOString(internalValue())),
            [
              { weight: null, align: "center" },
              iconButton(
                {
                  icon: clearIconDef,
                  color: colors.grey[600],
                },
                clearValue
              ),
            ],
          ]),
        ]),
        vPile([
          label("Année"),
          keysRow("year", [
            () => refYear() - 1,
            () => refYear(),
            () => refYear() + 1,
            () => refYear() + 2,
          ]),
          label("Mois"),
          keysRow("month", range(1, 13)),
          label("Jour"),
          keysRow("day", range(1, 32)),
        ]),
      ]),
      style({
        minWidth: 180,
      }),
      observeExternalChange,
    ])
  }
}
