const contextualizeOrderedArgs = require("./contextualizeOrderedArgs")

module.exports = transform => args => ctx => {
  return transform(contextualizeOrderedArgs(args, ctx))
}
