const round = require("lodash/round")
const numericPad = require("./numericPad")
const assignCtx = require("uiks/core/assign")

//2024-02-08 : changement de l'implémentation pour passer du mode entier à décimal, avant c'était de la manipulation de texte maintenant c'est juste de la mulitplication/division
//l'idée de la manipulation de texte était d'éviter les problèmes de représentation en JS des nombres décimaux mais avec la fonction round, ça doit être bon
// l'intérêt de l'approche mathématique est qu'on n'affiche que les décimales significatives dans l'éditeur (2,1 au lieu de 2,100) et que l'implémentation est plus simple

module.exports = ({ decimalOffset, decimals, allowNegative }) => {
  if (!decimals) decimals = 0
  if (decimalOffset == null) decimalOffset = decimals
  const validateValue = decimalString => {
    const commaPosition = decimalString.indexOf(",")
    return (
      commaPosition === -1 ||
      decimalString.length - 1 - commaPosition <= decimals
    )
  }
  return assignCtx(
    {
      value: ctx => () => {
        const val = ctx.value()
        return val == null ? null : val / Math.pow(10, decimalOffset)
      },
      setValue: ctx => val =>
        ctx.setValue(
          val == null ? null : round(val * Math.pow(10, decimalOffset))
        ),
    },
    numericPad({
      decimal: !!decimals,
      allowNegative,
      toNumber: true,
      validateValue,
    })
  )
}
