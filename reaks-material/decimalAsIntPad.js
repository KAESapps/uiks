const toInteger = require("lodash/toInteger")
const padEnd = require("lodash/padEnd")
const toString = require("lodash/toString")
const numericPad = require("./numericPad")

module.exports = ({ decimals }) => {
  const validateValue = decimalString => {
    const commaPosition = decimalString.indexOf(",")
    return (
      commaPosition === -1 ||
      decimalString.length - 1 - commaPosition <= decimals
    )
  }
  return numericPad({
    decimal: !!decimals,
    toNumber: false,
    validateValue,
    fromExternalValue: integer => {
      if (integer == null) return ""

      const integerString = toString(integer)
      if (!decimals) return integerString
      const intPart = integerString.slice(0, -decimals)
      const decPart = integerString.slice(-decimals)
      return (intPart || "0") + "," + decPart
    },
    toExternalValue: decimalString => {
      if (decimalString === "") return null
      if (!decimals) return toInteger(decimalString)

      const [intPart, decPart] = decimalString.split(",")
      return (
        toInteger(intPart) * Math.pow(10, decimals) +
        toInteger(padEnd(decPart, decimals, "0"))
      )
    },
  })
}
