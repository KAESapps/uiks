const multilineTextInput = require("./multilineTextInput")
const size = require("../reaks/size")
const border = require("../reaks/border")
const innerMargin = require("../reaks/innerMargin")
const multilineText = require("../reaks/multilineText")
const dialogEditor = require("./dialogEditor")

const multilineTextFieldDisplayer = size(
  { hMin: 64, wMin: 256 },
  border({ radius: 2 }, innerMargin(8, multilineText()))
)

module.exports = dialogEditor(
  multilineTextInput({
    autoFocus: true,
  }),
  multilineTextFieldDisplayer
)
