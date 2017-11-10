const create = require("lodash/create")
const mapValues = require("lodash/mapValues")
const { observable } = require("kobs")

module.exports = (values, view) => ctx => {
  const obsValues = mapValues(values, defaultValue =>
    observable(
      typeof defaultValue === "function" ? defaultValue(ctx) : defaultValue
    )
  )

  return view(create(ctx, obsValues))
}
