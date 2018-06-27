/* 
permet de placer un composant dans un dialog avec un state observable propre
*/
const assignObservable = require("../core/assignObservable")
const dialog = require("./dialog")
const flatButton = require("./flatButton")
const button = require("./button")

module.exports = args =>
  assignObservable(
    args.props,
    dialog.popupLayer({
      title: args.title,
      content: args.content,
      actions: [
        flatButton({ label: "Annuler", primary: false }, ctx => ctx.closePopup),
        button("Valider", ctx => {
          const onSubmit = args.onSubmit(ctx)
          return () =>
            Promise.resolve()
              .then(onSubmit)
              .then(ctx.closePopup, err => {
                console.warn(err)
                ctx.alert({ title: "Erreur", message: err.message })
                //TODO: afficher l'erreur à l'utilisateur... mais comment ?
              })
        }),
      ],
    })
  )
