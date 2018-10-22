const isFunction = require("lodash/isFunction")
const selectDialog = require("./select")
const selectButton = require("./selectButton")

module.exports = ({ items, label, title }) =>
  selectButton(
    ctx => () => label(isFunction(ctx.value) ? ctx.value() : ctx.value, ctx),
    selectDialog({
      title: title || "Choisir un élément",
      value: Array.isArray(items) ? () => () => items : items,
      itemLabel: ctx => () => label(ctx.value, ctx),
    })
  )
