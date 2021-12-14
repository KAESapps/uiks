const { mapValues } = require("lodash")
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

const uiksSwitchCases =
  (condition, cases, def = empty) =>
  ctx => {
    const cond = condition(ctx)
    cases = isFunction(cases) ? cases(ctx) : cases
    cases = mapValues(cases, c => c(ctx))
    def = def(ctx)
    return reaksSwitchCases(cond, cases, def)
  }

uiksSwitchCases.reaks = reaksSwitchCases

module.exports = uiksSwitchCases
