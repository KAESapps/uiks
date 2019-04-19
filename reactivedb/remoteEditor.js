/**
 * à utiliser pour modifier facilement une valeur distante
 * (avec un délai entre le patch et le pulse du getValue)
 * mais quand il n'y a pas de modif effectuée par le serveur
 * et que l'on n'a pas besoin d'afficher à l'utilisateur les phases de
 * submit, success, error
 * A la différence de remotePropEditor, cette implémentation n'embarque pas la logique d'entité et de propriété
 * seulement value/setValue
 */

const random = require("lodash/random")
const create = require("lodash/create")
const { observable, transaction } = require("kobs")
const defaultValue = null // TODO: rendre paramétrable ?

module.exports = view => ctx => {
  let exitEditModeAfterSubmit
  const editMode = observable(false)
  const inputValue = observable(defaultValue)

  const submit = () => {
    const submitId = random(0, 1e6)
    const newValue = inputValue()
    exitEditModeAfterSubmit = submitId
    ctx.setValue(newValue).then(() => {
      if (exitEditModeAfterSubmit === submitId) {
        // si aucun autre submit n'a été fait depuis, on peut revenir en display
        editMode(false)
      }
    })
  }

  const value = observable(() => {
    if (editMode()) return inputValue()
    const remoteValue = ctx.value()
    return remoteValue.loaded ? remoteValue.value : defaultValue
  })
  const setValue = newValue =>
    transaction(() => {
      inputValue(newValue)
      if (!editMode()) editMode(true)
      // dans le cas d'une saisie lors d'une soumission en cours,
      // on annule le passage automatique au mode display au retour de la soumission
      exitEditModeAfterSubmit = false
      submit()
    })

  return view(create(ctx, { value, setValue }))
}
