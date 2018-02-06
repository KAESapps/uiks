/**
 * crée un transform d'un domNode qui va créer autant de childNodes que nécessaire et les confier à chaque composant
 */
const createDiv = require("reaks/child")
const seq = require("reaks/seq")
const repeat = require("reaks/repeat")
const concat = require("lodash/concat")
const assign = require("lodash/assign")
const isFunction = require("lodash/isFunction")
const defaults = require("lodash/defaults")
const { parent: asFlexParent, child: flexChildStyle } = require("./flex/style")

const convertChildOpts = childOpts => {
  if (childOpts == "flex") return { weight: 1 }
  if (childOpts == "fixed") return { weight: null }
  return childOpts
}

const normalizeChildArg = c => (Array.isArray(c) ? c : [{}, c])

const createChild = ({
  orientation,
  defaultChildOpts,
  wrap,
  weight: defaultWeight,
}) => childArg => {
  const [childOpts, childMixin] = normalizeChildArg(childArg)

  const { child: createChild = createDiv, weight, align } = defaults(
    {},
    convertChildOpts(childOpts),
    { weight: defaultWeight },
    defaultChildOpts
  )
  return createChild(
    seq([flexChildStyle({ orientation, wrap, weight, align }), childMixin])
  )
}

const staticFlex = (config, childrenArg) => {
  return seq(concat(asFlexParent(config), childrenArg.map(createChild(config))))
}

const dynamicFlex = (config, getChildrenArg) => {
  return seq([
    asFlexParent(config),
    repeat(getChildrenArg, createChild(config)),
  ])
}

module.exports = config =>
  function(arg1, arg2) {
    let opts, arg

    if (arguments.length === 1) {
      arg = arg1
      opts = {}
    } else {
      opts = convertChildOpts(arg1)
      arg = arg2
    }

    const localConfig = assign(
      {
        orientation: "row",
        wrap: false,
        overflowAllowed: false,
      },
      config,
      opts
    )

    if (isFunction(arg)) {
      return dynamicFlex(localConfig, arg)
    }

    return staticFlex(localConfig, arg)
  }
