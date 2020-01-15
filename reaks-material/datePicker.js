const parseISO = require("date-fns/parseISO").default
const formatISO = require("date-fns/formatISO").default
const getISOWeek = require("date-fns/getISOWeek").default
const compact = require("lodash/compact")
const defaults = require("lodash/defaults")
const pickBy = require("lodash/pickBy")
const isFunction = require("lodash/isFunction")
const toString = require("lodash/toString")
const toInteger = require("lodash/toInteger")
const get = require("lodash/get")
const padStart = require("lodash/padStart")
const assign = require("lodash/assign")
const range = require("lodash/range")
const seq = require("reaks/seq")
const style = require("reaks/style")
const hFlex = require("../reaks-layout/hFlex")
const hPile = require("../reaks-layout/hPile")
const vPile = require("../reaks-layout/vPile")
const innerMargin = require("../reaks-layout/innerMargin")
const clickable = require("../reaks/clickable").reaksMixin
const label = require("../reaks/label").reaks
const displayIf = require("../reaks/displayIf").reaks
const align = require("../reaks-layout/align")
const size = require("../reaks/size")
const empty = require("../reaks/empty")
const colors = require("material-colors")
const iconButton = require("./iconButton").reaks
const icon = require("./icon").reaks
const button = require("./button").reaks
const textInput = require("./textInput").reaks
const labelled = require("./labelled")
const clearIconDef = require("./icons/content/clear")
const arrowBack = require("./icons/navigation/arrowBack")
const arrowForward = require("./icons/navigation/arrowForward")
const alertIcon = require("./icons/alert/error")
const { observable } = require("kobs")
const { observe } = require("kobs")
const datePrecisionAtLeast = require("reactivedb/operators/utils/datePrecision")
  .atLeast

const isValidISODate = iso => {
  const date = parseISO(iso)
  if (isNaN(date)) return false
  return true
}

const padKeyStyle = (isActive, ctx) =>
  seq([
    align({ h: "center", v: "center" }),
    size.reaksMixin({ h: 48 }),
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

const fragmentLabels = {
  year: "Année",
  month: "Mois",
  week: "Semaine",
  day: "Jour",
  hour: "Heure",
  minute: "Minute",
}

const integerInput = opts =>
  size.reaksWrapper(
    { w: (opts.fragmentId === "year" ? 4 : 2) * 20 },
    labelled.reaks(fragmentLabels[opts.fragmentId], textInput(opts))
  )

module.exports = ({
  precision = "day",
  hourMin = 0,
  hourMax = 23,
  minuteInterval = 5,
} = {}) => {
  const precisionAtLeast = datePrecisionAtLeast(precision)

  const ISOStringToInternalValue = value => {
    if (!value) return null
    const date = parseISO(value)
    if (isNaN(date)) return null

    return {
      year: date.getFullYear(),
      week: precisionAtLeast("week") && getISOWeek(date),
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
    if (precisionAtLeast("week")) {
      str += "-W" + padStart(value.week, 2, "0")
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

  const internalValuetoExternalValue = value => {
    const isoStr = internalValuetoISOString(value)
    if (!isValidISODate(isoStr)) return null

    if (precision === "week") {
      return formatISO(parseISO(isoStr), { representation: "date" })
    }
    return isoStr
  }

  const nowAsInternalValue = () =>
    pickBy({
      year: new Date().getFullYear(),
      month: precisionAtLeast("month") && new Date().getMonth() + 1,
      week: precisionAtLeast("week") && getISOWeek(new Date()),
      day: precisionAtLeast("day") && new Date().getDate(),
      hour: precisionAtLeast("hour") && new Date().getHours(),
      minute: precisionAtLeast("minute") && new Date().getMinutes(),
    })

  return ctx => {
    const { setValue, value } = ctx
    const internalValue = observable(nowAsInternalValue())
    const refYear = observable(new Date().getFullYear())
    const isInternalValueValid = () => {
      const val = internalValue()
      return val === null || isValidISODate(internalValuetoISOString(val))
    }

    const displayFragment = fragmentId => {
      return integerInput({
        value: () => {
          return toString(get(internalValue(), fragmentId))
        },
        setValue: val =>
          setDateFragment(fragmentId, val !== "" ? toInteger(val) : null),
        fragmentId,
        autoFocus: precision === fragmentId,
      })
    }
    const display = seq([
      hPile(
        { gap: 8 },
        compact([
          precisionAtLeast("day") && displayFragment("day"),
          precisionAtLeast("month") && displayFragment("month"),
          precisionAtLeast("week") && displayFragment("week"),
          precisionAtLeast("year") && displayFragment("year"),
          precisionAtLeast("hour") && displayFragment("hour"),
          precisionAtLeast("minute") && displayFragment("minute"),
        ])
      ),
      align({ v: "center" }),
      innerMargin({ h: 10 }),
      style({
        fontSize: 18,
      }),
    ])

    function onUserInput() {
      setValue(internalValuetoExternalValue(internalValue()))
    }

    function setDateFragment(type, value) {
      const baseValue = internalValue()
      const patch = { [type]: value }
      const now = nowAsInternalValue()

      // fill-in other fragments from current date
      defaults(
        patch,
        pickBy(now, (v, fragmentId) => !get(baseValue, fragmentId))
      )

      internalValue(assign(baseValue, patch))
      onUserInput()
    }

    function clearValue() {
      internalValue(null)
      onUserInput()
    }

    function setToNow() {
      internalValue(nowAsInternalValue())
      onUserInput()
    }

    const updateFromExternalValue = function(externalValue) {
      if (externalValue !== internalValuetoExternalValue(internalValue())) {
        internalValue(ISOStringToInternalValue(externalValue))
        // on affiche les boutons d'année en cohérence avec la valeur externe
        get(internalValue(), "year") && refYear(internalValue().year)
      }
    }

    // sur changement de la valeur externe, on vérifie s'il faut mettre à jour la valeur interne
    const observeExternalChange = observe(value, function() {
      updateFromExternalValue(value())
    })

    const key = (getValue, fragmentId) => {
      return seq([
        label(() => toString(getValue())),
        clickable(() => setDateFragment(fragmentId, getValue())),
        padKeyStyle(() => get(internalValue(), fragmentId) === getValue(), ctx),
      ])
    }

    const keysRow = (fragmentId, keys) =>
      hFlex(
        keys.map(val => {
          let getValue = val
          if (!isFunction(val)) {
            getValue = () => val
          }
          return key(getValue, fragmentId)
        })
      )

    return seq([
      vPile({ gap: 12 }, [
        seq([
          size.reaksMixin({ h: 48 }),
          hFlex({ align: "bottom" }, [
            ["fixed", display],
            [
              "fixed",
              displayIf(
                () => !isInternalValueValid(),
                size.reaksWrapper(
                  { h: 32 },
                  align(
                    { v: "center" },
                    icon({ icon: alertIcon, color: "red" })
                  )
                )
              ),
            ],
            empty,
            [
              "fixed",
              iconButton(
                {
                  icon: clearIconDef,
                  color: colors.grey[600],
                },
                clearValue
              ),
            ],
            ["fixed", button("Maintenant", setToNow)],
          ]),
        ]),
        vPile(
          compact([
            label("Année"),
            hFlex([
              [
                "fixed",
                iconButton({ icon: arrowBack, size: { h: 48 } }, () =>
                  refYear(refYear() - 1)
                ),
              ],
              keysRow("year", [
                () => refYear() - 1,
                () => refYear(),
                () => refYear() + 1,
                () => refYear() + 2,
              ]),
              [
                "fixed",
                iconButton({ icon: arrowForward, size: { h: 48 } }, () =>
                  refYear(refYear() + 1)
                ),
              ],
            ]),
            precisionAtLeast("month") && label("Mois"),
            precisionAtLeast("month") && keysRow("month", range(1, 13)),
            precisionAtLeast("week") && label("Semaine"),
            precisionAtLeast("week") && keysRow("week", range(1, 11)),
            precisionAtLeast("week") && keysRow("week", range(11, 21)),
            precisionAtLeast("week") && keysRow("week", range(21, 32)),
            precisionAtLeast("week") && keysRow("week", range(32, 43)),
            precisionAtLeast("week") && keysRow("week", range(43, 54)),
            precisionAtLeast("day") && label("Jour"),
            precisionAtLeast("day") && keysRow("day", range(1, 11)),
            precisionAtLeast("day") && keysRow("day", range(11, 21)),
            precisionAtLeast("day") && keysRow("day", range(21, 32)),
            precisionAtLeast("hour") && label("Heure"),
            precisionAtLeast("hour") &&
              keysRow(
                "hour",
                range(
                  hourMin,
                  Math.floor(hourMin + (hourMax - hourMin) / 2) + 1
                )
              ),
            precisionAtLeast("hour") &&
              keysRow(
                "hour",
                range(
                  Math.floor(hourMin + (hourMax - hourMin) / 2) + 1,
                  hourMax + 1
                )
              ),
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
