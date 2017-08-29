const create = require("lodash/create")
const isString = require("lodash/isString")

module.exports = (getObs, view) => ctx => {
  const obs = isString(getObs) ? ctx[getObs] : getObs(ctx)
  return view(create(ctx, { getValue: obs, setValue: obs }))
}
