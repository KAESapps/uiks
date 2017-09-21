const style = require("reaks/style")
const child = require('reaks/child')
const seq = require('reaks/seq')

const alignStyle = ({ h, v }) => {
  let alignItems = v
  if (v === "top") {
    alignItems = "flex-start"
  }
  if (v === "bottom") {
    alignItems = "flex-end"
  }
  let justifyContent = h
  if (h === "left") {
    justifyContent = "flex-start"
  }
  if (h === "right") {
    justifyContent = "flex-end"
  }

  return style({
    display: "flex",
    alignItems,
    justifyContent,
  })
}

module.exports = function (arg, cmp) {
  if (arguments.length === 1) {
    // return mixin
    return alignStyle(arg)
  }
  return seq([alignStyle(arg), child(cmp)])
}
