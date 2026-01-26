// Notes Mapping - Maps domains to their corresponding FMHY note slugs
// The slug is used to fetch: https://raw.githubusercontent.com/fmhy/edit/main/docs/.vitepress/notes/{slug}.md

const notesMapping = {
  // 1337x torrent site
  "1337x.to": "1337x-ranks",
  "1337x.st": "1337x-ranks",
  "1337x.is": "1337x-ranks",
  "1337x.gd": "1337x-ranks",
  "1337x.so": "1337x-ranks",
  "1337x.tw": "1337x-ranks",

  // Audiobookbay
  "audiobookbay.is": "audiobookbay-warning",
  "audiobookbay.se": "audiobookbay-warning",
  "audiobookbay.fi": "audiobookbay-warning",
  "audiobookbay.ws": "audiobookbay-warning",
  "audiobookbay.nl": "audiobookbay-warning",

  // Aurora Store (F-Droid alternative)
  "auroraoss.com": "aurora-note",

  // APKMirror
  "apkmirror.com": "apkmirror-extensions",

  // BuzzHeavier
  "buzzheavier.com": "buzzheavier-warning",

  // ChatGPT  
  "chat.openai.com": "chatgpt-limits",
  "chatgpt.com": "chatgpt-limits",

  // Crystal Disk Info
  "crystalmark.info": "crystaldiskinfo",

  // CS.RIN.RU
  "cs.rin.ru": "csrin-search",

  // DODI Repacks
  "dodi-repacks.site": "dodi-warning",

  // FileBin
  "filebin.net": "filebin-warning",

  // FileLu
  "filelu.com": "filelu-warning",

  // FileZilla
  "filezilla-project.org": "filezilla",

  // Fluxy Repacks  
  "fluxyrepacks.site": "fluxy-repacks",

  // Foxit Reader
  "foxit.com": "foxit-warning",

  // FreeGOGPCGames
  "freegogpcgames.com": "freegogpcgames-note",

  // Glitchwave (game database)
  "glitchwave.com": "glitchwave-note",

  // Google Translate
  "translate.google.com": "google-translate-note",

  // HDO Box
  "hdo.app": "hdo-box-note",

  // Hugging Face
  "huggingface.co": "hugging-face-warning",

  // InstaEclipse (modded Instagram)
  "instaeclipse.com": "instaeclipse-note",

  // IRC Highway (ebooks)
  "irchighway.net": "irc-highway-note",

  // JDownloader
  "jdownloader.org": "jdownloader",

  // LiteAPK / ModYolo
  "liteapks.com": "liteapk-modyolo-note",
  "modyolo.com": "liteapk-modyolo-note",

  // MegaBasterd
  "github.com/tonikelope/megabasterd": "megabasterd-note",

  // Mobilism
  "mobilism.me": "mobilism-ranks",
  "mobilism.org": "mobilism-ranks",
  "forum.mobilism.org": "mobilism-ranks",
  "forum.mobilism.me": "mobilism-ranks",

  // ModelScope
  "modelscope.cn": "modelscope",

  // Mori (iOS tool)
  "mori.space": "mori-note",

  // movie-web / pstream
  "movie-web.app": "movie-web",
  "pstream.org": "movie-web",
  "pstream.mov": "movie-web",

  // MovieParadise
  "movieparadise.org": "movieparadise-code",

  // MVSEP (audio separation)
  "mvsep.com": "mvsep-note",

  // OpenAsar (Discord optimization)
  "openasar.dev": "openasar",

  // OpenRGB
  "openrgb.org": "openrgb-beta",
  "gitlab.com/CalcProgrammer1/OpenRGB": "openrgb-beta",

  // Pollinations AI
  "pollinations.ai": "pollinations-limits",
  "chat.pollinations.ai": "pollinations-limits",

  // Proton VPN (torrenting)
  "protonvpn.com": "proton-torrenting",

  // REAPER DAW
  "reaper.fm": "reaper-note",

  // SaNET
  "sanet.st": "sanet-warning",
  "sanet.lc": "sanet-warning",
  "sanet.cd": "sanet-warning",

  // Soft98 (Persian software)
  "soft98.ir": "soft98-note",

  // SoftArchive
  "softarchive.is": "softarchive-mirrors",
  "sanet.st": "softarchive-mirrors",

  // Sora (video streaming)
  "soraapp.tv": "sora",

  // Spicetify
  "spicetify.app": "spicetify-note",

  // Sport7 streams
  "sport7.live": "sport7",

  // Steam (controller support & currency)
  "store.steampowered.com": "steam-controller-support",
  "steampowered.com": "steam-currency-converter-note",

  // Tautulli (Plex monitoring)
  "tautulli.com": "tautulli-note",

  // TeamSpeak
  "teamspeak.com": "teamspeak-warning",

  // Thunderbird
  "thunderbird.net": "thunderbird",

  // TinyURL
  "tinyurl.com": "tinyurl-note",

  // Video DownloadHelper
  "downloadhelper.net": "video-downloadhelper",

  // VuenXX (video app)
  "vuenxx.com": "vuenxx-note",

  // WeLib (library thing)
  "welib.org": "welib-note",

  // WinRAR
  "rarlab.com": "winrar",
  "win-rar.com": "winrar",

  // YTS / Yify (multiple domains)
  "yts.mx": "yts-yify-note",
  "yts.rs": "yts-yify-note",
  "yts.lt": "yts-yify-note",
  "yts.am": "yts-yify-note",
  "yts.ag": "yts-yify-note",
  "yts.pm": "yts-yify-note",
  "yify-torrent.org": "yts-yify-note",
  "yifysubtitles.org": "yts-yify-note",

  // 4PDA (Russian mobile forum)
  "4pda.to": "captcha-4pda",

  // Buster captcha solver
  "github.com/nickyout/buster-client": "buster-note",

  // Eruda (mobile console)
  "eruda.liriliri.io": "eruda",

  // Twitch alternate player extensions
  "twitch.tv": "alt-twitch-player-extensions",

  // Cloudflare WARP alternatives
  "1.1.1.1": "alt-warp-clients",

  // Spotify Android mods
  "github.com/xManager-App/xManager": "android-spotify-note",

  // Cofi (coffee timer)
  "github.com/rozPierog/Cofi": "cofi-note",

  // Eaglercraft (web Minecraft)
  "eaglercraft.com": "eaglercraft-note",
  "eagler.xyz": "eaglercraft-note",

  // Bookmarkeddit
  "bookmarkeddit.com": "bookmarkeddit",

  // Reddit Filter
  "redditfilter.com": "redditfilter-note",

  // RGShows autoplay
  "rgshows.to": "rgshows-autoplay",
  "rgshows.me": "rgshows-autoplay",

  // SD Maid
  "github.com/d4rken-org/sdmaid-se": "sd-maid",

  // OneClick (debrid)
  "oneclick.download": "oneclick-note",

  // Forest focus timer
  "forestapp.cc": "forest-extensions",

  // Flicker proxy
  "flicker.city": "flicker-proxy",

  // Dolby Access/Atmos
  "dolby.com": "dolby-access-atmos-note",

  // Better reasoning (AI)
  "better-reasoning.com": "better-reasoning",

  // Bypass Freedlink
  "freedlink.org": "bypass-freedlink",
  "freedl.ink": "bypass-freedlink",

  // App Lock apps
  "github.com/AkaneTan/Privacy-App-Lock": "app-lock",

  // Clipboard to file extensions
  "addons.mozilla.org/firefox/addon/clipboard2file": "clipboard2file-addons",

  // Limit bypass services
  "12ft.io": "limit-bypass-note",
  "archive.is": "limit-bypass-note",

  // PrintEdit WE
  "nickyout.github.io/PrintEdit-WE": "printeditwe-addons",

  // SavePageWE
  "nickyout.github.io/SavePageWE": "savepagewe",

  // Scroll Anywhere
  "addons.mozilla.org/firefox/addon/scrollanywhere": "scrollanywhere-addons",

  // Site Favicon Download
  "realfavicongenerator.net": "site-favicon-dl",

  // TabIverse
  "tabiverse.com": "tabiverse-extensions",

  // SH.ST shortener
  "sh.st": "sh-note",
  "sht.st": "sh-note",

  // General driver sites
  "driverpack.io": "driver-note",
  "drivereasy.com": "driver-note",

  // Google song identification
  "google.com/search?q=song+identification": "google-song-identification",

  // Malware removal forums
  "malwaretips.com": "malware-removal-forums",
  "bleepingcomputer.com": "malware-removal-forums",

  // Yet Another Call Blocker
  "gitlab.com/nickyout/YetAnotherCallBlocker": "yet-another-call-blocker-note",

  // YouTube Tweaks
  "addons.mozilla.org/firefox/addon/youtube-tweaks": "youtube-tweaks",
  "chrome.google.com/webstore/detail/youtube-tweaks": "youtube-tweaks",

  // Advanced Logic Calculators
  "desmos.com": "advanced-logic-calculators",
  "wolframalpha.com": "advanced-logic-calculators",
  "symbolab.com": "advanced-logic-calculators",
};

// Pattern-based matching for dynamic domains
const notesPatterns = [
  // Torrent sites with multiple TLDs
  { pattern: /(?:^|\.)1337x\./i, noteSlug: "1337x-ranks" },
  { pattern: /(?:^|\.)yts\./i, noteSlug: "yts-yify-note" },
  { pattern: /(?:^|\.)audiobookbay\./i, noteSlug: "audiobookbay-warning" },
  { pattern: /(?:^|\.)sanet\./i, noteSlug: "sanet-warning" },
  { pattern: /(?:^|\.)softarchive\./i, noteSlug: "softarchive-mirrors" },
  { pattern: /(?:^|\.)mobilism\./i, noteSlug: "mobilism-ranks" },
  { pattern: /(?:^|\.)rgshows\./i, noteSlug: "rgshows-autoplay" },
  // Sites with known subdomains
  { pattern: /(?:^|\.)twitch\.tv$/i, noteSlug: "alt-twitch-player-extensions" },
  { pattern: /(?:^|\.)huggingface\.co$/i, noteSlug: "hugging-face-warning" },
  { pattern: /(?:^|\.)pollinations\.ai$/i, noteSlug: "pollinations-limits" },
  { pattern: /(?:^|\.)4pda\./i, noteSlug: "captcha-4pda" },
  // Archive mirrors
  { pattern: /^archive\.(is|today|ph|fo|li|vn|md)$/i, noteSlug: "limit-bypass-note" },
];

// Function to get note slug for a domain
function getNoteSlugForDomain(hostname) {
  // Remove www. prefix
  const domain = hostname.replace(/^www\./, "").toLowerCase();

  // Check exact match first
  if (notesMapping[domain]) {
    return notesMapping[domain];
  }

  // Check pattern matches
  for (const { pattern, noteSlug } of notesPatterns) {
    if (pattern.test(domain)) {
      return noteSlug;
    }
  }

  return null;
}

// Export for use in background.js
if (typeof module !== "undefined" && module.exports) {
  module.exports = { notesMapping, notesPatterns, getNoteSlugForDomain };
}
