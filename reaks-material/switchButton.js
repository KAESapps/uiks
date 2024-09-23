const empty = require("../reaks/empty")
const backgroundColor = require("../reaks/backgroundColor")
const border = require("../reaks/border")
const align = require("../reaks/align")
const zPile = require("../reaks/zPile")
const clickable = require("../reaks/clickable")
const size = require("../reaks/size")
const style = require("../reaks/style")

const checkIcon = require("./icons/action/done")
const clearIcon = require("./icons/content/clear")
const icon = require("./icon")
const switchBoolean = require("../reaks/switchBoolean")

const roundCursor = ({
  activeIcon,
  inactiveIcon,
  activeColor,
  inactiveColor,

  cursorDiam,
  cursorBorderWidth,
  cursorBorderColor,
}) =>
  style(
    ctx => () => ({
      backgroundColor: ctx.value() ? activeColor : inactiveColor,
      color: "white",
      boxShadow:
        "rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px",
    }),
    border(
      {
        width: cursorBorderWidth,
        color: cursorBorderColor,
        radius: cursorDiam / 2,
      },
      size(
        { h: cursorDiam, w: cursorDiam },
        align(
          { v: "center", h: "center" },
          switchBoolean(ctx => () => ctx.value(), {
            truthy: icon({
              icon: activeIcon,
              size: { h: cursorDiam * 0.6 },
              color: "white",
            }),
            falsy: icon({
              icon: inactiveIcon,
              size: { h: cursorDiam * 0.6 },
              color: "gray",
            }),
          })
        )
      )
    )
  )

module.exports = ({
  truthy,
  falsy,
  cursorDiam = 22,
  slideWidth = 36,
  slideThickness = 12,
  cursorMargin = 0,
  cursorBorderWidth = 2,
  cursorBorderColor = "white",
} = {}) => {
  const {
    value: truthyValue = true,
    icon: activeIcon = checkIcon,
    color: activeColor = "limegreen",
  } = truthy || {}
  const {
    value: falsyValue = null,
    icon: inactiveIcon = clearIcon,
    color: inactiveColor = "#DDD",
  } = falsy || {}
  return clickable(
    ctx => () => ctx.setValue(ctx.value() ? falsyValue : truthyValue),
    size(
      { w: slideWidth },
      zPile([
        align(
          { v: "center" },
          size(
            { h: slideThickness },
            border(
              { radius: slideThickness / 2 },
              backgroundColor("#EEE", empty)
            )
          )
        ),
        align(
          { h: "left", v: "center" },
          style(
            { position: "relative", transition: "left 0.1s" },
            style(
              ctx => () => ({
                left: `${
                  ctx.value()
                    ? slideWidth - cursorDiam - cursorMargin
                    : cursorMargin
                }px`,
              }),
              roundCursor({
                activeIcon,
                inactiveIcon,
                activeColor,
                inactiveColor,
                cursorDiam,
                cursorBorderWidth,
                cursorBorderColor,
              })
            )
          )
        ),
      ])
    )
  )
}
