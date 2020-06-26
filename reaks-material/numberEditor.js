const get = require("lodash/get")
const numericPad = require("./numericPad")
const textInputLook = require("./textInputLook")
const label = require("uiks/reaks/label")
const numberToString = (n) =>
  get(n, "toLocaleString") ? n.toLocaleString("fr") : ""

const textFieldDisplayer = textInputLook(
  label((ctx) => () => numberToString(ctx.value()))
)

const dialogEditor = require("./dialogEditor")

module.exports = (opt) => dialogEditor(numericPad(opt), textFieldDisplayer)
