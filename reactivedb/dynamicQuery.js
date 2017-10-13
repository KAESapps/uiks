// la différence par rapport à ./query est que l'argument est forcément une fonction qui est réévaluée dans le autorun
module.exports = query => ctx => {
  return () => ctx.query(query(ctx))
}
