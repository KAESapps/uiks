const swap = require("reaks/swap")
const isFunction = require("lodash/isFunction")
const empty = require("./empty")

module.exports = (condition, cases) => ctx => {
  const cond = isFunction(condition) ? condition(ctx) : condition
  return swap(() => (cases[cond() ? "truthy" : "falsy"] || empty)(ctx))
}
