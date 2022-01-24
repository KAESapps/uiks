const isFunction = require("lodash/isFunction")
const seq = require("reaks/seq")
const child = require("reaks/child")
const style = require("reaks/style")
const contextualize = require("./ctx-level-helpers/contextualize")
const contextualizeOrderedArgs = require("./ctx-level-helpers/contextualizeOrderedArgs")

const hGridReaks = (opts, items) => {
  if (!items) {
    items = opts
    opts = {}
  }

  const { gap, minWidth = 100 } = opts

  return seq(
    [
      style({
        display: "grid",
        gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth}px, 1fr))`,
        gap: gap && `${gap}px`,
      }),
    ].concat(items.map(item => child(item)))
  )
}

const hGrid = (opts, items) => ctx => {
  if (!items) {
    items = opts
    opts = {}
  }

  return hGridReaks(
    contextualize(opts, ctx),
    isFunction(items) ? items(ctx) : contextualizeOrderedArgs(items, ctx)
  )
}

hGrid.reaks = hGridReaks

module.exports = hGrid
