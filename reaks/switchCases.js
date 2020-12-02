const isFunction = require("lodash/isFunction")
const reaksEmpty = require("lodash/noop")
const swap = require("reaks/swap")
const empty = require("./empty")

const reaksSwitchCases = (condition, cases, def = reaksEmpty) => {
  return isFunction(condition)
    ? swap(() => {
        const c = condition()
        return c in cases ? cases[c] : def
      })
    : condition in cases
    ? cases[condition]
    : def
}

const uiksSwitchCases = (condition, cases, def = empty) => ctx => {
  const cond = condition(ctx)
  cases = isFunction(cases) ? cases(ctx) : cases
  return isFunction(cond)
    ? swap(() => {
        const c = cond()
        return (c in cases ? cases[c] : def)(ctx)
      })
    : (cond in cases ? cases[cond] : def)(ctx)
}

uiksSwitchCases.reaks = reaksSwitchCases

module.exports = uiksSwitchCases
