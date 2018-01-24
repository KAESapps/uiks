module.exports = (opt, cmp) => {
  if (!cmp) {
    cmp = opt
    opt = undefined
  }
  return ctx => {
    const popup = opt && opt.replace ? ctx.selfPopup : ctx.popup

    return () => popup(cmp, ctx, opt)
  }
}
