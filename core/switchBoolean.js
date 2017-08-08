const swap = require('reaks/swap')
const isFunction = require('lodash/isFunction')
module.exports = (condition, cases) => ctx => {
  const cond = isFunction(condition) ? condition(ctx) : condition
  return swap(() => (cond() ? cases['truthy'] : cases['falsy'])(ctx))
}
