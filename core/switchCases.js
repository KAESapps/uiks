const swap = require('reaks/swap')
module.exports = (condition, cases) => ctx => {
  const cond = condition(ctx)
  return swap(() => cases[cond()](ctx))
}
