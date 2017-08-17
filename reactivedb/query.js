module.exports = query => ctx => {
  const q = typeof query === 'function' ? query(ctx) : query
  return () => ctx.model.query(q)
}
