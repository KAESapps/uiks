// la différence par rapport à ./query est que l'argument est forcément une fonction qui est réévaluée dans le autorun
module.exports = query => ctx => {
  return () => {
    const q = query(ctx)
    if (!q) return
    return ctx.query(q)
  }
}
