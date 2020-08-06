const swap = require("reaks/swap")
const isFunction = require("lodash/isFunction")
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
    const cond = isFunction(conditionArg) ? conditionArg(ctx) : conditionArg
    return isFunction(cond)
      ? swap(() => {
          return (cases[cond() ? "truthy" : "falsy"] || empty)(ctx)
        })
      : (cases[cond ? "truthy" : "falsy"] || empty)(ctx)
  }
}

uiksSwitch.reaks = reaksSwitch

module.exports = uiksSwitch
