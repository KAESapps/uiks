const flex = require("./flex")

module.exports = flex({
  orientation: "column",
  defaultChildOpts: { weight: null },
  overflowAllowed: true,
})
