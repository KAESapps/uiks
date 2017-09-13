const ctxCmp = require("../reaks/ctx-level-helpers/component")
const hFlex = require("../reaks/hFlex").reaks
const size = require("../reaks/size").reaksWrapper
const border = require("../reaks/border").reaksWrapper

module.exports = ctxCmp((panel, content) =>
  hFlex([
    [
      "fixed",
      border(
        {
          r: {
            width: 1,
            color: "#ddd",
          },
        },
        size({ w: 300 }, panel)
      ),
    ],
    content,
  ])
)
