const renderFullscreen = require("../reaks-layout/renderFullscreen")

module.exports = cmp => ctx => renderFullscreen(cmp(ctx))()
