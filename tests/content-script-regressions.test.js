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

function loadFunctionWithDependencies(source, name, dependencies) {
  const fn = loadFunction(source, name);
  return Function(
    ...Object.keys(dependencies),
    `return (${fn.toString()});`,
  )(...Object.values(dependencies));
}

const sharedResourceHosts = new Set([
  "github.com",
  "gist.github.com",
  "raw.githubusercontent.com",
  "greasyfork.org",
  "youtube.com",
  "chromewebstore.google.com",
  "colab.research.google.com",
  "modrinth.com",
  "f-droid.org",
  "xdaforums.com",
  "start.me",
  "sites.google.com",
  "matrix.to",
  "codepen.io",
  "vk.com",
  "gitlab.com",
  "codeberg.org",
  "sourceforge.net",
  "linktr.ee",
  "rentry.co",
  "rentry.org",
  "pastebin.com",
  "archive.org",
  "drive.google.com",
  "docs.google.com",
  "discord.com",
  "discord.gg",
  "t.me",
  "mega.nz",
  "mediafire.com",
  "gofile.io",
  "pixeldrain.com",
  "huggingface.co",
]);

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

test("unbolded alternatives on a starred guide line are also starred", () => {
  const extractStarredUrlsFromMarkdown = loadFunction(
    backgroundScript,
    "extractStarredUrlsFromMarkdown",
  );
  const markdown =
    "* ⭐ **[GitHub Gists](https://gist.github.com/)** or [GitLab Snippets](https://docs.gitlab.com/user/snippets/) - Multi-Syntax / [Related](https://related.example/)";

  assert.deepEqual(extractStarredUrlsFromMarkdown(markdown), [
    "https://gist.github.com/",
    "https://docs.gitlab.com/user/snippets/",
  ]);
});

test("root-only popup labels omit their trailing slash", () => {
  const formatHostAndPath = loadFunction(popupScript, "formatHostAndPath");

  assert.equal(formatHostAndPath(new URL("https://github.com/")), "github.com");
  assert.equal(formatHostAndPath(new URL("https://rentry.co/")), "rentry.co");
  assert.equal(
    formatHostAndPath(new URL("https://docs.gitlab.com/user/snippets/")),
    "docs.gitlab.com/user/snippets",
  );
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

test("path-specific unsafe reasons preserve the repository path", () => {
  const getReasonKeyForUrl = loadFunction(
    backgroundScript,
    "getReasonKeyForUrl",
  );

  assert.equal(
    getReasonKeyForUrl(
      "https://github.com/FVision8/FVReleases/releases?tab=readme#downloads",
    ),
    "github.com/fvision8/fvreleases/releases",
  );
  assert.equal(getReasonKeyForUrl("https://linktr.ee/flixvision/"), "linktr.ee/flixvision");
  assert.equal(getReasonKeyForUrl("https://github.com/"), null);
});

test("path-specific reasons can classify otherwise unmatched URLs", () => {
  assert.match(backgroundScript, /let pathSpecificReason = await getReasonForUrl\(url\)/);
  assert.match(
    backgroundScript,
    /if \(status === "no_data" && pathSpecificReason\)/,
  );
});

test("the popup uses the neutral icon when a site is not in FMHY", () => {
  assert.match(
    popupScript,
    /no_data: "\.\.\/res\/icons\/default\.png"/,
  );
  assert.match(
    popupScript,
    /unknown: "\.\.\/res\/icons\/default\.png"/,
  );
  assert.match(
    popupScript,
    /statusIcon\.alt = status === "no_data" \? "Not listed in FMHY" : "Site status"/,
  );
});

test("shared hosts require the same path-bound resource", () => {
  const normalizeUrl = loadFunction(backgroundScript, "normalizeUrl");
  const normalizeResourceUrl = loadFunctionWithDependencies(
    backgroundScript,
    "normalizeResourceUrl",
    { normalizeUrl },
  );
  const isSharedResourceHost = loadFunctionWithDependencies(
    backgroundScript,
    "isSharedResourceHost",
    { sharedResourceHosts },
  );
  const urlMatchesListedResource = loadFunctionWithDependencies(
    backgroundScript,
    "urlMatchesListedResource",
    { normalizeResourceUrl, isSharedResourceHost },
  );

  assert.equal(
    urlMatchesListedResource(
      "https://github.com/fmhy/FMHY-SafeGuard/releases",
      "https://github.com/fmhy/FMHY-SafeGuard",
    ),
    true,
  );
  assert.equal(
    urlMatchesListedResource(
      "https://github.com/fmhy/FMHYFilterlist",
      "https://github.com/fmhy/FMHY-SafeGuard",
    ),
    false,
  );
  assert.equal(
    urlMatchesListedResource(
      "https://github.com/",
      "https://github.com/fmhy/FMHY-SafeGuard",
    ),
    false,
  );
  assert.equal(
    urlMatchesListedResource(
      "https://codeberg.org/example/tool/releases",
      "https://codeberg.org/example/tool",
    ),
    true,
  );
  assert.equal(
    urlMatchesListedResource(
      "https://rentry.co/another-page",
      "https://rentry.co/fmhy",
    ),
    false,
  );
  assert.equal(
    urlMatchesListedResource(
      "https://linktr.ee/flixvision",
      "https://linktr.ee/another-profile",
    ),
    false,
  );
  assert.equal(
    urlMatchesListedResource(
      "https://gist.github.com/starred",
      "https://gist.github.com/",
    ),
    true,
  );
  assert.equal(
    urlMatchesListedResource(
      "https://gist.github.com/example/dangerous-gist",
      "https://gist.github.com/",
    ),
    false,
  );
  assert.equal(
    urlMatchesListedResource(
      "https://www.youtube.com/watch?v=listed&t=30",
      "https://www.youtube.com/watch?v=listed",
    ),
    true,
  );
  assert.equal(
    urlMatchesListedResource(
      "https://www.youtube.com/watch?v=unlisted",
      "https://www.youtube.com/watch?v=listed",
    ),
    false,
  );
  assert.equal(
    urlMatchesListedResource(
      "https://matrix.to/#/#listed:matrix.org",
      "https://matrix.to/#/#listed:matrix.org",
    ),
    true,
  );
  assert.equal(
    urlMatchesListedResource(
      "https://matrix.to/#/#other:matrix.org",
      "https://matrix.to/#/#listed:matrix.org",
    ),
    false,
  );
  assert.equal(
    urlMatchesListedResource(
      "https://github.com/fmhy/FMHY-SafeGuard",
      "https://github.com/fmhy/FMHY-SafeGuard#readme",
    ),
    true,
  );
  assert.equal(
    urlMatchesListedResource(
      "https://greasyfork.org/en/scripts/453320-simple-sponsor-skipper",
      "https://greasyfork.org/en/scripts/453320",
    ),
    true,
  );
  assert.equal(
    urlMatchesListedResource(
      "https://greasyfork.org/en/scripts/999999-unlisted-script",
      "https://greasyfork.org/en/scripts/453320",
    ),
    false,
  );
});

test("cross-domain redirects retain the listed origin status per tab", () => {
  assert.match(chromiumManifest, /"webNavigation"/);
  assert.match(firefoxManifest, /"webNavigation"/);
  assert.match(backgroundScript, /webNavigation\.onBeforeRedirect\.addListener/);
  assert.match(backgroundScript, /redirectOrigins\.set\(details\.tabId/);
  assert.match(backgroundScript, /getRedirectOrigin\(message\.tabId, url\)/);
  assert.match(popupScript, /tabId: activeTab\.id/);

  const normalizeUrl = loadFunction(backgroundScript, "normalizeUrl");
  const normalizeResourceUrl = loadFunctionWithDependencies(
    backgroundScript,
    "normalizeResourceUrl",
    { normalizeUrl },
  );
  const redirectOrigins = new Map([
    [
      7,
      {
        originUrl: "https://alienflix.net/",
        targetUrl: "https://hdtodayz.net/",
        createdAt: Date.now(),
      },
    ],
  ]);
  const getRedirectOrigin = loadFunctionWithDependencies(
    backgroundScript,
    "getRedirectOrigin",
    { redirectOrigins, normalizeResourceUrl },
  );

  assert.equal(
    getRedirectOrigin(7, "https://hdtodayz.net/"),
    "https://alienflix.net/",
  );
  assert.equal(getRedirectOrigin(7, "https://unrelated.example/"), null);
});

test("normal subdomains only inherit the matching listed path", () => {
  const normalizeUrl = loadFunction(backgroundScript, "normalizeUrl");
  const normalizeResourceUrl = loadFunctionWithDependencies(
    backgroundScript,
    "normalizeResourceUrl",
    { normalizeUrl },
  );
  const isSharedResourceHost = loadFunctionWithDependencies(
    backgroundScript,
    "isSharedResourceHost",
    { sharedResourceHosts },
  );
  const urlMatchesListedResource = loadFunctionWithDependencies(
    backgroundScript,
    "urlMatchesListedResource",
    { normalizeResourceUrl, isSharedResourceHost },
  );

  assert.equal(
    urlMatchesListedResource(
      "https://auth.ente.com/auth",
      "https://ente.com/auth/",
    ),
    true,
  );
  assert.equal(
    urlMatchesListedResource(
      "https://auth.ente.com/login",
      "https://ente.com/auth/",
    ),
    true,
  );
  assert.equal(
    urlMatchesListedResource(
      "https://auth.ente.com/photos",
      "https://ente.com/auth/",
    ),
    false,
  );
  assert.equal(
    urlMatchesListedResource(
      "https://rentry.co/",
      "https://rentry.co/fmhy",
    ),
    false,
  );
});

test("status matching isolates shared resources and recognizes matching subdomains", () => {
  const normalizeUrl = loadFunction(backgroundScript, "normalizeUrl");
  const normalizeResourceUrl = loadFunctionWithDependencies(
    backgroundScript,
    "normalizeResourceUrl",
    { normalizeUrl },
  );
  const isSharedResourceHost = loadFunctionWithDependencies(
    backgroundScript,
    "isSharedResourceHost",
    { sharedResourceHosts },
  );
  const urlMatchesListedResource = loadFunctionWithDependencies(
    backgroundScript,
    "urlMatchesListedResource",
    { normalizeResourceUrl, isSharedResourceHost },
  );
  const getStatusFromLists = loadFunctionWithDependencies(
    backgroundScript,
    "getStatusFromLists",
    {
      userTrustedDomains: new Set(),
      userUntrustedDomains: new Set(),
      isSharedResourceHost,
      urlMatchesListedResource,
      unsafeSitesRegex: null,
      potentiallyUnsafeSitesRegex: null,
      fmhySitesRegex: null,
      starredSites: [
        "https://github.com/fmhy/FMHY-SafeGuard",
        "https://gist.github.com/",
        "https://docs.gitlab.com/user/snippets/",
        "https://ente.com/auth",
        "https://mullvad.net",
      ],
      safeSites: ["https://github.com/fmhy/FMHYFilterlist"],
      base64StarredLinks: [],
      base64DecodedLinks: [],
      unsafeHostnamesRegex: null,
      potentiallyUnsafeHostnamesRegex: null,
    },
  );

  assert.equal(getStatusFromLists("https://github.com/"), "no_data");
  assert.equal(
    getStatusFromLists("https://github.com/fmhy/FMHY-SafeGuard/releases"),
    "starred",
  );
  assert.equal(
    getStatusFromLists("https://github.com/fmhy/FMHYFilterlist/issues"),
    "safe",
  );
  assert.equal(
    getStatusFromLists("https://github.com/fmhy/unlisted-repository"),
    "no_data",
  );
  assert.equal(getStatusFromLists("https://auth.ente.com/auth"), "starred");
  assert.equal(getStatusFromLists("https://auth.ente.com/login"), "starred");
  assert.equal(getStatusFromLists("https://auth.ente.com/photos"), "no_data");
  assert.equal(getStatusFromLists("https://gist.github.com/starred"), "starred");
  assert.equal(
    getStatusFromLists("https://gist.github.com/example/dangerous-gist"),
    "no_data",
  );
  assert.equal(
    getStatusFromLists("https://docs.gitlab.com/user/snippets/"),
    "starred",
  );
  assert.equal(getStatusFromLists("https://mullvad.net/en"), "starred");
});

test("the popup preserves Codeberg owner and repository names", () => {
  assert.match(
    popupScript,
    /const repositoryHosts = new Set\(\[[\s\S]*"codeberg\.org"[\s\S]*\]\)/,
  );
  assert.match(
    popupScript,
    /repositoryHosts\.has\(matchedUrlObj\.hostname\)/,
  );
  assert.match(
    popupScript,
    /displayUrl = `\$\{matchedUrlObj\.hostname\}\/\$\{pathParts\[0\]\}\/\$\{pathParts\[1\]\}`/,
  );
});

test("the popup preserves paths for every shared resource host", () => {
  const backgroundHosts = backgroundScript.match(
    /const sharedResourceHosts = new Set\(\[([\s\S]*?)\]\);/,
  )[1].match(/"([^"]+)"/g);
  const popupHosts = popupScript.match(
    /const sharedResourceHosts = new Set\(\[([\s\S]*?)\]\);/,
  )[1].match(/"([^"]+)"/g);

  assert.deepEqual(popupHosts, backgroundHosts);
  assert.ok(backgroundHosts.includes('"linktr.ee"'));
  for (const host of [
    '"greasyfork.org"',
    '"youtube.com"',
    '"chromewebstore.google.com"',
    '"colab.research.google.com"',
    '"modrinth.com"',
    '"f-droid.org"',
    '"xdaforums.com"',
    '"start.me"',
    '"sites.google.com"',
    '"matrix.to"',
    '"codepen.io"',
    '"vk.com"',
  ]) {
    assert.ok(backgroundHosts.includes(host));
  }
  assert.match(
    popupScript,
    /sharedResourceHosts\.has\(matchedUrlObj\.hostname\)/,
  );
  assert.match(
    popupScript,
    /displayUrl = formatHostAndPath\(matchedUrlObj\)/,
  );
});

test("path-specific unsafe reasons also update the toolbar icon", () => {
  assert.match(
    backgroundScript,
    /async function checkSiteAndUpdatePageAction\(tabId, url\)/,
  );
  assert.match(
    backgroundScript,
    /if \(status === "no_data" && await getReasonForUrl\(url\)\) \{\s*status = "unsafe";/,
  );
  assert.match(
    backgroundScript,
    /updatePageAction\(status, tabId\);/,
  );
});

test("live resource data preserves query and fragment identities", () => {
  assert.match(
    backgroundScript,
    /allUrls\.map\(\(url\) => normalizeResourceUrl\(url\.trim\(\)\)\)/,
  );
  assert.match(
    backgroundScript,
    /const resourceUrl = normalizeResourceUrl\(url\);/,
  );
  assert.match(
    backgroundScript,
    /urlMatchesListedResource\(resourceUrl, listedUrl\)/,
  );
  assert.match(
    backgroundScript,
    /storedData\.resourceIdentityVersion === resourceIdentityVersion/,
  );
});

test("status checks wait for list initialization", () => {
  assert.match(
    backgroundScript,
    /let initializationPromise = null;/,
  );
  assert.match(
    backgroundScript,
    /if \(initializationPromise\) await initializationPromise;/,
  );
  assert.match(
    backgroundScript,
    /initializationPromise = initializeExtension\(\);/,
  );
});

test("the toolbar does not inherit root status on shared hosts", () => {
  assert.match(
    backgroundScript,
    /const requiresResourcePath = normalizedUrl\s*\? isSharedResourceHost\(new URL\(normalizedUrl\)\.hostname\)\s*: false;/,
  );
  assert.match(
    backgroundScript,
    /if \(status === "no_data" && !requiresResourcePath\) \{\s*status = getStatusFromLists\(rootUrl\);/,
  );
});

test("the popup preserves canonical paths for ordinary FMHY resources", () => {
  assert.match(
    popupScript,
    /displayUrl = formatHostAndPath\(matchedUrlObj\);/,
  );
});
