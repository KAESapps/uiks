const isFunction = require("lodash/isFunction")
const swap = require("reaks/swap")
const empty = require("./empty")

module.exports = (condition, cases, def = empty) => ctx => {
  const cond = condition(ctx)
  return isFunction(cond)
    ? swap(() => {
        const c = cond()
        return (c in cases ? cases[c] : def)(ctx)
      })
    : (cond in cases ? cases[cond] : def)(ctx)
}
