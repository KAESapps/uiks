// composant qui affiche value() dans un displayer mais qui sur clic/action ouvre un popup pour le modifier au lieu de le modifier inline
const clickable = require("uiks/reaks/clickable")
const pickerInDialog = require("./pickerInDialog")

module.exports = (picker, displayer, opts) =>
  clickable(pickerInDialog(picker, opts), displayer)
