const assign = require("lodash/assign")
const defaults = require("lodash/defaults")
const isFunction = require("lodash/isFunction")
const style = require("reaks/style")

const flexAlign = a => {
  let flexAlign = a

  if (a === "top") {
    flexAlign = "flex-start"
  }
  if (a === "bottom") {
    flexAlign = "flex-end"
  }
  if (a === "left") {
    flexAlign = "flex-start"
  }
  if (a === "right") {
    flexAlign = "flex-end"
  }

  return flexAlign
}

exports.parent = ({ orientation, wrap, align, overflowAllowed }) =>
  style(
    assign(
      {
        display: "flex",
        flexDirection: orientation,
        flexWrap: wrap ? "wrap" : null,
        alignItems: flexAlign(align),
      },
      !overflowAllowed && {
        overflow: "hidden",
      }
    )
  )

const staticFlexChildStyle = arg => {
  const { weight, wrap, align, shrinkable = true } = defaults(
    arg,
    arg.defaultChildOpts
  )
  return assign(
    weight !== null
      ? {
          overflow: wrap ? null : "hidden",
          flexGrow: weight,
          flexShrink: shrinkable ? 1 : 0,
          flexBasis: shrinkable ? 0 : "auto",
        }
      : { flexShrink: wrap ? null : 0 },
    { alignSelf: flexAlign(align) }
  )
}

exports.child = arg => {
  const { weight } = arg
  return style(
    isFunction(weight)
      ? () => staticFlexChildStyle(assign({}, arg, { weight: weight() }))
      : staticFlexChildStyle(arg)
  )
}
