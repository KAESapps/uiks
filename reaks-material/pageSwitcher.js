const mapValues = require("lodash/mapValues")
const isString = require("lodash/isString")
const swap = require("reaks/swap")
const label = require("../reaks/label").reaks

module.exports = (cond, cases) => {
  return ctx => {
    const ctxCond = cond(ctx)
    const ctxCases = mapValues(cases, c => c(ctx))
    return {
      title: swap(() => {
        const c = ctxCond()
        const page = ctxCases[c]
        const title = page.title
        return isString(title) ? label(title) : title
      }),
      content: swap(() => {
        const c = ctxCond()
        const page = ctxCases[c]
        return page.content
      }),
      action: swap(() => {
        const c = ctxCond()
        const page = ctxCases[c]
        return page.action
      }),
    }
  }
}
