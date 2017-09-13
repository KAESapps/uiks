const contextualize = require("./contextualize")
const contextualizeOrderedArgs = require("./contextualizeOrderedArgs")

module.exports = transform =>
  function(opts, args) {
    return ctx => {
      if (arguments.length === 1) {
        return transform(contextualizeOrderedArgs(opts, ctx))
      }
      if (arguments.length === 2) {
        return transform(
          contextualize(opts, ctx),
          contextualizeOrderedArgs(args, ctx)
        )
      }
    }
  }
