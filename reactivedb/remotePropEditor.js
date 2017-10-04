/**
 * à utiliser pour modifier facilement une prop distante
 * (avec un délai entre le patch et le pulse du getValue)
 * mais quand il n'y a pas de modif effectuée par le serveur
 * et que l'on n'a pas besoin d'afficher à l'utilisateur les phases de
 * submit, success, error
 */

const create = require("lodash/create")
const { observable, transaction } = require("reactivedb/obs")

module.exports = (prop, view) => ctx => {
  let beforeSubmitTimeout, afterSubmitTimeout
  const defaultValue = ""
  const submitDelay = 100 // délai avant soumission du input (debounce)
  const displayModeDelay = 1000 // délai avant passage du mode edit au mode display
  const editMode = observable(false)
  const inputValue = observable(defaultValue)
  const submit = () => {
    const newValue = inputValue()
    ctx.patch({ [ctx.activeItem()]: { [prop]: newValue } })
    clearTimeout(afterSubmitTimeout)
    afterSubmitTimeout = setTimeout(() => editMode(false), displayModeDelay) // on repasse en mode display
  }

  const value = observable(() => {
    if (editMode()) return inputValue()
    const remoteValue = ctx.query([
      { constant: ctx.activeItem() },
      { valueOfProp: prop },
    ])
    return remoteValue.loaded ? remoteValue.value : defaultValue
  })
  const setValue = newValue =>
    transaction(() => {
      inputValue(newValue)
      if (!editMode()) editMode(true)
      clearTimeout(beforeSubmitTimeout)
      beforeSubmitTimeout = setTimeout(submit, submitDelay)
    })

  return view(create(ctx, { value, setValue }))
}
