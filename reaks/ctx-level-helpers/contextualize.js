const isPlainObject = require("lodash/isPlainObject")
const isFunction = require("lodash/isFunction")
const mapValues = require("lodash/mapValues")

const contextualize = (arg, ctx) =>
  isFunction(arg)
    ? arg(ctx)
    : isPlainObject(arg) ? mapValues(arg, v => contextualize(v, ctx)) : arg

module.exports = contextualize
