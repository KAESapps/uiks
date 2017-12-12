/**
 * crée un transform d'un domNode qui va créer autant de childNodes que nécessaire et les confier à chaque composant
 */
const createDiv = require("reaks/child")
const seq = require("reaks/seq")
const concat = require("lodash/concat")
const isFunction = require("lodash/isFunction")
const assign = require("lodash/assign")
const defaults = require("lodash/defaults")
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

const asFlexParent = ({ orientation, wrap, align, overflowAllowed }) =>
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

const staticFlexChildStyle = ({ weight, wrap, align }) => {
  return assign(
    weight !== null
      ? {
          flex: weight,
          overflow: wrap ? null : "hidden",
        }
      : { display: "flex", flexShrink: 0 },
    { alignSelf: flexAlign(align) }
  )
}

const flexChildStyle = arg => {
  const { weight } = arg
  if (isFunction(weight)) {
    return () => staticFlexChildStyle(assign({}, arg, { weight: weight() }))
  } else {
    return staticFlexChildStyle(arg)
  }
}

const convertChildOpts = childOpts => {
  if (childOpts == "flex") return { weight: 1 }
  if (childOpts == "fixed") return { weight: null }
  return childOpts
}

module.exports = ({
  orientation = "row",
  defaultChildOpts,
  wrap = false,
  overflowAllowed = false,
}) =>
  function(arg1, arg2) {
    let opts, args

    if (arguments.length === 1) {
      args = arg1
      opts = {}
    } else {
      opts = convertChildOpts(arg1)
      args = arg2
    }

    const argsNormalized = args.map(c => (Array.isArray(c) ? c : [{}, c]))

    const { align: defaultAlign, weight: defaultWeight } = opts

    const flexChildren = argsNormalized.map(([childOpts, childMixin]) => {
      childOpts = convertChildOpts(childOpts)

      const { child: createChild = createDiv, weight, align } = defaults(
        {},
        childOpts,
        { weight: defaultWeight },
        defaultChildOpts
      )
      return createChild(
        seq([
          style(flexChildStyle({ orientation, wrap, weight, align })),
          childMixin,
        ])
      )
    })
    return seq(
      concat(
        asFlexParent({
          orientation,
          wrap,
          align: defaultAlign,
          overflowAllowed,
        }),
        flexChildren
      )
    )
  }
