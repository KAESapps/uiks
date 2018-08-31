const selectDialog = require("./select")
const selectButton = require("./selectButton")

module.exports = ({ items, label }) =>
  selectButton(
    ctx => () => label(ctx.value()),
    selectDialog({
      title: "Choisir un élément",
      value: Array.isArray(items) ? () => () => items : items,
      itemLabel: ctx => () => label(ctx.value),
    })
  )
