const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const contentScript = fs.readFileSync(
  path.join(__dirname, "..", "src", "js", "content.js"),
  "utf8",
);

test("processed link tracking can be reset after settings change", () => {
  assert.match(contentScript, /let processedLinks = new WeakSet\(\);/);
  assert.match(contentScript, /processedLinks = new WeakSet\(\);/);
});

test("processed links use an extension-owned data attribute", () => {
  assert.match(
    contentScript,
    /querySelectorAll\("a\[href\]:not\(\[data-fmhy-processed\]\)"\)/,
  );
  assert.match(
    contentScript,
    /link\.setAttribute\("data-fmhy-processed", "true"\);/,
  );
  assert.doesNotMatch(contentScript, /classList\.add\("fmhy-processed"\)/);
});
