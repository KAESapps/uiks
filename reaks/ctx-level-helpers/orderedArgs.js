const contextualize = require("./contextualize")

module.exports = transform => args => ctx => {
  return transform(
    args.map(arg => arg.map(argPart => contextualize(argPart, ctx)))
  )
}
