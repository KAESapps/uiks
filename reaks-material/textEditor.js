const textInput = require("uiks/reaks-material/textInput")
const textInputLook = require("uiks/reaks-material/textInputLook")
const label = require("uiks/reaks/label")
const dialogEditor = require("./dialogEditor")

const textFieldDisplayer = textInputLook(label())

module.exports = dialogEditor(
  textInput({
    autoFocus: true,
  }),
  textFieldDisplayer
)
