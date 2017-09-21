const clickable = require("../reaks/clickable").reaksWrapper
const icon = require("./icon").reaks
const ctxCmp = require('../reaks/ctx-level-helpers/component')

module.exports = ctxCmp((iconArg, action) =>
    clickable(action, icon(iconArg)))
