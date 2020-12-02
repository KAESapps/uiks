const swap = require("reaks/swap")
const isFunction = require("lodash/isFunction")
const memoize = require("lodash/memoize")
const reaksEmpty = require("lodash/noop")
const empty = require("./empty")

const reaksSwitch = (condition, cases) => {
  return isFunction(condition)
    ? swap(() => cases[condition() ? "truthy" : "falsy"] || reaksEmpty)
    : cases[condition ? "truthy" : "falsy"] || reaksEmpty
}

const uiksSwitch = (arg1, arg2) => {
  const conditionArg = arg2 ? arg1 : ctx => ctx.value
  const cases = arg2 ? arg2 : arg1

  return ctx => {
    const truthy = memoize(() => (cases.truthy ? cases.truthy(ctx) : empty))
    const falsy = memoize(() => (cases.falsy ? cases.falsy(ctx) : empty))

    const cond = isFunction(conditionArg) ? conditionArg(ctx) : conditionArg
    return isFunction(cond)
      ? swap(() => {
          return cond() ? truthy() : falsy()
        })
      : cond
      ? truthy()
      : falsy()
  }
}

uiksSwitch.reaks = reaksSwitch

module.exports = uiksSwitch
