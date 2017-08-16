const group = require("./group")

module.exports = function(mixins, cmp) {
  return group(mixins.concat(cmp))
}
