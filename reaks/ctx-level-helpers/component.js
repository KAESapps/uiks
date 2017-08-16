const contextualize = require("./contextualize")
const map = require("lodash/map")

module.exports = createTransform => {
  const ctxCmp = function() {
    const args = arguments
    return ctx => {
      return createTransform.apply(
        createTransform,
        map(args, arg => contextualize(arg, ctx))
      )
    }
  }

  // expose le composant de niveau reaks
  // pour faciliter la réutilisation
  ctxCmp.reaks = createTransform

  return ctxCmp
}
