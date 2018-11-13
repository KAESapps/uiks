const formatDecimal = require("reactivedb/operators/formatDecimal")
const mapValue = require("uiks/core/mapValue")
const decimalPad = require("./decimalPad")
const textInputLook = require("./textInputLook")
const label = require("uiks/reaks/label")

const decimalDisplayer = ({ decimals }) => {
  const toFloat = int => int / Math.pow(10, decimals)
  const formatFloat = formatDecimal(decimals)
  const format = v => formatFloat(toFloat(v))

  return textInputLook(label(mapValue(format)))
}

const dialogEditor = require("./dialogEditor")

module.exports = opt => dialogEditor(decimalPad(opt), decimalDisplayer(opt))
