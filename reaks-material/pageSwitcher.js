const isFunction = require("lodash/isFunction")
const mapValues = require("lodash/mapValues")
const pageSwap = require("./pageSwap")

module.exports = (cond, cases) => {
  return pageSwap(ctx => {
    cases = isFunction(cases) ? cases(ctx) : cases
    const ctxCond = cond(ctx)
    const ctxCases = mapValues(cases, c => c(ctx))

    return () => {
      const c = ctxCond()
      return ctxCases[c]
    }
  })
}
