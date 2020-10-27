/**
 * à utiliser pour modifier facilement une prop distante
 * (avec un délai entre le patch et le pulse du getValue)
 * mais quand il n'y a pas de modif effectuée par le serveur
 * et que l'on n'a pas besoin d'afficher à l'utilisateur les phases de
 * submit, success, error
 * TODO : se baser sur remoteEditor
 */
const random = require("lodash/random")
const create = require("lodash/create")
const isFunction = require("lodash/isFunction")
const { observable, transaction } = require("kobs")
const getValue = ctx => ctx.value
const defaultValue = null // TODO: rendre paramétrable ?

module.exports = (arg, view) => ctx => {
  const { entity, prop, patchOperator } =
    typeof arg === "string" ? { entity: getValue, prop: arg } : arg
  const getEntity = isFunction(entity) ? entity(ctx) : entity
  const getProp = isFunction(prop) ? prop(ctx) : prop

  let exitEditModeAfterSubmit
  const editMode = observable(false)
  const inputValue = observable(defaultValue)

  const submit = () => {
    const submitId = random(0, 1e6)
    const newValue = inputValue()
    exitEditModeAfterSubmit = submitId
    const entity = isFunction(getEntity) ? getEntity() : getEntity
    const patchPromise = patchOperator
      ? ctx.patch([{ constant: entity }, { [patchOperator]: newValue }])
      : ctx.patch({
          [entity]: {
            [isFunction(getProp) ? getProp() : getProp]: newValue,
          },
        })

    return patchPromise.then(() => {
      if (exitEditModeAfterSubmit === submitId) {
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
      // dans le cas d'une saisie lors d'une soumission en cours,
      // on annule le passage automatique au mode display au retour de la soumission
      exitEditModeAfterSubmit = false
      submit()
    })

  return view(create(ctx, { value, setValue }))
}
