const swap = require("reaks/swap")

module.exports = createCtxCmpGetter => ctx => {
  console.warn("using uiks/reaks/swap can have performance issues")
  const getCtxCmp = createCtxCmpGetter(ctx)
  return swap(() => {
    const ctxCmp = getCtxCmp()
    return ctxCmp && ctxCmp(ctx)
  })
}
