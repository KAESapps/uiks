const isFunction = require("lodash/isFunction")
const isString = require("lodash/isString")
const swap = require("reaks/swap")
const switchBoolean = require("./switchBoolean")

const displayIf = function (condition, cmp) {
  if (isString(condition)) {
    const ctxProp = condition
    condition = ctx => ctx[ctxProp]
  }
  return switchBoolean(condition, {
    truthy: cmp,
  })
}

// retro-compat : switchBoolean n'est pas compatible reaks, donc on fait une version spéciale
displayIf.reaks = (condition, cmp) => {
  return isFunction(condition)
    ? swap(() => condition() && cmp)
    : condition && cmp
}

module.exports = displayIf
