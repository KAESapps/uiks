const seq = require("reaks/seq")

module.exports = args => ctx => {
  return seq(args.map(arg => arg(ctx)))
}
