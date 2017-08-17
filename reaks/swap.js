const swap = require("reaks/swap")

module.exports = createCtxCmpGetter => ctx => {
  const getCtxCmp = createCtxCmpGetter(ctx)
  return swap(() => getCtxCmp()(ctx))
}
