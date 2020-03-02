const identity = require("lodash/identity")
const withActiveItem = require("./withActiveItem")
const activeItem = require("./activeItem")
const withEnsureItemVisible = require("./withEnsureItemVisible")
const ctxAssign = require("./assign")

module.exports = ({ next, inheritActiveItem }, cmp) =>
  (inheritActiveItem ? identity : withActiveItem)(
    withEnsureItemVisible(
      ctxAssign({ openItem: activeItem(ctx => id => id, next) }, cmp)
    )
  )
