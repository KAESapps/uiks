module.exports = args => ctx => {
  return {
    title: args.title(ctx),
    content: args.content(ctx),
    action: args.action && args.action(ctx),
    canExit: args.canExit && args.canExit(ctx),
  }
}
