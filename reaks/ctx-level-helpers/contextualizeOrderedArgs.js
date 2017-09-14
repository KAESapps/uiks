const contextualize = require("./contextualize")
const identity = require("lodash/identity")

module.exports = (args, ctx, { itemArgMap = identity }) =>
  args.map(arg => itemArgMap(arg).map(argPart => contextualize(argPart, ctx)))
