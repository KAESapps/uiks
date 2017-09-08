const style = require("reaks/style")

module.exports = ({ h, v }) => {
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
