const create = require('lodash/create')
const repeat = require('reaks/repeat')

module.exports = (createGetKeys, createCmp) => ctx => {
  const getKeys = createGetKeys(ctx)
  return repeat(getKeys, key => createCmp(create(ctx, { value: key })))
}
