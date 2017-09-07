const swap = require("reaks/swap")
const ctxCmp = require("../reaks/ctx-level-helpers/component")

module.exports = ctxCmp((condition, cmp) => swap(() => condition() && cmp))
