const create = require("lodash/create")
const memoize = require("lodash/memoize")
module.exports = (valueGetter, createCmpFromCtx) => {
  return ctx => {
    const createCmp = memoize(value => createCmpFromCtx(create(ctx, { value })))
    const getValue = valueGetter(ctx)
    return () => getValue().map(createCmp)
  }
}
