const multilineTextInput = require("./multilineTextInput")
const size = require("../reaks/size")
const border = require("../reaks/border")
const innerMargin = require("../reaks/innerMargin")
const multilineText = require("../reaks/multilineText")
const dialogEditor = require("./dialogEditor")
const scroll = require("uiks/reaks/scroll")
const switchBoolean = require("../reaks/switchBoolean")

const multilineTextFieldDisplayer = size(
  { h: 100, wMin: 256 },
  border({ radius: 2 }, scroll(innerMargin(8, multilineText())))
)

module.exports = switchBoolean(
  ctx => {
    return ctx.readOnly
  },
  {
    truthy: multilineTextFieldDisplayer,
    falsy: dialogEditor(
      multilineTextInput({
        autoFocus: true,
      }),
      multilineTextFieldDisplayer,
      { title: ctx => ctx.model.label }
    ),
  }
)
