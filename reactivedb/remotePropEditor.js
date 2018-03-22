/**
 * à utiliser pour modifier facilement une prop distante
 * (avec un délai entre le patch et le pulse du getValue)
 * mais quand il n'y a pas de modif effectuée par le serveur
 * et que l'on n'a pas besoin d'afficher à l'utilisateur les phases de
 * submit, success, error
 */

const create = require("lodash/create")
const isFunction = require("lodash/isFunction")
const { observable, transaction } = require("kobs")

module.exports = (arg, view) => ctx => {
  const { entity, prop } =
    typeof arg === "string" ? { entity: "value", prop: arg } : arg
  const getEntity = isFunction(entity) ? entity(ctx) : entity
  const getProp = isFunction(prop) ? prop(ctx) : prop

  let beforeSubmitTimeout, afterSubmitTimeout
  const defaultValue = "" // TODO: rendre paramétrable ?
  const submitDelay = 100 // délai avant soumission du input (debounce)
  const displayModeDelay = 1000 // délai avant passage du mode edit au mode display
  const editMode = observable(false)
  const inputValue = observable(defaultValue)
  const submit = () => {
    const newValue = inputValue()
    ctx.patch({
      [isFunction(getEntity) ? getEntity() : getEntity]: {
        [isFunction(getProp) ? getProp() : getProp]: newValue,
      },
    })
    clearTimeout(afterSubmitTimeout)
    afterSubmitTimeout = setTimeout(() => editMode(false), displayModeDelay) // on repasse en mode display
  }

  const value = observable(() => {
    if (editMode()) return inputValue()
    const e = isFunction(getEntity) ? getEntity() : getEntity
    if (!e) return defaultValue
    const remoteValue = ctx.query([
      { constant: e },
      { valueOfProp: isFunction(getProp) ? getProp() : getProp },
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
