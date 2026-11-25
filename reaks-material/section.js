const isFunction = require("lodash/isFunction")
const isString = require("lodash/isString")
const isArray = require("lodash/isArray")
const contextualize = require("uiks/reaks/ctx-level-helpers/contextualize")
const compact = require("lodash/compact")
const child = require("reaks/child")
const seq = require("reaks/seq")
const reaksStyle = require("reaks/style")
const ctxAssign = require("uiks/core/assign")
const vFlex = require("uiks/reaks/vFlex")
const label = require("uiks/reaks/label")
const style = require("uiks/reaks/style")

// hauteur d'une ligne de la barre de titre : 32 px avec la marge verticale par défaut (1 px)
const LINE_HEIGHT = 30
const ACTIONS_GAP = 8

module.exports = args => {
  const {
    // pour le titre, utiliser soit "title", soit "titleText"
    title, // accepte titre en string ou composant
    titleText, // accepte titre en string ou ctx-fonction
    content,
    action, // composant, tableau de composants ou ctx-fonction renvoyant un tableau (cf. actionItems)
    colors = ctx => ({
      backgroundColor: ctx.colors.mediumPrimary || ctx.colors.primary,
      color: ctx.colors.mediumPrimary
        ? ctx.colors.textOnMediumPrimary || ctx.colors.darkText
        : ctx.colors.textOnPrimary,
    }),
    noBorder,
    innerMargin = { h: 12, v: 1 }, // format de uiks/reaks/innerMargin : { h, v } ou { t, b, l, r }
  } = args
  const getColors = ctx => (isFunction(colors) ? colors(ctx) : colors)
  const margin = (side, axis) =>
    innerMargin[side] != null ? innerMargin[side] : innerMargin[axis] || 0
  const mt = margin("t", "v")
  const mb = margin("b", "v")
  const ml = margin("l", "h")
  const mr = margin("r", "h")

  const titleCmp =
    titleText || isString(title)
      ? style(ctx => ({ color: ctx.fgColor }), label(titleText || title))
      : title

  // élément d'action de la barre, sur toute la hauteur d'une ligne (cf. actionButton heightFit)
  const actionItem = (transform, i) =>
    transform &&
    child(
      seq([
        reaksStyle({
          flex: "0 0 auto",
          marginLeft: i ? ACTIONS_GAP : 0,
          height: LINE_HEIGHT,
          display: "flex",
        }),
        transform,
      ])
    )

  // comme pour hPile : un tableau de composants, ou une ctx-fonction qui renvoie un tableau de transforms
  // (chaque action est alors un élément de la barre et passe à la ligne seule), sinon un composant
  // (les actions passent à la ligne en bloc)
  const actionItems = ctx => {
    if (!action) return []
    if (isArray(action))
      return compact(action).map((a, i) => actionItem(contextualize(a, ctx), i))
    const res = action(ctx)
    return isArray(res)
      ? compact(res).map(actionItem)
      : [actionItem(res, 0)]
  }

  // barre de titre sans débordement : si la largeur manque, elle passe sur plusieurs lignes
  // (titre, puis actions toujours alignées à droite)
  const bar = ctx =>
    seq(
      compact([
        reaksStyle({
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          // le titre occupe la place libre de sa ligne : les actions passées à la ligne restent à droite
          justifyContent: "flex-end",
          rowGap: "4px", // espace entre les lignes quand les actions passent à la ligne
          boxSizing: "border-box",
          minHeight: LINE_HEIGHT + mt + mb,
          padding: `${mt}px ${mr}px ${mb}px ${ml}px`,
          backgroundColor: getColors(ctx).backgroundColor,
          borderBottom: "1px solid #999",
        }),
        child(
          seq(
            compact([
              reaksStyle({
                flex: "1 1 auto",
                minWidth: 0,
                // hauteur fixe comme avant : un titre plus haut (ex : bouton icône) ne grandit pas la barre
                height: LINE_HEIGHT,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                fontWeight: 500,
              }),
              titleCmp && titleCmp(ctx),
            ])
          )
        ),
        ...actionItems(ctx),
      ])
    )

  return style(
    noBorder
      ? {}
      : {
          borderRadius: 2,
          boxShadow:
            "rgba(0, 0, 0, 0.2) 0px 1px 4px, rgba(0, 0, 0, 0.2) 0px 1px 2px",
        },
    vFlex(
      compact([
        ["fixed", ctxAssign(ctx => ({ fgColor: getColors(ctx).color }), bar)],
        content,
      ])
    )
  )
}
