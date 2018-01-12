/**
 * crée un transform d'un domNode qui va créer autant de childNodes que nécessaire et les confier à chaque composant
 */
const createDiv = require("reaks/child")
const seq = require("reaks/seq")
const concat = require("lodash/concat")
const defaults = require("lodash/defaults")
const { parent: asFlexParent, child: flexChildStyle } = require("./style")

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
        seq([flexChildStyle({ orientation, wrap, weight, align }), childMixin])
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
