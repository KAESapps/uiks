const swap = require("reaks/swap")
module.exports = (condition, cases, def) => ctx => {
  const cond = condition(ctx)
  return swap(() => {
    const c = cond()
    return (c in cases ? cases[c] : def)(ctx)
  })
}
