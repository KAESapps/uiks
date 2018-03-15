const create = require("lodash/create")
const isFunction = require("lodash/isFunction")
const zipObject = require("lodash/zipObject")

// wrapper for a command creator that, when called, await assigments, create command with resolved context and calling it
module.exports = (assingments, createCb) => ctx => () => {
  let subCtxProm
  if (isFunction(assingments)) {
    subCtxProm = assingments(ctx)
  } else {
    const keys = Object.keys(assingments)
    subCtxProm = Promise.all(keys.map(k => {
      const v = assingments[k]
      return Promise.resolve(isFunction(v) ? v(ctx) : v)
    }))
      .then(values => zipObject(keys, values))
  }

  return subCtxProm.then(subCtx => {
    const cb = createCb(create(ctx, subCtx))
    return cb()
  })
}
