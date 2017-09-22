const isString = require("lodash/isString")
const swap = require("reaks/swap")
const ctxCmp = require("../reaks/ctx-level-helpers/component")

module.exports = ctxCmp(
  (condition, cmp) => {
    return swap(() => condition() && cmp)
  },
  function(condition, cmp) {
    if (isString(condition)) {
      const ctxProp = condition
      condition = ctx => ctx[ctxProp]
    }
    return [condition, cmp]
  }
)
