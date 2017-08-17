const contextualize = require("./contextualize")
const map = require("lodash/map")

module.exports = (createTransform, mapArgs) => {
  const ctxCmp = function() {
    return ctx => {
      const args = mapArgs ? mapArgs.apply(mapArgs, arguments) : arguments
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
