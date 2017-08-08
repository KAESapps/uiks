const create = require('lodash/create')
module.exports = (fn, view) => ctx => view(create(ctx, fn(ctx)))
