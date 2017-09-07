const isFunction = require("lodash/isFunction")
const component = require("./ctx-level-helpers/component")
const text = require("reaks/text")
const swap = require("reaks/swap")
const vPile = require("reaks-layout/vPile")

const staticMultilineText = multilineTextValue =>
  multilineTextValue &&
  vPile(multilineTextValue.split("\n").map(line => text(line)))

module.exports = component(
  value => {
    return isFunction(value)
      ? swap(() => staticMultilineText(value()))
      : staticMultilineText(value)
  },
  // map arguments
  function() {
    if (arguments.length === 0) {
      return [ctx => ctx.value]
    }
    return arguments
  }
)
