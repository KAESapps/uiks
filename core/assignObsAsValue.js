const create = require("lodash/create")
const { observable } = require("kobs")

// raccourci pour assignObservable + observableAsValue
module.exports = (startValue, view) => ctx => {
  const value = observable(startValue)
  return view(
    create(ctx, {
      value,
      setValue: value,
    })
  )
}
