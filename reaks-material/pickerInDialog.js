// callback d'action ouvrant un picker dans un popup
// initialise le picker avec ctx.value() et passe la valeur modifiée à ctx.setValue() à la validation
const flatButton = require("./flatButton")
const button = require("./button")
const observableAsValue = require("uiks/core/observableAsValue")
const assignObservable = require("uiks/core/assignObservable")
const dialog = require("./dialog")
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
