/**
 * crée un transform d'un domNode qui va créer autant de childNodes que nécessaire et les confier à chaque composant
 */
const intersperse = require("intersperse-array")
const appendDiv = require("reaks/child")
const seq = require("reaks/seq")
const size = require("reaks/size")
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

const childCreator = ({ orientation, defaultChildOpts, wrap }) => childArg => {
  const [childOpts, childMixin] = normalizeChildArg(childArg)

  const { weight, align, shrinkable } = defaults(
    {},
    convertChildOpts(childOpts),
    defaultChildOpts
  )
  return seq([
    flexChildStyle({ orientation, wrap, weight, align, shrinkable }),
    childMixin,
  ])
}

const staticFlex = (config, childrenArg) => {
  const { child: appendChildNode = appendDiv } = config
  const createChild = childCreator(config)
  return seq(
    concat(
      asFlexParent(config),
      (config.gap
        ? intersperse(childrenArg, [
            { weight: null },
            size({ [config.orientation === "row" ? "w" : "h"]: config.gap }),
          ])
        : childrenArg
      ).map(childArg => appendChildNode(createChild(childArg)))
    )
  )
}

const dynamicFlex = (config, getChildrenArg) => {
  return seq([
    asFlexParent(config),
    repeat(
      config.gap
        ? () =>
            intersperse(getChildrenArg(), () => [
              { weight: null },
              size({ w: config.gap }),
            ])
        : getChildrenArg,
      childCreator(config)
    ),
  ])
}

module.exports = config =>
  function (arg1, arg2) {
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
      opts // pour "gap"
    )

    // opts définit les options d'un enfant par défaut, en prenant la priorité sur la config de base
    localConfig.defaultChildOpts = defaults(opts, localConfig.defaultChildOpts)

    if (isFunction(arg)) {
      return dynamicFlex(localConfig, arg)
    }

    return staticFlex(localConfig, arg)
  }
