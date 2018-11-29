const mapValue = require("uiks/core/mapValue")
const decimalPad = require("./decimalAsIntPad")
const textInputLook = require("./textInputLook")
const label = require("uiks/reaks/label")
const formatDecimalFromInt = require("reactivedb/operators/formatDecimalFromInt")

const decimalDisplayer = ({ decimals }) =>
  textInputLook(label(mapValue(formatDecimalFromInt(decimals))))

const dialogEditor = require("./dialogEditor")

module.exports = opt => dialogEditor(decimalPad(opt), decimalDisplayer(opt))
