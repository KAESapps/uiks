const contextualize = require("./contextualize")

module.exports = (args, ctx) =>
  args.map(arg => arg.map(argPart => contextualize(argPart, ctx)))
