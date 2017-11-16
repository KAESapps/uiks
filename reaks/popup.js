module.exports = (opt, cmp) => {
  if (!cmp) {
    cmp = opt
    opt = undefined
  }
  return ctx => () => ctx.popup(cmp, ctx, opt)
}
