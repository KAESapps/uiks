const datePicker = require("./datePicker")
const formatValue = require("../core/formatValue")
const textInputLook = require("./textInputLook")
const size = require("../reaks/size")
const align = require("../reaks/align")
const label = require("../reaks/label")
const formatDate = require("reactivedb/operators/formatDate")
const switchBoolean = require("../reaks/switchBoolean")

const textFieldDisplayer = size(
  { wMin: 100 },
  align({ v: "bottom" }, textInputLook(formatValue(formatDate, label())))
)

const dialogEditor = require("./dialogEditor")

module.exports = switchBoolean(
  ctx => {
    return ctx.readOnly
  },
  {
    truthy: textFieldDisplayer,
    falsy: dialogEditor(datePicker(), textFieldDisplayer),
  }
)
