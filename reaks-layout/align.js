const style = require("reaks/style")
const child = require("reaks/child")
const seq = require("reaks/seq")

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

  return {
    parent: style({
      display: "flex",
      alignItems,
      justifyContent,
    }),
    child:
      !justifyContent &&
      style({
        flex: 1,
      }),
  }
}

module.exports = function(arg, cmp) {
  if (arguments.length === 1) {
    // return mixin
    return alignStyle(arg).parent
  }
  const { parent: parentStyle, child: childStyle } = alignStyle(arg)
  return seq([parentStyle, child(childStyle ? seq([childStyle, cmp]) : cmp)])
}
