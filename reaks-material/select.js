const concat = require("lodash/concat")
const dialog = require("../reaks-material/dialog")
const selectableList = require("../reaks/selectableList")

/* 
générateur de cb qui affiche une liste d'éléments sélectionnables dans un dialog
*/

module.exports = args =>
  dialog({
    title: args.title,
    content: selectableList({
      value: args.value,
      itemLabel: args.itemLabel,
      onSelect: ctx => {
        const cb = args.onSelect ? args.onSelect(ctx) : ctx.setValue
        return v => {
          cb(v)
          ctx.closePopup()
        }
      },
    }),
    actions: concat(dialog.cancelButton(), args.actions),
  })
