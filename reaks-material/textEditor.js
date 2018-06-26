const textInput = require("./textInput")
const textInputLook = require("./textInputLook")
const label = require("uiks/reaks/label")
const dialogEditor = require("./dialogEditor")

const textFieldDisplayer = textInputLook(label())

module.exports = dialogEditor(
  textInput({
    autoFocus: true,
  }),
  textFieldDisplayer
)
