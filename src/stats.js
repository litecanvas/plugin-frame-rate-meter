/**
 * Based on https://github.com/mrdoob/stats.js/blob/master/src/Stats.js
 */
export default function StatsMonitor() {
  let mode = 0,
    showing = true

  const container = document.createElement("div"),
    panels = [],
    now = () => (performance || Date).now()

  container.style.cssText =
    "position:absolute;top:0;right:0;cursor:pointer;opacity:0.8;z-index:10000"
  container.addEventListener(
    "click",
    function (event) {
      event.preventDefault()
      showPanel(++mode % container.children.length)
    },
    false
  )

  function addPanel(name, bg, fg, style) {
    const p = new Panel(name, bg, fg, container, style)
    panels.push(p)
    return p
  }

  function showPanel(id) {
    for (let i = 0; i < container.children.length; i++) {
      container.children[i].style.display = i === id ? "block" : "none"
    }
    mode = id
  }

  function nextPanel() {
    mode++
    if (mode >= container.children.length) {
      mode = 0
    }
    showPanel(mode)
  }

  /**
   * @param {string|number} id
   */
  function resetPanel(id = "all") {
    if ("all" === id) {
      for (let i = 0; i < panels.length; i++) {
        panels[i].reset()
      }
    } else if (panels[id]) {
      panels[id].reset()
    }
    prevTime = now()
    frames = 0
  }

  function display(show = true) {
    showing = !!show
    container.style.display = showing ? "" : "none"
  }

  let beginTime = now(),
    prevTime = beginTime,
    frames = 0

  const fpsPanel = addPanel("FPS", "#0ff", "#002")
  const msPanel = addPanel("MS", "#0f0", "#020")
  let memPanel

  if (self.performance && self.performance.memory) {
    memPanel = addPanel("MB", "#f08", "#201")
  }

  showPanel(0)

  return {
    dom: container,

    addPanel,
    showPanel,
    nextPanel,
    resetPanel,
    display,

    get hidden() {
      return !showing
    },

    begin: function () {
      beginTime = now()
    },

    end: function () {
      frames++

      const time = now()

      msPanel.update(time - beginTime, 200)

      if (time >= prevTime + 1000) {
        fpsPanel.update((frames * 1000) / (time - prevTime), 100)

        prevTime = time
        frames = 0

        if (memPanel) {
          const memory = performance.memory
          memPanel.update(
            memory.usedJSHeapSize / 1048576,
            memory.jsHeapSizeLimit / 1048576
          )
        }
      }

      return time
    },

    update: function () {
      beginTime = this.end()
    },
  }
}

function Panel(name, fg, bg, wrapper, style = {}) {
  const round = Math.round

  let min = Infinity,
    max = 0

  const PR = round(window.devicePixelRatio || 1)

  const WIDTH = (style.width || 80) * PR,
    HEIGHT = 48 * PR,
    TEXT_X = 3 * PR,
    TEXT_Y = 2 * PR,
    GRAPH_X = 3 * PR,
    GRAPH_Y = 15 * PR,
    GRAPH_WIDTH = (WIDTH - 6) * PR,
    GRAPH_HEIGHT = 30 * PR

  const canvas = document.createElement("canvas")

  canvas.width = WIDTH
  canvas.height = HEIGHT
  // canvas.style.cssText = "width:80px;height:48px"

  const id = wrapper.children.length
  wrapper.appendChild(canvas)

  const context = canvas.getContext("2d")
  context.font = "bold " + 9 * PR + "px Helvetica,Arial,sans-serif"
  context.textBaseline = "top"

  function reset() {
    context.fillStyle = bg
    context.fillRect(0, 0, WIDTH, HEIGHT)

    context.fillStyle = fg
    context.fillText(name, TEXT_X, TEXT_Y)
    context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT)

    context.fillStyle = bg
    context.globalAlpha = 0.9
    context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT)
  }

  reset()

  return {
    id,
    dom: canvas,

    reset,

    update: function (value, maxValue) {
      min = Math.min(min, value)
      max = Math.max(max, value)

      context.fillStyle = bg
      context.globalAlpha = 1
      context.fillRect(0, 0, WIDTH, GRAPH_Y)

      context.fillStyle = fg
      const label = [round(value), name]
      if (style.labelBefore) {
        label.reverse()
      }
      context.fillText(
        label.join(" ") + " (" + round(min) + "-" + round(max) + ")",
        TEXT_X,
        TEXT_Y
      )

      context.drawImage(
        canvas,
        GRAPH_X + PR,
        GRAPH_Y,
        GRAPH_WIDTH - PR,
        GRAPH_HEIGHT,
        GRAPH_X,
        GRAPH_Y,
        GRAPH_WIDTH - PR,
        GRAPH_HEIGHT
      )

      context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT)

      context.fillStyle = bg
      context.globalAlpha = 0.9
      context.fillRect(
        GRAPH_X + GRAPH_WIDTH - PR,
        GRAPH_Y,
        PR,
        round((1 - value / maxValue) * GRAPH_HEIGHT)
      )
    },
  }
}
