const swap = require("reaks/swap")
const empty = require("./empty")

module.exports = (condition, cases, def = empty) => ctx => {
  const cond = condition(ctx)
  return swap(() => {
    const c = cond()
    return (c in cases ? cases[c] : def)(ctx)
  })
}
