const ctxComponent = require("../reaks/ctx-level-helpers/component")
const childSvg = require("reaks/childSvg")
const seq = require("reaks/seq")
const attrs = require("reaks/attrs")
const style = require("reaks/style")

module.exports = ctxComponent(
  color => {
    return childSvg(
      seq([
        style({ fill: color }),
        attrs({ viewBox: "0 0 32 32" }),
        childSvg(
          attrs({
            d:
              "M16 0 A16 16 0 0 0 16 32 A16 16 0 0 0 16 0 M16 4 A12 12 0 0 1 16 28 A12 12 0 0 1 16 4",
            opacity: ".25",
          }),
          "path"
        ),
        childSvg(
          seq([
            attrs({ d: "M16 0 A16 16 0 0 1 32 16 L28 16 A12 12 0 0 0 16 4z" }),
            childSvg(
              seq([
                attrs({
                  attributeName: "transform",
                  type: "rotate",
                  from: "0 16 16",
                  to: "360 16 16",
                  dur: "0.8s",
                  repeatCount: "indefinite",
                }),
              ]),
              "animateTransform"
            ),
          ]),
          "path"
        ),
      ])
    )
  },
  function(color) {
    if (!arguments.length) {
      return [ctx => ctx.colors.iconDefault]
    } else return arguments
  }
)
