const contextualize = require("../reaks/ctx-level-helpers/contextualize")
module.exports = args => ctx => {
  return {
    title: contextualize(args.title, ctx),
    content: args.content(ctx),
    action: args.action && args.action(ctx),
    canExit: args.canExit && args.canExit(ctx),
  }
}
