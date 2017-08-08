module.exports = (arg, ctx) => (typeof arg === "function" ? arg(ctx) : arg)
