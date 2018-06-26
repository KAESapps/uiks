const alphanumericPad = require("./alphanumericPad")
const textInputLook = require("./textInputLook")
const label = require("uiks/reaks/label")

const textFieldDisplayer = textInputLook(label())

const dialogEditor = require("./dialogEditor")

module.exports = dialogEditor(
  alphanumericPad({ decimal: false }),
  textFieldDisplayer
)
