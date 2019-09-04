const isString = require("lodash/isString")
const switchBoolean = require("./switchBoolean")

module.exports = (condition, cmp) => {
  if (isString(condition)) {
    const ctxProp = condition
    condition = ctx => ctx[ctxProp]
  }
  return switchBoolean(condition, {
    truthy: cmp,
  })
}
