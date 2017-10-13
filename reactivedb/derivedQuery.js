module.exports = arg => ctx => {
  const subQuery = typeof arg === "function" ? arg(ctx) : arg
  const q = [{ constant: ctx.value }].concat(subQuery)
  return () => ctx.query(q)
}
