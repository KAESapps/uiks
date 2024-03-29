// callback d'action ouvrant un picker dans un popup
// initialise le picker avec ctx.value() et passe la valeur modifiée à ctx.setValue() à la validation
const concat = require("lodash/concat")
const onDocumentEvent = require("reaks/onDocumentEvent")
const ctxAssign = require("uiks/core/assign")
const mix = require("uiks/reaks/mix")
const flatButton = require("./flatButton")
const button = require("./button")
const observableAsValue = require("uiks/core/observableAsValue")
const assignObservable = require("uiks/core/assignObservable")
const dialog = require("./dialog")
const popup = require("uiks/reaks/popup")
const getStaticValue = require("kobs/getStaticValue")

module.exports = (picker, opts = {}) => {
  const {
    title = "Saisir une nouvelle valeur",
    customActions,
    noValidateButton,
  } = opts
  return popup(
    { modal: true }, //évite de cliquer à côté de la popup et de fermer sans valider. Idélament il faudrait plutôt considérer que la popup est un cas d'affichage d'un éditeur inline et donc que les modif sur le picker sont enregistrées en permanence comme le reste. Il n'y aurait plus de bouton valider et annuler. Simplement, pour optimiser les cas un peu lourd, comme les richtext ou les multiline, on utiliserait un debounce et une validation auto sur onclose
    assignObservable(
      {
        internalValue: ctx => getStaticValue(ctx.value),
      },
      assignObservable(
        {
          // donne accès à la validation dans le picker
          validate: ctx => () => {
            ctx.closePopup()
            ctx.setValue(ctx.internalValue())
          },
        },
        mix(
          [
            ctx =>
              onDocumentEvent("keydown", ev => {
                const key = ev.key
                if (key === "Enter") {
                  return ctx.validate()
                }
                if (key === "Escape") {
                  return ctx.closePopup()
                }
              }),
          ],
          dialog.popupLayer({
            title,
            content: ctxAssign(
              { withPhysicalKeyboard: true },
              observableAsValue("internalValue", picker)
            ),
            actions: concat(
              [],
              customActions,
              !noValidateButton && button("Valider", ctx => ctx.validate)
            ),
            minHeight: opts.minHeight,
          })
        )
      )
    )
  )
}
