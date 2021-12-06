const isString = require("lodash/isString")
const compact = require("lodash/compact")
const hFlex = require("uiks/reaks/hFlex")
const vFlex = require("uiks/reaks/vFlex")
const label = require("uiks/reaks/label")
const innerMargin = require("uiks/reaks/innerMargin")
const style = require("uiks/reaks/style")
const align = require("uiks/reaks/align")
const border = require("uiks/reaks/border")

module.exports = args => {
  const {
    title,
    content,
    action,
    colors = ctx => ({
      backgroundColor: ctx.colors.primary,
      color: ctx.colors.textOnPrimary,
    }),
    noBorder,
  } = args
  return style(
    noBorder
      ? {}
      : {
          borderRadius: 2,
          boxShadow:
            "rgba(0, 0, 0, 0.2) 0px 1px 4px, rgba(0, 0, 0, 0.2) 0px 1px 2px",
        },
    vFlex(
      compact([
        [
          "fixed",
          style(
            {
              fontWeight: 500,
              height: 32,
            },
            style(
              colors,
              border(
                { b: { color: "#999" } },
                innerMargin(
                  { h: 12, v: 2 },
                  hFlex([
                    isString(title)
                      ? align({ v: "center" }, label(title))
                      : title,
                    ["fixed", action && align({ h: "right" }, action)],
                  ])
                )
              )
            )
          ),
        ],
        content,
      ])
    )
  )
}
