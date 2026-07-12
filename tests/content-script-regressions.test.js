const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const contentScript = fs.readFileSync(
  path.join(__dirname, "..", "src", "js", "content.js"),
  "utf8",
);
const backgroundScript = fs.readFileSync(
  path.join(__dirname, "..", "src", "js", "background.js"),
  "utf8",
);
const popupHtml = fs.readFileSync(
  path.join(__dirname, "..", "src", "pub", "index.html"),
  "utf8",
);
const popupScript = fs.readFileSync(
  path.join(__dirname, "..", "src", "pub", "index.js"),
  "utf8",
);
const fmhyHighlightScriptPath = path.join(
  __dirname,
  "..",
  "src",
  "js",
  "fmhy-highlight.js",
);
const chromiumManifest = fs.readFileSync(
  path.join(__dirname, "..", "platform", "chromium", "manifest.json"),
  "utf8",
);
const firefoxManifest = fs.readFileSync(
  path.join(__dirname, "..", "platform", "firefox", "manifest.json"),
  "utf8",
);

function loadFunction(source, name) {
  const start = source.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `${name} should be defined`);

  const bodyStart = source.indexOf("{", start);
  let depth = 0;
  for (let index = bodyStart; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
    if (depth === 0) {
      return Function(`return (${source.slice(start, index + 1)})`)();
    }
  }

  throw new Error(`Could not read ${name}`);
}

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

test("warning redirects honor the setting saved by the options page", () => {
  assert.match(
    backgroundScript,
    /storage\.local\.get\(\{\s*showWarning: true,\s*\}\)/,
  );
  assert.match(backgroundScript, /if \(!showWarning\)/);
  assert.doesNotMatch(backgroundScript, /storage\.sync\.get\(\{\s*warningPage:/);
});

test("all bold links on a starred guide line are treated as starred", () => {
  const extractStarredUrlsFromMarkdown = loadFunction(
    backgroundScript,
    "extractStarredUrlsFromMarkdown",
  );
  const markdown =
    "* ⭐ **[First](https://first.example/)** or **[Second](https://second.example/)** / [Related](https://related.example/)";

  assert.deepEqual(extractStarredUrlsFromMarkdown(markdown), [
    "https://first.example/",
    "https://second.example/",
  ]);
});

test("guide resources map to their FMHY page section", () => {
  const extractFmhyResourceMap = loadFunction(
    backgroundScript,
    "extractFmhyResourceMap",
  );
  const markdown = [
    "## Privacy Tools",
    "### ▷ VPN Services",
    "* **[Example VPN](https://vpn.example/download)**",
  ].join("\n");

  assert.deepEqual(
    extractFmhyResourceMap(markdown, "https://fmhy.net/privacy"),
    { "https://vpn.example/download": "https://fmhy.net/privacy#vpn-services" },
  );
});

test("popup exposes a View on FMHY link for mapped resources", () => {
  assert.match(popupHtml, /id="fmhy-resource-link"/);
  assert.match(popupScript, /response\.fmhyUrl/);
  assert.match(popupHtml, /View on FMHY/);
});

test("opening an FMHY resource highlights its matching guide line", () => {
  assert.equal(fs.existsSync(fmhyHighlightScriptPath), true);
  const fmhyHighlightScript = fs.readFileSync(fmhyHighlightScriptPath, "utf8");

  assert.match(popupScript, /pendingFmhyHighlight/);
  assert.match(fmhyHighlightScript, /vp-search-highlight-target/);
  assert.match(fmhyHighlightScript, /closest\("li, p"\)/);
  assert.match(fmhyHighlightScript, /waitForMatchingResult/);
  assert.match(fmhyHighlightScript, /MutationObserver/);
  assert.match(chromiumManifest, /js\/fmhy-highlight\.js/);
  assert.match(firefoxManifest, /js\/fmhy-highlight\.js/);
});

test("FMHY passwords and invite codes match the current guide", () => {
  assert.match(backgroundScript, /"steamrip\.com": "steamrip\.com"/);
  assert.match(backgroundScript, /"iptv\.watchott\.ru": "FREE-MEDIA"/);
  assert.match(
    backgroundScript,
    /"https:\/\/rentry\.co\/fmhyb64#gnarly": "gnarly"/,
  );
  assert.match(
    backgroundScript,
    /"https:\/\/rentry\.co\/fmhyb64#alvro": "ByAlvRo"/,
  );
  assert.match(backgroundScript, /"ee3\.me": "mpgh"/);
  assert.match(backgroundScript, /"rips\.cc": "1hack"/);
});

test("shared-host passwords require an exact resource URL", () => {
  assert.doesNotMatch(backgroundScript, /"rentry\.co":/);
  assert.match(
    backgroundScript,
    /getPasswordForDomain\(domain, url\)/,
  );
});
