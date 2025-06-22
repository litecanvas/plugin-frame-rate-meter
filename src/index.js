import "litecanvas"
import StatsMonitor from "./stats.js"

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

  const settings = engine.stat(0),
    stats = new StatsMonitor(),
    _display = stats.display,
    display = (show = true) => {
      config.hidden = !show
      _display(show)
      stats.resetPanel()
    }

  if (config.id) {
    stats.dom.id = config.id
  }

  for (const [key, value] of Object.entries(config.css || {})) {
    stats.dom.style[key] = value
  }

  engine.canvas().parentElement.appendChild(stats.dom)

  display(!config.hidden)

  if (settings.keyboardEvents) {
    listen("update", () => {
      if (config.hotkeyShow && engine.iskeypressed(config.hotkeyShow)) {
        display(config.hidden)
      }

      if (config.hotkeyNext && engine.iskeypressed(config.hotkeyNext)) {
        stats.nextPanel()
      }
    })
  }

  listen("before:update", (_, i = 1) => {
    if (config.hidden) {
      return
    }
    if (i === 1) stats.begin()
  })

  listen("after:draw", () => {
    if (config.hidden) {
      return
    }
    stats.end()
  })

  stats.display = display

  return {
    FPS_METER: stats,
  }
}
