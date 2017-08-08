const seq = require("reaks/seq")
const contextualize = require("./contextualize")

module.exports = createMixin =>
  function(arg1, arg2) {
    let opts, cmp

    if (arguments.length === 1) {
      cmp = arg1
    } else {
      opts = arg1
      cmp = arg2
    }

    return ctx => {
      let mixin
      if (opts !== undefined) {
        mixin = createMixin(contextualize(opts, ctx))
      } else {
        mixin = createMixin()
      }
      return seq([mixin, cmp && cmp(ctx)])
    }
  }
