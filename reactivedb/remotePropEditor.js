/**
 * à utiliser pour modifier facilement une prop distante
 * (avec un délai entre le patch et le pulse du getValue)
 * mais quand il n'y a pas de modif effectuée par le serveur
 * et que l'on n'a pas besoin d'afficher à l'utilisateur les phases de
 * submit, success, error
 * TODO : se baser sur remoteEditor
 */

const create = require("lodash/create")
const isFunction = require("lodash/isFunction")
const { observable, transaction } = require("kobs")
const getValue = ctx => ctx.value

module.exports = (arg, view) => ctx => {
  const { entity, prop } =
    typeof arg === "string" ? { entity: getValue, prop: arg } : arg
  const getEntity = isFunction(entity) ? entity(ctx) : entity
  const getProp = isFunction(prop) ? prop(ctx) : prop

  let beforeSubmitTimeout, exitEditModeAfterSubmit
  const defaultValue = "" // TODO: rendre paramétrable ?
  const submitDelay = 100 // délai avant soumission du input (debounce)
  const editMode = observable(false)
  const inputValue = observable(defaultValue)

  const submit = () => {
    const newValue = inputValue()
    exitEditModeAfterSubmit = true
    ctx
      .patch({
        [isFunction(getEntity) ? getEntity() : getEntity]: {
          [isFunction(getProp) ? getProp() : getProp]: newValue,
        },
      })
      .then(() => {
        if (exitEditModeAfterSubmit) {
          editMode(false)
        }
      })
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
      // dans le cas d'une saisie lors d'une soumission en cours,
      // on annule le passage automatique au mode display au retour de la soumission
      exitEditModeAfterSubmit = false
      beforeSubmitTimeout = setTimeout(submit, submitDelay)
    })

  return view(create(ctx, { value, setValue }))
}
