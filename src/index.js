import "litecanvas"
import Stats from "./stats.js"

const defaults = {
  hotkeyShow: "F1",
  hotkeyNext: "F2",
  css: {},
  hidden: false,
  id: "",
}
/**
 * @param {LitecanvasInstance} engine
 * @param {typeof defaults} config
 * @returns any
 */
export default function plugin(engine, config = {}) {
  config = Object.assign({}, defaults, config)

  const stats = new Stats()

  if (config.id) {
    stats.dom.id = config.id
  }

  for (const [key, value] of Object.entries(config.css || {})) {
    stats.dom.style[key] = value
  }

  engine.CANVAS.parentElement.appendChild(stats.dom)

  stats.display(!config.hidden)

  listen("update", () => {
    if (config.hotkeyShow && engine.iskeypressed(config.hotkeyShow)) {
      config.hidden = !config.hidden
      stats.display(!config.hidden)
    }

    if (config.hotkeyNext && engine.iskeypressed(config.hotkeyNext)) {
      console.log("next")
      stats.nextPanel()
    }
  })

  listen("before:update", (_, i = 1) => {
    if (!config.hidden && i === 1) stats.begin()
  })

  listen("after:draw", () => {
    if (!config.hidden) stats.end()
  })

  return {
    FPS_METER: stats,
  }
}
