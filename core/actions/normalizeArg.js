const isPlainObject = require("lodash/isPlainObject")

module.exports = actions =>
  actions.map(([opts, action]) => {
    return [isPlainObject(opts) ? opts : { label: opts }, action]
  })
