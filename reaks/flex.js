const isFunction = require("lodash/isFunction")
const flex = require("../reaks-layout/flex")
const contextualize = require("./ctx-level-helpers/contextualize")
const contextualizeOrderedArgs = require("./ctx-level-helpers/contextualizeOrderedArgs")

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

    return ctx =>
      reaksFlex(
        contextualize(opts, ctx),
        isFunction(args) ? args(ctx) : contextualizeOrderedArgs(args, ctx)
      )
  }

  ctxCmp.reaks = reaksFlex

  return ctxCmp
}
