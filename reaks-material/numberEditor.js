const get = require("lodash/get")
const numericPad = require("./numericPad")
const textInputLook = require("./textInputLook")
const label = require("uiks/reaks/label")
const numberToString = n =>
  get(n, "toLocaleString") ? n.toLocaleString("fr") : ""

const textFieldDisplayer = textInputLook(
  { hAlign: "right" },
  label(ctx => () => numberToString(ctx.value()))
)

const dialogEditor = require("./dialogEditor")

module.exports = opt =>
  opt && opt.readOnly
    ? textFieldDisplayer
    : dialogEditor(numericPad(opt), textFieldDisplayer)
