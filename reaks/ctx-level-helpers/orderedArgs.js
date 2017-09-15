const contextualize = require("./contextualize")
const contextualizeOrderedArgs = require("./contextualizeOrderedArgs")

module.exports = (transform, opts = {}) => {
  const { itemArg, itemArgMap } = opts
  return function() {
    const args = itemArg ? itemArg.apply(itemArg, arguments) : arguments
    return ctx => {
      if (args.length === 1) {
        return transform(contextualizeOrderedArgs(args[0], ctx, { itemArgMap }))
      }
      if (args.length === 2) {
        return transform(
          contextualize(args[0], ctx),
          contextualizeOrderedArgs(args[1], ctx, { itemArgMap })
        )
      }
    }
  }
}
