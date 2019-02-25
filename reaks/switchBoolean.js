const swap = require("reaks/swap")
const isFunction = require("lodash/isFunction")
const empty = require("./empty")

module.exports = (arg1, arg2) => ctx => {
  const conditionArg = arg2 ? arg1 : ctx.value
  const cases = arg2 ? arg2 : arg1

  const cond = isFunction(conditionArg) ? conditionArg(ctx) : conditionArg
  return isFunction(cond)
    ? swap(() => (cases[cond() ? "truthy" : "falsy"] || empty)(ctx))
    : (cases[cond ? "truthy" : "falsy"] || empty)(ctx)
}
