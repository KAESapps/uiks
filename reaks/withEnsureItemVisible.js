const assignObservable = require("../core/assignObservable")

module.exports = cmp =>
  assignObservable(
    {
      ensureItemVisible: true,
    },
    cmp
  )
