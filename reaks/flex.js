const flex = require("../reaks-layout/flex")

module.exports = flexConfig => {
  const reaksFlex = flex(flexConfig)
  const ctxCmp = function(arg1, arg2) {
    let opts, args

    if (arguments.length === 1) {
      args = arg1
      opts = {}
    } else {
      opts = arg1
      args = arg2
    }

    return ctx => {
      const argsWithCtx = args.map(
        c => (Array.isArray(c) ? [c[0], c[1](ctx)] : c && c(ctx))
      )

      return reaksFlex(opts, argsWithCtx)
    }
  }

  ctxCmp.reaks = reaksFlex

  return ctxCmp
}
