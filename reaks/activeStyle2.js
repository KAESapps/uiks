const style = require("./style")
const displayIf = require("./displayIf")
const mix = require("./mix")
const child = require("reaks/child")

module.exports = cmp =>
  mix(
    [
      style.mixin({ position: "relative" }),
      displayIf(
        ctx => () => ctx.activeItem() === ctx.value,
        () =>
          child(
            style.reaksMixin({
              position: "absolute",
              width: "calc(100% - 2px)",
              height: "calc(100% - 2px)",
              pointerEvents: "none",
              backgroundColor: "rgba(14,120,235,0.1)",
              mixBlendMode: "multiply",
              border: "1px solid rgb(14 120 235)",
            })
          )
      ),
    ],
    cmp
  )
