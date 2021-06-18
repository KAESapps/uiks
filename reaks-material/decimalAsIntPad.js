const toInteger = require("lodash/toInteger")
const padEnd = require("lodash/padEnd")
const toString = require("lodash/toString")
const padStart = require("lodash/padStart")
const numericPad = require("./numericPad")

module.exports = ({ decimalOffset, decimals, allowNegative }) => {
  if (decimalOffset != null) decimals = decimalOffset //TODO: tenir compte de "decimals" aussi dans ce cas
  const validateValue = decimalString => {
    const commaPosition = decimalString.indexOf(",")
    return (
      commaPosition === -1 ||
      decimalString.length - 1 - commaPosition <= decimals
    )
  }
  return numericPad({
    decimal: !!decimals,
    allowNegative,
    toNumber: false,
    validateValue,
    fromExternalValue: integer => {
      if (integer == null) return ""

      const sign = integer < 0 ? "-" : ""
      const integerString = padStart(toString(Math.abs(integer)), decimals, "0")
      if (!decimals) return integerString

      const intPart = integerString.slice(0, -decimals)
      const decPart = integerString.slice(-decimals)
      return sign + (intPart || "0") + "," + decPart
    },
    toExternalValue: decimalString => {
      if (decimalString === "") return null
      if (!decimals) return toInteger(decimalString)

      let sign = 1
      if (decimalString[0] === "-") {
        sign = -1
        decimalString = decimalString.slice(1)
      }

      const [intPart, decPart] = decimalString.split(",")
      return (
        sign *
        (toInteger(intPart) * Math.pow(10, decimals) +
          toInteger(padEnd(decPart, decimals, "0")))
      )
    },
  })
}
