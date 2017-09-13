const orderedArgsCmp = require("../reaks/ctx-level-helpers/orderedArgs")
const button = require("./button").reaks
const hPile = require("../reaks/hPile").reaks

module.exports = orderedArgsCmp(function(opts, args) {
  if (arguments.length === 1) {
    args = opts
    opts = {}
  }

  return hPile(args.map(([action, label]) => button(label, action)))
})
