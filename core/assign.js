const create = require('lodash/create')
const isFunction = require('lodash/isFunction')
const mapValues = require('lodash/mapValues')

module.exports = (assingments, view) => ctx =>
  view(create(ctx, mapValues(assingments, v => (isFunction(v) ? v(ctx) : v))))
