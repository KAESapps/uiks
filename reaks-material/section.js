const isFunction = require("lodash/isFunction")
const isString = require("lodash/isString")
const compact = require("lodash/compact")
const ctxAssign = require("uiks/core/assign")
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
      backgroundColor: ctx.colors.mediumPrimary || ctx.colors.primary,
      color: ctx.colors.mediumPrimary
        ? ctx.colors.textOnMediumPrimary || ctx.colors.darkText
        : ctx.colors.textOnPrimary,
    }),
    noBorder,
    innerMargin: innerMarginValue = { h: 12, v: 1 },
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
          ctxAssign(
            isFunction(colors)
              ? ctx => ({ fgColor: colors(ctx).color })
              : { fgColor: colors.color },
            style(
              { height: 32 },
              style(
                colors,
                border(
                  { b: { color: "#999" } },
                  innerMargin(
                    innerMarginValue,
                    hFlex([
                      style(
                        { fontWeight: 500 },
                        isString(title)
                          ? align({ v: "center" }, label(title))
                          : title
                      ),
                      ["fixed", action && align({ h: "right" }, action)],
                    ])
                  )
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
