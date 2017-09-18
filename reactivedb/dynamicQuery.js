module.exports = query => ctx => {
  return () => ctx.query(query(ctx))
}
