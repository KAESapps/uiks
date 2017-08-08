const contextualize = require("./contextualize")
const map = require("lodash/map")

module.exports = transform => {
  const ctxCmp = function() {
    const args = arguments
    return ctx => {
      return transform.apply(
        transform,
        map(args, arg => contextualize(arg, ctx))
      )
    }
  }

  // expose le composant de niveau reaks
  // pour faciliter la réutilisation
  ctxCmp.reaks = transform

  return ctxCmp
}
