const withActiveItem = require("./withActiveItem")
const activeItem = require("./activeItem")
const withEnsureItemVisible = require("./withEnsureItemVisible")
const ctxAssign = require("./assign")

module.exports = ({ next }, cmp) =>
  withActiveItem(
    withEnsureItemVisible(
      ctxAssign({ openItem: activeItem(ctx => id => id, next) }, cmp)
    )
  )
