const hPile = require("../reaks/hPile")
const margin = require("../reaks/margin")

module.exports = actions =>
  hPile(
    { align: "center" },
    actions.map(actionItem => margin({ l: 16 }, actionItem))
  )
