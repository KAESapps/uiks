const seq = require("reaks/seq")
const style = require("reaks/style")
const component = require("./ctx-level-helpers/component")
const baseImage = require("./baseImage")

// legacy image component, full width
module.exports = component(({ src }) =>
  seq([
    style({ flexDirection: "column" }),
    baseImage.reaks(src, { style: { width: "100%" } }),
  ])
)
