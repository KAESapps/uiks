const includes = require("lodash/includes")
const isString = require("lodash/isString")
const range = require("lodash/range")
const seq = require("reaks/seq")
const style = require("reaks/style")
const onDocumentEvent = require("reaks/onDocumentEvent")
const hFlex = require("uiks/reaks-layout/hFlex")
const vPile = require("uiks/reaks-layout/vPile")
const innerMargin = require("uiks/reaks-layout/innerMargin")
const toString = require("lodash/toString")
const clickable = require("uiks/reaks/clickable").reaksMixin
const label = require("uiks/reaks/label").reaks
const align = require("uiks/reaks-layout/align")
const size = require("reaks/size")
const colors = require("material-colors")
const iconButton = require("uiks/reaks-material/iconButton").reaks
const clearIconDef = require("uiks/reaks-material/icons/content/clear")
const backspaceIcon = require("uiks/reaks-material/icons/content/backspace")
const { observable } = require("kobs")
const { observe } = require("kobs")

const display = val =>
  seq([
    label(val),
    align({ v: "center" }),
    innerMargin({ h: 10 }),
    style({
      fontSize: 18,
    }),
  ])

const padKeyStyle = seq([
  align({ h: "center", v: "center" }),
  size({ h: 48, wMin: 24 }),
  style({
    color: colors.grey[800],
    backgroundColor: colors.grey[100],
    fontWeight: 500,
    fontSize: 20,
  }),
])

const numericKeys = range(1, 10)
  .concat([0])
  .map(toString)
const alphaKeys = [
  "A",
  "Z",
  "E",
  "R",
  "T",
  "Y",
  "U",
  "I",
  "O",
  "P",
  "Q",
  "S",
  "D",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  "M",
  "W",
  "X",
  "C",
  "V",
  "B",
  "N",
]
const validKeys = numericKeys.concat(alphaKeys)

module.exports = () => {
  return ctx => {
    const { setValue, value, activeRow } = ctx
    const $stringValue = observable("")

    function onUserInput() {
      const stringVal = $stringValue()
      setValue(stringVal)
    }

    function appendChar(char) {
      const newString = $stringValue() + toString(char)
      $stringValue(newString)
      onUserInput()
    }
    function clearValue() {
      $stringValue("")
      onUserInput()
    }
    function backspace() {
      $stringValue($stringValue().slice(0, -1))
      onUserInput()
    }

    const updateFromExternalValue = function(externalValue) {
      $stringValue((externalValue || "").toString())
    }

    // sur changement de la valeur externe, on vérifie s'il faut mettre à jour la valeur interne
    const observeExternalChange = observe(value, function() {
      updateFromExternalValue(value())
    })

    // on active item change, re-init value
    const observeActiveItemChange =
      activeRow &&
      observe(activeRow, function() {
        updateFromExternalValue(value())
      })

    const charKey = (c, action) => {
      return seq([label(c), clickable(action), padKeyStyle])
    }
    const backspaceButton = seq([
      iconButton(
        {
          icon: backspaceIcon,
          color: colors.grey[600],
        },
        backspace
      ),
      padKeyStyle,
    ])

    const keysRow = keys =>
      hFlex(
        keys.map(k => {
          if (isString(k)) {
            return charKey(k, () => appendChar(k))
          } else {
            return k
          }
        })
      )

    return seq([
      vPile([
        seq([
          size({ h: 48 }),
          hFlex([
            display($stringValue),
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
          keysRow(numericKeys),
          keysRow(alphaKeys.slice(0, 10)),
          keysRow(alphaKeys.slice(10, 20)),
          keysRow(alphaKeys.slice(20, 26).concat(backspaceButton)),
        ]),
      ]),
      style({
        minWidth: 180,
      }),
      observeExternalChange,
      observeActiveItemChange,
      ctx.withPhysicalKeyboard &&
        onDocumentEvent("keydown", ev => {
          let c = ev.key
          if (c === "Backspace") {
            backspace()
            return
          }

          c = c.toUpperCase()
          if (includes(validKeys, c)) {
            appendChar(c)
          }
        }),
    ])
  }
}
