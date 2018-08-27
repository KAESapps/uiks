const isString = require("lodash/isString")
const margin = require("uiks/reaks/margin")
const hPileWrap = require("uiks/reaks/hPileWrap")
const vPile = require("uiks/reaks/vPile")
const style = require("uiks/reaks/style")
const size = require("uiks/reaks/size")
const singleLineText = require("uiks/reaks/label")

const labelledField = (label, field) => {
  if (isString(label)) {
    label = singleLineText(label)
  }
  return vPile([style({ opacity: 0.5, fontSize: 14 }, label), field])
}

module.exports = fields =>
  margin(
    { b: 10 },
    hPileWrap(
      fields.map(([opts, field], i) => {
        const isLastItem = i + 1 === fields.length
        let cmp = margin(
          { r: isLastItem ? 0 : 25, b: 5 },
          labelledField(isString(opts) ? opts : opts.label, field)
        )

        if (opts.width || opts.widthMin) {
          return size({ w: opts.width, wMin: opts.widthMin }, cmp)
        } else return cmp
      })
    )
  )
