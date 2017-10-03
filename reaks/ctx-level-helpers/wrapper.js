const seq = require("reaks/seq")
const contextualize = require("./contextualize")
const ctxCmp = require("./component")

const convertArgs = function(arg1, arg2) {
  let opts, cmp

  if (arguments.length === 1) {
    cmp = arg1
  } else {
    opts = arg1
    cmp = arg2
  }

  let mixinArgs
  if (opts !== undefined) {
    mixinArgs = [opts]
  } else {
    mixinArgs = []
  }

  return { mixinArgs, cmp }
}

// Generates a wrapper with the following API:
// wrapper([options], wrappedComponent)

// Arguments:
// - reaksMixin: reaks-transform generator taking options as argument
// the generated transform gets applied to the same DOM-node as the wrapped component

module.exports = (reaksMixin, extraParams = {}) => {
  const { mapArgs, noReaksLevel } = extraParams

  const ctxWrapper = function() {
    let { mixinArgs, cmp } = convertArgs.apply(convertArgs, arguments)
    if (mapArgs) {
      mixinArgs = mapArgs.apply(mapArgs, mixinArgs)
    }

    return ctx =>
      seq([
        cmp(ctx),
        reaksMixin.apply(reaksMixin, mixinArgs.map(a => contextualize(a, ctx))),
      ])
  }

  ctxWrapper.mixin = ctxCmp(reaksMixin, mapArgs)
  if (!noReaksLevel) {
    ctxWrapper.reaksMixin = reaksMixin
    ctxWrapper.reaksWrapper = function() {
      const { mixinArgs, cmp } = convertArgs.apply(convertArgs, arguments)
      const mixin = reaksMixin.apply(reaksMixin, mixinArgs)
      return seq([cmp, mixin])
    }
  }

  return ctxWrapper
}
