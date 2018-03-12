const swap = require("reaks/swap")

module.exports = ({ empty, full }) => ctx => {
  return swap(() => (ctx.value().length ? full(ctx) : empty(ctx)))
}
