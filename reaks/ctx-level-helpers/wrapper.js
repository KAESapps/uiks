const seq = require("reaks/seq")
const contextualize = require("./contextualize")
const ctxCmp = require("./component")
const map = require("lodash/map")

// Generates a wrapper with the following API:
// wrapper([options], wrappedComponent)

// Arguments:
// - createMixin: reaks-transform generator taking options as argument
// the generated transform gets applied to the same DOM-node as the wrapped component

module.exports = createMixin => {
  const reaksWrapper = function(arg1, arg2) {
    let opts, cmp

    if (arguments.length === 1) {
      cmp = arg1
    } else {
      opts = arg1
      cmp = arg2
    }

    let mixin
    if (opts !== undefined) {
      mixin = createMixin(opts)
    } else {
      mixin = createMixin()
    }
    return seq([cmp, mixin])
  }

  const ctxWrapper = function() {
    return ctx =>
      reaksWrapper.apply(
        reaksWrapper,
        map(arguments, arg => contextualize(arg, ctx))
      )
  }

  ctxWrapper.mixin = ctxCmp(createMixin)
  ctxWrapper.reaksMixin = createMixin
  ctxWrapper.reaksWrapper = reaksWrapper

  return ctxWrapper
}
