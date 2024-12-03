const parseISO = require("date-fns/parseISO")
const formatISO = require("date-fns/formatISO")
const getISOWeek = require("date-fns/getISOWeek")
const startOfMonth = require("date-fns/startOfMonth")
const endOfMonth = require("date-fns/endOfMonth")
const startOfISOWeek = require("date-fns/startOfISOWeek")
const endOfISOWeek = require("date-fns/endOfISOWeek")
const addDays = require("date-fns/addDays")
const differenceInCalendarDays = require("date-fns/differenceInCalendarDays")
const compact = require("lodash/compact")
const defaults = require("lodash/defaults")
const pick = require("lodash/pick")
const pickBy = require("lodash/pickBy")
const isEqual = require("lodash/isEqual")
const isFunction = require("lodash/isFunction")
const toString = require("lodash/toString")
const toInteger = require("lodash/toInteger")
const get = require("lodash/get")
const padStart = require("lodash/padStart")
const assign = require("lodash/assign")
const range = require("lodash/range")
const seq = require("reaks/seq")
const style = require("reaks/style")
const swap = require("reaks/swap")
const hFlex = require("../reaks-layout/hFlex")
const hPile = require("../reaks-layout/hPile")
const vPile = require("../reaks-layout/vPile")
const innerMargin = require("../reaks-layout/innerMargin")
const clickable = require("../reaks/clickable").reaksMixin
const label = require("../reaks/label").reaks
const displayIf = require("../reaks/displayIf").reaks
const switchBoolean = require("../reaks/switchBoolean").reaks
const align = require("../reaks-layout/align")
const size = require("../reaks/size")
const colors = require("material-colors")
const iconButton = require("./iconButton").reaks
const icon = require("./icon").reaks
const textInput = require("./textInput").reaks
const labelled = require("./labelled")
const todayIcon = require("./icons/today")
const arrowBack = require("./icons/navigation/arrowBack")
const arrowForward = require("./icons/navigation/arrowForward")
const alertIcon = require("./icons/alert/error")
const { observable } = require("kobs")
const { observe } = require("kobs")
const datePrecisionAtLeast =
  require("reactivedb/operators/utils/datePrecision").atLeast

const isValidISODate = iso => {
  const date = parseISO(iso)
  if (isNaN(date)) return false
  return true
}

const padKeyStyle = (isActive, ctx) =>
  seq([
    align({ h: "center", v: "center" }),
    size.reaksMixin({ h: keyHeight }),
    innerMargin({ h: 8 }),
    style({
      fontWeight: 500,
      fontSize: 18,
    }),
    style(() =>
      isActive()
        ? {
            color: ctx.colors.textOnPrimary,
            backgroundColor: ctx.colors.primary,
          }
        : {
            color: colors.grey[800],
            backgroundColor: colors.grey[200],
          }
    ),
  ])

const dayKeyStyle = ({ isActive, inCurrentMonth, isDisabled, nonOuvre }, ctx) =>
  seq([
    align({ h: "center", v: "center" }),
    size.reaksMixin({ h: keyHeight }),
    innerMargin({ h: 8 }),
    style({
      fontSize: 18,
    }),
    style(() =>
      isActive()
        ? {
            color: ctx.colors.textOnPrimary,
            backgroundColor: ctx.colors.primary,
            fontWeight: 500,
          }
        : inCurrentMonth && !nonOuvre
        ? isDisabled && isDisabled()
          ? {
              color: colors.grey[400],
            }
          : {
              color: colors.grey[800],
              backgroundColor: colors.grey[200],
              fontWeight: 500,
            }
        : isDisabled && isDisabled()
        ? {
            color: colors.grey[400],
          }
        : { color: colors.grey[600], backgroundColor: colors.grey[100] }
    ),
  ])

const fragmentLabels = {
  year: "Année",
  month: "Mois",
  week: "Semaine",
  day: "Jour",
  hour: "Heure",
  minute: "Min",
}

const keyHeight = 40
const dayHeaderHeight = 18

const integerInput = opts =>
  size.reaksWrapper(
    { w: (opts.fragmentId === "year" ? 4 : 2) * 12 + 12 },
    labelled.reaks(fragmentLabels[opts.fragmentId], textInput(opts))
  )

module.exports = ({
  precision = "day",
  hourMin = 0,
  hourMax = 23,
  minuteInterval = 5,
  isDayDisabled: isDayDisabledCtx,
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

    let str = padStart(value.year, 4, "0")

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
    if (!value) return null
    let isoStr = internalValuetoISOString(value)
    // si le picker permet de choisir l'heure, on doit la convertir en UTC
    if (precisionAtLeast("hour")) {
      // si les éléments de date ne permettent pas de créer une date valide, il ne faut pas que le toISOString plante
      try {
        isoStr = new Date(isoStr).toISOString()
        return isoStr
      } catch (err) {
        return null
      }
    }

    if (!isValidISODate(isoStr)) return null

    if (precision === "week") {
      return formatISO(parseISO(isoStr), { representation: "date" })
    }
    return isoStr
  }

  const dateAsInternalValue = date => {
    return pickBy({
      year: date.getFullYear(),
      month: precisionAtLeast("month") && date.getMonth() + 1,
      week: precisionAtLeast("week") && getISOWeek(date),
      day: precisionAtLeast("day") && date.getDate(),
      hour: precisionAtLeast("hour") && date.getHours(),
      minute: precisionAtLeast("minute") && date.getMinutes(),
    })
  }

  const nowAsInternalValue = () => dateAsInternalValue(new Date())

  return ctx => {
    const { setValue, value } = ctx
    const internalValue = observable(null)
    const refYear = observable(new Date().getFullYear())
    const isInternalValueValid = () => {
      const val = internalValue()
      return val === null || isValidISODate(internalValuetoISOString(val))
    }
    const isDayDisabled = isDayDisabledCtx && isDayDisabledCtx(ctx)

    const displayFragment = fragmentId => {
      return integerInput({
        value: () => {
          return toString(get(internalValue(), fragmentId))
        },
        setValue: val =>
          setDateFragment(fragmentId, val ? toInteger(val) : null),
        fragmentId,
        autoFocus:
          // pas d'autofocus sur mobile
          process.env.PLATFORM !== "android" && precision === fragmentId,
      })
    }
    const display = seq([
      hPile(
        { gap: 4 },
        compact([
          precisionAtLeast("day") && displayFragment("day"),
          precisionAtLeast("month") && displayFragment("month"),
          precisionAtLeast("week") && displayFragment("week"),
          precisionAtLeast("year") && displayFragment("year"),
          precisionAtLeast("hour") && size.reaksMixin({ w: 8 }),
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
        pickBy(now, (v, fragmentId) => get(baseValue, fragmentId) == null)
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

    const updateFromExternalValue = function (externalValue) {
      if (externalValue !== internalValuetoExternalValue(internalValue())) {
        internalValue(ISOStringToInternalValue(externalValue))
        // on affiche les boutons d'année en cohérence avec la valeur externe
        get(internalValue(), "year") && refYear(internalValue().year)
      }
    }

    // sur changement de la valeur externe, on vérifie s'il faut mettre à jour la valeur interne
    const observeExternalChange = observe(value, function () {
      updateFromExternalValue(value())
    })

    const setDay = dayValue => {
      const baseValue = internalValue()
      const patch = dayValue
      const now = nowAsInternalValue()

      // fill-in other fragments from current date
      defaults(
        patch,
        pickBy(now, (v, fragmentId) => get(baseValue, fragmentId) == null)
      )

      internalValue(assign(baseValue, patch))
      onUserInput()
    }

    const dayKey = (date, { inCurrentMonth, nonOuvre }) => {
      const dayValue = pick(dateAsInternalValue(date), ["day", "month", "year"])
      const dayIso = internalValuetoISOString(dayValue)
      const isDisabled = isDayDisabled ? () => isDayDisabled(dayIso) : false
      return seq([
        label(toString(dayValue.day)),
        switchBoolean(isDisabled, { falsy: clickable(() => setDay(dayValue)) }),
        dayKeyStyle(
          {
            isActive: () =>
              isEqual(
                pick(internalValue(), ["day", "month", "year"]),
                dayValue
              ),
            isDisabled,
            inCurrentMonth,
            nonOuvre,
          },
          ctx
        ),
      ])
    }

    const key = ({ value: val, fragmentId, label: lbl }) => {
      const getValue = isFunction(val) ? val : () => val
      if (!lbl) lbl = () => toString(getValue())
      return seq([
        label(lbl),
        clickable(() => setDateFragment(fragmentId, getValue())),
        padKeyStyle(() => get(internalValue(), fragmentId) === getValue(), ctx),
      ])
    }

    const dayKeysAsMonthCalendar = monthAsDate => {
      if (!monthAsDate) monthAsDate = new Date()
      const firstDayOfMonth = startOfMonth(monthAsDate)
      const lastDayOfMonth = endOfMonth(monthAsDate)

      const firstDayKeyAsDate = startOfISOWeek(firstDayOfMonth)
      const lastDayKeyAsDate = endOfISOWeek(lastDayOfMonth)

      const nbDays = differenceInCalendarDays(
        lastDayKeyAsDate,
        firstDayKeyAsDate
      )
      const nbWeeks = nbDays / 7
      const currentMonthIndex = monthAsDate.getMonth()

      return size.reaksWrapper(
        { h: 6 * keyHeight + dayHeaderHeight },
        vPile(
          [
            seq([
              style({ color: colors.grey[800], fontSize: 12 }),
              size.reaksWrapper(
                { h: dayHeaderHeight },
                hFlex(
                  ["L", "M", "M", "J", "V", "S", "D"].map(d =>
                    align({ h: "center" }, label(d))
                  )
                )
              ),
            ]),
          ].concat(
            range(nbWeeks).map(w =>
              hFlex(
                range(7).map(d => {
                  const dayAsDate = addDays(firstDayKeyAsDate, w * 7 + d)
                  return dayKey(dayAsDate, {
                    inCurrentMonth: dayAsDate.getMonth() === currentMonthIndex,
                    // NB: non ouvré, samedi/dimanche pour le moment,
                    // mais pourrait être issu d'une liste dynamique
                    nonOuvre: d > 4,
                  })
                })
              )
            )
          )
        )
      )
    }

    const currentDayKeysCalendar = swap(() => {
      const val = internalValue()
      let internalValueAsDate = val
        ? new Date(internalValuetoISOString(val))
        : null
      if (isNaN(internalValueAsDate)) internalValueAsDate = null
      return dayKeysAsMonthCalendar(internalValueAsDate)
    })

    const monthLabels = [
      "Jan",
      "Fév",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juil",
      "Août",
      "Sept",
      "Oct",
      "Nov",
      "Déc",
    ]
    const monthPadRow = (start, end) =>
      hFlex(
        range(start, end).map(m =>
          key({ label: monthLabels[m], value: m + 1, fragmentId: "month" })
        )
      )

    const monthsPad = vPile([monthPadRow(0, 6), monthPadRow(6, 12)])

    const keysRow = (fragmentId, keys) =>
      hFlex(keys.map(value => key({ value, fragmentId })))

    return seq([
      vPile({ gap: 12 }, [
        align(
          { h: "center" },
          hPile({ align: "bottom" }, [
            display,
            displayIf(
              () => !isInternalValueValid(),
              size.reaksWrapper(
                { h: 32 },
                align({ v: "center" }, icon({ icon: alertIcon, color: "red" }))
              )
            ),
            iconButton({ icon: todayIcon, size: { w: 32, h: 32 } }, setToNow),
          ])
        ),
        vPile(
          { gap: 8 },
          compact([
            hFlex([
              [
                "fixed",
                iconButton({ icon: arrowBack, size: { h: keyHeight } }, () =>
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
                iconButton({ icon: arrowForward, size: { h: keyHeight } }, () =>
                  refYear(refYear() + 1)
                ),
              ],
            ]),
            precisionAtLeast("month") && monthsPad,
            precisionAtLeast("week") &&
              vPile([
                label("Semaine"),
                keysRow("week", range(1, 11)),
                keysRow("week", range(11, 21)),
                keysRow("week", range(21, 32)),
                keysRow("week", range(32, 43)),
                keysRow("week", range(43, 54)),
              ]),
            precisionAtLeast("day") && currentDayKeysCalendar,
            precisionAtLeast("hour") &&
              vPile([
                label("Heure"),
                keysRow(
                  "hour",
                  range(
                    hourMin,
                    Math.floor(hourMin + (hourMax - hourMin) / 2) + 1
                  )
                ),

                keysRow(
                  "hour",
                  range(
                    Math.floor(hourMin + (hourMax - hourMin) / 2) + 1,
                    hourMax + 1
                  )
                ),
              ]),
            precisionAtLeast("minute") &&
              vPile([
                label("Minute"),
                keysRow("minute", range(0, 60, minuteInterval)),
              ]),
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
