const identity = require("lodash/identity")
const withActiveItem = require("./withActiveItem")
const activeItem = require("./activeItem")
const withEnsureItemVisible = require("./withEnsureItemVisible")
const ctxAssign = require("./assign")

module.exports = ({ next, inheritActiveItem, inheritOpenItem }, cmp) =>
  (inheritActiveItem ? identity : withActiveItem)(
    withEnsureItemVisible(
      inheritOpenItem
        ? cmp
        : ctxAssign({ openItem: activeItem(ctx => id => id, next) }, cmp)
    )
  )
