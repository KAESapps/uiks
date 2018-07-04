const isString = require("lodash/isString")
const compact = require("lodash/compact")
const vFlex = require("uiks/reaks/vFlex")
const label = require("uiks/reaks/label")
const innerMargin = require("uiks/reaks/innerMargin")
const style = require("uiks/reaks/style")
const align = require("uiks/reaks/align")
const size = require("uiks/reaks/size")
const margin = require("uiks/reaks/margin")

module.exports = args => {
  const { title, content, action } = args
  return style(
    {
      borderRadius: 2,
      boxShadow:
        "rgba(0, 0, 0, 0.2) 0px 1px 4px, rgba(0, 0, 0, 0.2) 0px 1px 2px",
    },
    vFlex(
      compact([
        [
          "fixed",
          style(
            ctx => ({
              fontWeight: 500,
              backgroundColor: ctx.colors.primary,
              color: ctx.colors.textOnPrimary,
              height: 36,
            }),
            innerMargin(
              { h: 12 },
              align({ v: "center" }, isString(title) ? label(title) : title)
            )
          ),
        ],
        action && [
          "fixed",
          align({ h: "right" }, margin({ t: -24, r: 12 }, action)),
        ],
        ["fixed", size.mixin({ h: 4 })],
        content,
      ])
    )
  )
}
