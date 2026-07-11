# Browser test builds

These folders contain complete unpacked builds of the current source.

## Chrome / Chromium

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Select **Load unpacked**.
4. Choose the `test-builds/chrome` folder.

## Firefox

1. Open `about:debugging#/runtime/this-firefox`.
2. Select **Load Temporary Add-on**.
3. Choose `test-builds/firefox/manifest.json`.

Firefox removes temporary add-ons when the browser closes, so reload this
manifest after restarting Firefox.
