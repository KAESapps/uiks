// callback d'action ouvrant un picker dans un popup
// initialise le picker avec ctx.value() et passe la valeur modifiée à ctx.setValue() à la validation
const concat = require("lodash/concat")
const flatButton = require("./flatButton")
const button = require("./button")
const observableAsValue = require("uiks/core/observableAsValue")
const assignObservable = require("uiks/core/assignObservable")
const dialog = require("./dialog")
const popup = require("uiks/reaks/popup")
const getStaticValue = require("kobs/getStaticValue")

module.exports = (picker, opts = {}) => {
  const { title = "Saisir une nouvelle valeur", customActions } = opts
  return popup(
    assignObservable(
      {
        internalValue: ctx => getStaticValue(ctx.value),
      },
      assignObservable(
        {
          // donne accès à la validation dans le picker
          validate: ctx => () => {
            ctx.setValue(ctx.internalValue())
            ctx.closePopup()
          },
        },
        dialog.popupLayer({
          title,
          content: observableAsValue("internalValue", picker),
          actions: concat(
            flatButton(
              { label: "Annuler", primary: false },
              ctx => ctx.closePopup
            ),
            customActions,
            button("Valider", ctx => ctx.validate)
          ),
        })
      )
    )
  )
}
