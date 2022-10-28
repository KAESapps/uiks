const textInput = require("./textInput")
const textInputLook = require("./textInputLook")
const label = require("../reaks/label")
const switchBoolean = require("../reaks/switchBoolean")
const dialogEditor = require("./dialogEditor")

const textFieldDisplayer = textInputLook(label())

module.exports = switchBoolean(
  ctx => {
    return ctx.readOnly
  },
  {
    truthy: textFieldDisplayer,
    falsy: dialogEditor(
      textInput({
        autoFocus: true,
      }),
      textFieldDisplayer
    ),
  }
)
