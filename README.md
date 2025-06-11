# Frame Rate Meter for litecanvas

Plugin to create a performance monitor (based on [stats.js](https://github.com/mrdoob/stats.js)) to measure frame rate of your [litecanvas](https://github.com/litecanvas/engine) games.

> This plugin is automatically loaded into the [playground](https://litecanvas.js.org/), just press `F1` to display the monitor.

## Install

**NPM**: `npm i @litecanvas/plugin-frame-rate-meter`

**CDN**: `https://unpkg.com/@litecanvas/plugin-frame-rate-meter/dist/dist.js`

## Usage

Just load the plugin and press the hotkey (`F1` by default) to show or hide the monitor.

```js
litecanvas()

use(pluginFrameRateMeter, {
  // hotkey to display/hide
  hotkeyShow: "F1",

  // hotkey to swap the panel
  // you can also tap the monitor to change panels
  hotkeyNext: "F2",

  // if true, the monitor will not be displayed automatically
  hidden: false,

  // wrapper custom css
  css: { border: "1px white solid" },

  // wrapper id
  id: "fps-meter",
})

function update(dt) {
  // ...
}

function draw() {
  // ...
}
```
