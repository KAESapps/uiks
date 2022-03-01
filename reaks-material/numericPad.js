const compact = require("lodash/compact")
const includes = require("lodash/includes")
const range = require("lodash/range")
const create = require("lodash/create")
const trim = require("lodash/trim")
const seq = require("reaks/seq")
const style = require("reaks/style")
const onDocumentEvent = require("reaks/onDocumentEvent")
const hFlex = require("uiks/reaks-layout/hFlex")
const vPile = require("uiks/reaks-layout/vPile")
const innerMargin = require("uiks/reaks-layout/innerMargin")
const toString = require("lodash/toString")
const _toNumber = require("lodash/toNumber")
const isFinite = require("lodash/isFinite")
const label = require("uiks/reaks/label").reaks
const align = require("uiks/reaks-layout/align")
const size = require("reaks/size")
const colors = require("material-colors")
const icon = require("./icon").reaks
const iconButton = require("uiks/reaks-material/iconButton").reaks
const clearIconDef = require("uiks/reaks-material/icons/content/clear")
const backspaceIcon = require("./icons/content/backspace")
const { observable } = require("kobs")
const { observe } = require("kobs")

const onTouchStart = require("../reaks/onTouchStart")

const defaultDisplay = val =>
  seq([
    label(val),
    align({ v: "center", h: "right" }),
    innerMargin({ h: 12 }),
    style({
      fontSize: 24,
      fontWeight: 500,
    }),
  ])

const normalizeInternalValue = val => {
  if (val.substr(0, 1) === ",") {
    return "0" + val
  }
  return val
}

const defaultFromExternalValue = val => toString(val).replace(".", ",")

const defaultToExternalValue = toNumber => stringVal => {
  stringVal = trim(stringVal, ",").replace(",", ".")
  return stringVal ? (toNumber ? _toNumber(stringVal) : stringVal) : null
}

module.exports = (opts = {}) => {
  const {
    decimal = true,
    toNumber = true,
    allowNegative = false,
    customDisplay,
    validateValue,
    toExternalValue: toExternalValueArg,
    fromExternalValue: fromExternalValueArg,
  } = opts

  const fromExternalValue = fromExternalValueArg || defaultFromExternalValue
  const toExternalValue = toExternalValueArg || defaultToExternalValue(toNumber)

  const validKeys = range(0, 10).map(toString)
  if (decimal) validKeys.push(",")

  return ctx => {
    const display = customDisplay
      ? val => customDisplay(val)(create(ctx, { defaultDisplay }))
      : defaultDisplay
    const { setValue, value, activeRow } = ctx
    const $stringValue = observable("")

    function onUserInput() {
      const stringVal = $stringValue()
      const numberVal = toExternalValue(stringVal)
      if (!toNumber || isFinite(numberVal) || numberVal === null) {
        setValue(numberVal)
      }
    }

    function appendChar(char) {
      const currentValue = $stringValue()
      if (char === "," && currentValue.indexOf(",") !== -1) {
        return
      }

      const nextValue = normalizeInternalValue(currentValue + char)
      if (validateValue && !validateValue(nextValue)) {
        return
      }
      $stringValue(nextValue)
      onUserInput()
    }
    function clearValue() {
      $stringValue("")
      onUserInput()
    }
    function eraseLastChar() {
      $stringValue($stringValue().slice(0, -1))
      onUserInput()
    }
    function toggleSign() {
      const currentValue = $stringValue()
      let nextValue
      if (currentValue[0] === "-") {
        nextValue = currentValue.slice(1)
      } else {
        nextValue = "-" + currentValue
      }
      $stringValue(nextValue)
      onUserInput()
    }

    const updateFromExternalValue = function (externalValue) {
      $stringValue(fromExternalValue(externalValue))
    }

    // sur changement de la valeur externe, on vérifie s'il faut mettre à jour la valeur interne
    const observeExternalChange = observe(value, function (externalValue) {
      const internalValue = $stringValue()

      // si la conversation en nombre de la valeur interne est identique à la valeur externe
      // on la garde en l'état (cas de la virgule en cours de saisie)
      if (toExternalValue(internalValue) !== externalValue) {
        updateFromExternalValue(externalValue)
      }
    })

    // on active item change, re-init value
    const observeActiveItemChange =
      activeRow &&
      observe(activeRow, function () {
        updateFromExternalValue(value())
      })

    const padKey = (content, action, { size: sizeArg = { h: 48 } } = {}) => {
      return seq([
        content,
        onTouchStart(action),
        align({ h: "center", v: "center" }),
        size(sizeArg),
        style({
          color: colors.grey[800],
          backgroundColor: colors.grey[100],
          fontWeight: 500,
          fontSize: 24,
        }),
      ])
    }
    const emptyKey = seq([
      size({ h: 48 }),
      style({
        color: colors.grey[800],
        backgroundColor: colors.grey[100],
      }),
    ])

    const charPadKey = n => padKey(label(toString(n)), () => appendChar(n))
    const numberKeysRow = (from, to) =>
      hFlex(range(from, to + 1).map(charPadKey))

    return seq([
      vPile([
        hFlex(
          compact([
            allowNegative && [
              "fixed",
              seq([
                padKey(label("+/-"), toggleSign, { size: { w: 48, h: 36 } }),
              ]),
            ],
            seq([size({ h: 36 }), display($stringValue)]),
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
          ])
        ),
        vPile([
          numberKeysRow(7, 9),
          numberKeysRow(4, 6),
          numberKeysRow(1, 3),
          hFlex(
            [charPadKey(0)].concat([
              decimal ? charPadKey(",") : emptyKey,
              padKey(
                icon({
                  icon: backspaceIcon,
                  color: colors.grey[800],
                }),
                eraseLastChar
              ),
            ])
          ),
        ]),
      ]),
      style({
        minWidth: 150,
      }),
      observeExternalChange,
      observeActiveItemChange,
      ctx.withPhysicalKeyboard &&
        onDocumentEvent("keydown", ev => {
          let c = ev.key
          if (c === "Backspace") {
            eraseLastChar()
            return
          }

          if (c === "-" && allowNegative) {
            toggleSign()
            return
          }

          if (c === ".") c = ","
          if (includes(validKeys, c)) {
            appendChar(c)
          }
        }),
    ])
  }
}
