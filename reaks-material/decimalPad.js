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
    decimal: true,
    toNumber: false,
    validateValue,
    fromExternalValue: integer => {
      const integerString = toString(integer)
      const intPart = integerString.slice(0, -decimals)
      const decPart = integerString.slice(-decimals)
      return (intPart || "0") + "," + decPart
    },
    toExternalValue: decimalString => {
      const [intPart, decPart] = decimalString.split(",")
      return (
        toInteger(intPart) * Math.pow(10, decimals) +
        toInteger(padEnd(decPart, decimals, "0"))
      )
    },
  })
}
