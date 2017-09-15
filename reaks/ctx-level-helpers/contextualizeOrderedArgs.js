const contextualize = require("./contextualize")
const isArray = require("lodash/isArray")

module.exports = (args, ctx, opts = {}) => {
  const { itemArgMap } = opts
  return args.map(arg => {
    const itemArgMapped = itemArgMap ? itemArgMap(arg) : arg
    return isArray(itemArgMapped)
      ? itemArgMapped.map(argPart => contextualize(argPart, ctx))
      : contextualize(itemArgMapped, ctx)
  })
}
