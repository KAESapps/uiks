const alphanumericPad = require("./alphanumericPad")
const textInputLook = require("./textInputLook")
const label = require("../reaks/label")
const switchBoolean = require("../reaks/switchBoolean")

const textFieldDisplayer = textInputLook(label())

const dialogEditor = require("./dialogEditor")

module.exports = switchBoolean(
  ctx => {
    return ctx.readOnly
  },
  {
    truthy: textFieldDisplayer,
    falsy: dialogEditor(
      alphanumericPad({ decimal: false }),
      textFieldDisplayer
    ),
  }
)
