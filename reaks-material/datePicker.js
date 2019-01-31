const compact = require("lodash/compact")
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
const formatDateTime = require("reactivedb/operators/formatDateTime")
const datePrecisionAtLeast = require("reactivedb/operators/utils/datePrecision")
  .atLeast

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

const padKeyStyle = (isActive, ctx) =>
  seq([
    align({ h: "center", v: "center" }),
    size({ h: 48 }),
    innerMargin({ h: 16 }),
    style({
      fontWeight: 500,
      fontSize: 20,
    }),
    style(() =>
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

module.exports = ({
  precision = "day",
  hourMin = 0,
  hourMax = 23,
  minuteInterval = 5,
} = {}) => {
  const precisionAtLeast = datePrecisionAtLeast(precision)

  const ISOStringToInternalValue = value => {
    if (!value) return null
    const date = new Date(value)
    if (isNaN(date)) return null
    return {
      year: date.getFullYear(),
      month: precisionAtLeast("month") && date.getMonth() + 1,
      day: precisionAtLeast("day") && date.getDate(),
      hour: precisionAtLeast("hour") && date.getHours(),
      minute: precisionAtLeast("minute") && date.getMinutes(),
    }
  }
  const internalValuetoISOString = value => {
    if (!value) return null

    let str = value.year

    if (precisionAtLeast("month")) {
      str += "-" + padStart(value.month, 2, "0")
    }
    if (precisionAtLeast("day")) {
      str += "-" + padStart(value.day, 2, "0")
    }
    if (precisionAtLeast("hour")) {
      str += "T" + padStart(value.hour, 2, "0")
    }
    if (precisionAtLeast("minute")) {
      str += ":" + padStart(value.minute, 2, "0")
    }
    return str
  }

  const display = val =>
    seq([
      label(() =>
        formatDateTime(val(), {
          precision,
        })
      ),
      align({ v: "center" }),
      innerMargin({ h: 10 }),
      style({
        fontSize: 18,
      }),
    ])

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

      if (precisionAtLeast("minute")) {
        if (type !== "minute") {
          if (!get(baseValue, "minute")) {
            assign(patch, { minute: new Date().getMinutes() })
          }
        }
      }

      if (precisionAtLeast("hour")) {
        if (type !== "hour") {
          if (!get(baseValue, "hour")) {
            assign(patch, { hour: new Date().getHours() })
          }
        }
      }

      if (precisionAtLeast("day")) {
        if (type !== "day") {
          if (!get(baseValue, "day")) {
            assign(patch, { day: new Date().getDate() })
          }
        }
      }

      if (precisionAtLeast("month")) {
        if (type !== "month") {
          if (!get(baseValue, "month")) {
            assign(patch, { month: new Date().getMonth() + 1 })
          }
        }
      }

      if (type !== "year") {
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
        vPile(
          compact([
            label("Année"),
            keysRow("year", [
              () => refYear() - 1,
              () => refYear(),
              () => refYear() + 1,
              () => refYear() + 2,
            ]),
            precisionAtLeast("month") && label("Mois"),
            precisionAtLeast("month") && keysRow("month", range(1, 13)),
            precisionAtLeast("day") && label("Jour"),
            precisionAtLeast("day") && keysRow("day", range(1, 32)),
            precisionAtLeast("hour") && label("Heure"),
            precisionAtLeast("hour") &&
              keysRow("hour", range(hourMin, hourMax + 1)),
            precisionAtLeast("minute") && label("Minute"),
            precisionAtLeast("minute") &&
              keysRow("minute", range(0, 60, minuteInterval)),
          ])
        ),
      ]),
      style({
        minWidth: 180,
      }),
      observeExternalChange,
    ])
  }
}
