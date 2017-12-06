const map = require("lodash/map")
const seq = require("reaks/seq")
const style = require("reaks/style")
const zPile = require("../reaks-layout/zPile")
const component = require("./ctx-level-helpers/component")

module.exports = component((views, getActive) =>
  zPile(
    map(views, (view, key) =>
      seq([view, style(() => getActive() !== key && { visibility: "hidden" })])
    )
  )
)
