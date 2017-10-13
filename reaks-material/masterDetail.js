const create = require("lodash/create")
const hFlex = require("../reaks/hFlex")
const displayIf = require("../reaks/displayIf")
const swap = require("reaks/swap")
const vFlex = require("../reaks/vFlex")
const hPile = require("../reaks/hPile")
const border = require("../reaks/border")
const align = require("../reaks/align")
const innerMargin = require("../reaks/innerMargin")
const iconButton = require("./iconButton")
const closeIcon = require("./icons/content/clear")
const itemView = createCmp => {
  let currentItemId = null
  let currentCmp

  return ctx =>
    swap(() => {
      const itemId = ctx.activeItem()
      if (itemId == currentItemId) {
        console.info("set activeItem called with same value", itemId)
      } else {
        currentItemId = itemId
        currentCmp = itemId ? createCmp(create(ctx, { value: itemId })) : null
      }
      return currentCmp
    })
}

module.exports = ({ master, detail, detailActions }) => {
  return hFlex([
    master,
    [
      { weight: ctx => () => (ctx.activeItem() ? 1 : 0) },
      itemView(
        border(
          {
            l: {
              width: 1,
              color: "#ddd",
            },
          },
          vFlex([
            [
              "fixed",
              border(
                {
                  b: {
                    width: 1,
                    color: "#ddd",
                  },
                },
                hFlex([
                  innerMargin({ h: 16, v: 8 }, hPile(detailActions)),
                  [
                    "fixed",
                    align(
                      { v: "center" },
                      innerMargin(
                        { r: 8 },
                        iconButton(
                          ctx => ({
                            icon: closeIcon,
                            color: ctx.colors.iconDefault,
                          }),
                          ctx => () => ctx.setActiveItem(null)
                        )
                      )
                    ),
                  ],
                ])
              ),
            ],
            detail,
          ])
        )
      ),
    ],
  ])
}
