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
  const { weight, wrap, align, shrinkable } = defaults(
    arg,
    arg.defaultChildOpts
  )
  return assign(
    weight !== null
      ? {
          flex: weight,
          overflow: wrap ? null : "hidden",
        }
      : { flexShrink: wrap ? null : 0 },
    shrinkable === false && {
      flexShrink: 0,
      flexBasis: "auto",
    },
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
