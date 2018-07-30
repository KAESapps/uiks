const component = require("./ctx-level-helpers/component")
const child = require("reaks/child")
const attr = require("reaks/attr")
const seq = require("reaks/seq")
const style = require("reaks/style")

module.exports = component(({ src }) =>
  seq([
    style({ flexDirection: "column" }),
    child(seq([attr("src", src), style({ width: "100%" })]), () =>
      document.createElement("img")
    ),
  ])
)
