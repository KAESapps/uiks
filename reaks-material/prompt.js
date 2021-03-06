/* 
permet de placer un composant dans un dialog avec un state observable propre
*/
const concat = require("lodash/concat")
const assignObservable = require("../core/assignObservable")
const dialog = require("./dialog")
const flatButton = require("./flatButton")
const button = require("./commandButton")

module.exports = args =>
  assignObservable(
    args.props,
    dialog.popupLayer({
      title: args.title,
      content: args.content,
      actions: concat(
        flatButton({ label: "Annuler", primary: false }, ctx => ctx.closePopup),
        args.actions,
        button("Valider", ctx => {
          const onSubmit = args.onSubmit(ctx)
          return () =>
            Promise.resolve()
              .then(onSubmit)
              .then(ctx.closePopup, err => {
                console.warn(err)
                return ctx
                  .alert({ title: "Erreur", message: err.message })
                  .then(() => Promise.reject()) // affiche une erreur sur le command button
              })
        })
      ),
    })
  )
