// permet de passer d'un value dynamique à un value statique
const create = require("lodash/create")
const swap = require("reaks/swap")
module.exports = cmp => ctx =>
  swap(() => cmp(create(ctx, { value: ctx.value() })))
