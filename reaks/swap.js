const swap = require("reaks/swap")

module.exports = createCtxCmpGetter => ctx => {
  const getCtxCmp = createCtxCmpGetter(ctx)
  return swap(() => {
    const ctxCmp = getCtxCmp()
    return ctxCmp && ctxCmp(ctx)
  })
}
