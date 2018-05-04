const value = require("./value")
const mapValue = require("./mapValue")

module.exports = (formatter, cmp) =>
  value(mapValue(formatter, ctx => ctx.value), cmp)
