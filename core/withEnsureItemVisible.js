const assignObservable = require("./assignObservable")

module.exports = cmp =>
  assignObservable(
    {
      ensureItemVisible: true,
    },
    cmp
  )
