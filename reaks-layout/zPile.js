const child = require("reaks/child")
const seq = require("reaks/seq")
const concat = require("lodash/concat")
const assign = require("lodash/assign")
const style = require("reaks/style")

module.exports = function(layers) {
  return seq(
    layers.map((layer, i) =>
      child(
        seq([
          layer,
          style({
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: i,
          }),
        ])
      )
    )
  )
}
