const mapValues = require("lodash/mapValues")
const pageSwap = require("./pageSwap")

module.exports = (cond, cases) =>
  pageSwap(ctx => {
    const ctxCond = cond(ctx)
    const ctxCases = mapValues(cases, c => c(ctx))

    return () => {
      const c = ctxCond()
      return ctxCases[c]
    }
  })
