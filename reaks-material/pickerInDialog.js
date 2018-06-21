// composant qui affiche value() dans un displayer mais qui sur clic/action ouvre un popup pour le modifier au lieu de le modifier inline
const flatButton = require("uiks/reaks-material/flatButton")
const button = require("uiks/reaks-material/button")
const observableAsValue = require("uiks/core/observableAsValue")
const assignObservable = require("uiks/core/assignObservable")
const dialog = require("uiks/reaks-material/dialog")
const popup = require("uiks/reaks/popup")

module.exports = (picker, opts = {}) => {
  const { title = "Saisir une nouvelle valeur" } = opts
  return popup(
    assignObservable(
      {
        internalValue: ctx => ctx.value(),
      },
      dialog.popupLayer({
        title,
        content: observableAsValue("internalValue", picker),
        actions: [
          flatButton(
            { label: "Annuler", primary: false },
            ctx => ctx.closePopup
          ),
          button("Valider", ctx => () => {
            ctx.setValue(ctx.internalValue())
            ctx.closePopup()
          }),
        ],
      })
    )
  )
}
