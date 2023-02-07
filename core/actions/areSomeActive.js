const identity = require("lodash/identity")
const isFunction = require("lodash/isFunction")
const normalizeArg = require("./normalizeArg")

// permet de récupérer une fonction de condition (statique ou réactive selon le cas, compatible avec switchBoolean)
// pour tester si au moins une action est active
module.exports = actions => {
  actions = normalizeArg(actions)

  const conditions = actions
    .map(([{ displayIf }]) => displayIf)
    .filter(identity)

  // si aucune condition displayIf, alors c'est toujours vrai (retour statique)
  if (conditions.length === 0) return () => true
  else
    return ctx => {
      const ctxConditions = conditions.map(c => {
        const cond = isFunction(c) ? c(ctx) : c
        return isFunction(cond) ? cond : () => cond
      })
      return () => ctxConditions.some(c => c())
    }
}
