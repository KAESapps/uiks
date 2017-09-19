const child = require("reaks/child")
const seq = require("reaks/seq")
const style = require("reaks/style")

module.exports = function(opts, layers) {
  if (arguments.length === 1) {
    layers = opts
    opts = {}
  }

  const { setPositionRelative = true } = opts

  return seq([
    setPositionRelative && style({ position: "relative" }),
    seq(
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
    ),
  ])
}
