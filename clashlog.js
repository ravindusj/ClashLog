// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-brown; icon-glyph: hammer;
// ===========================================================
//  Clash Log  (for the Scriptable app)
//  Builder, hero, lab, pet and Builder Base timers from the
//  Clash of Clans "Data Export" (Settings > More Settings).
//  Supports multiple accounts + an animated dashboard.
//
//  Game data: clash-of-clans-data (open source, MIT).
//  Icons are Supercell game art, used under Supercell's Fan
//  Content Policy. Not affiliated with or endorsed by Supercell.
// ===========================================================

const VERSION = "0.1"
// ---------- ko-fi ----------
const AUTHOR = "ravindusj"
const COFFEE_URL = "https://ko-fi.com/ravindulach"
const KOFI_LOGO_URL = "https://storage.ko-fi.com/cdn/cup-border.png"

const ICON_BASE = "https://cdn.jsdelivr.net/npm/clash-of-clans-data@0.19.1/images/"

// ---------- storage ----------
const fm = FileManager.local()
const DIR = fm.joinPath(fm.documentsDirectory(), "Clash Log")
try {
  const oldDir = fm.joinPath(fm.documentsDirectory(), "ClashBuilder")
  if (fm.fileExists(oldDir) && !fm.fileExists(DIR)) fm.move(oldDir, DIR)
} catch (e) {}
const ICON_DIR = fm.joinPath(DIR, "icons")
const ACC_DIR = fm.joinPath(DIR, "accounts")
const SETTINGS_PATH = fm.joinPath(DIR, "settings.json")
for (const d of [DIR, ICON_DIR, ACC_DIR]) if (!fm.fileExists(d)) fm.createDirectory(d, true)

// ---------- sections ----------
const SECTIONS = {
  builders: { label: "Builders", emoji: "🔨", free: "A builder is free 🔨 Time for the next upgrade!" },
  heroes:   { label: "Heroes", emoji: "👑", free: "A builder is free 🔨 Your hero is ready to fight!" },
  lab:      { label: "Laboratory", emoji: "🧪", free: "Laboratory is free 🧪 Start the next research!" },
  pets:     { label: "Pet House", emoji: "🐾", free: "Pet House is free 🐾" },
  bb:       { label: "Builder Base", emoji: "⚒️", free: "A Builder Base builder is free ⚒️" },
  starlab:  { label: "Star Lab", emoji: "⭐", free: "Star Laboratory is free ⭐" },
}
const ORDER = ["builders", "heroes", "lab", "pets", "bb", "starlab"]
const KIND_SECTION = { B: "builders", H: "heroes", L: "lab", P: "pets", b: "bb", h: "bb", l: "starlab" }
const KIND_EMOJI = { B: "🏰", H: "👑", L: "🧪", P: "🐾", b: "⚒️", h: "🦸", l: "⭐" }
const KEY_KIND = { buildings: "B", traps: "B", heroes: "H", units: "L", spells: "L", siege_machines: "L",
  pets: "P", buildings2: "b", traps2: "b", heroes2: "h", units2: "l", troops2: "l" }
const ALIASES = { builder: "builders", builders: "builders", hero: "heroes", heroes: "heroes",
  lab: "lab", laboratory: "lab", research: "lab", pet: "pets", pets: "pets", bb: "bb",
  builderbase: "bb", star: "starlab", starlab: "starlab" }
const ID = { HUT: 1000015, BOB_HUT: 1000064, LAB: 1000007, PET_HOUSE: 1000068, HERO_HALL: 1000071,
  BUILDER_HALL: 1000034, STAR_LAB: 1000046, OTTO_OUTPOST: 1000078 }

// ---------- themes ----------
const THEMES = {
  modern: {
    bgTop: "#1e1d1c", bgBottom: "#121212", text: "#f5f3ef", sub: "#8e8a85",
    gold: "#ffcc4d", green: "#5fd47b", orange: "#ff9f43", track: ["#ffffff", 0.10], chip: ["#ffffff", 0.07],
    rounded: false,
    accent: { builders: "#ffcc4d", heroes: "#ff9f43", lab: "#b794ff", pets: "#4fd1a5", bb: "#64b5f6", starlab: "#ffd75e" },
  },
  wood: {
    bgTop: "#74492a", bgBottom: "#3b2312", text: "#fff3d6", sub: "#d9bb8f",
    gold: "#ffd257", green: "#8fe15b", orange: "#ffa33b", track: ["#2a1608", 1], chip: ["#000000", 0.28],
    rounded: true,
    accent: { builders: "#ffd257", heroes: "#ffd257", lab: "#ffd257", pets: "#ffd257", bb: "#ffd257", starlab: "#ffd257" },
  },
}
const T = {}
function applyTheme(name) {
  const th = THEMES[name] || THEMES.modern
  const c = v => Array.isArray(v) ? new Color(v[0], v[1]) : new Color(v)
  for (const k of ["bgTop", "bgBottom", "text", "sub", "gold", "green", "orange", "track", "chip"]) T[k] = c(th[k])
  T.accent = {}; for (const k in th.accent) T.accent[k] = new Color(th.accent[k])
  T.rounded = th.rounded
}
applyTheme("modern")
function F(name, size) {
  try { if (typeof Font[name] === "function") return Font[name](size) } catch (e) {}
  return Font.systemFont(size)
}
const fBold = s => F(T.rounded ? "boldRoundedSystemFont" : "boldSystemFont", s)
const fSemi = s => F(T.rounded ? "semiboldRoundedSystemFont" : "semiboldSystemFont", s)
const fReg = s => F(T.rounded ? "mediumRoundedSystemFont" : "mediumSystemFont", s)
const fNum = s => F(T.rounded ? "semiboldRoundedSystemFont" : "semiboldMonospacedSystemFont", s)

function widgetSize(family) {
  let sc = { width: 390, height: 844 }
  try { sc = Device.screenSize() } catch (e) {}
  const w = Math.round(Math.min(sc.width, sc.height)), h = Math.round(Math.max(sc.width, sc.height))
  const table = { "440x956": [170, 364, 382], "402x874": [158, 338, 354], "430x932": [170, 364, 382], "428x926": [170, 364, 382], "414x896": [169, 360, 379],
    "414x736": [159, 348, 357], "393x852": [158, 338, 354], "390x844": [158, 338, 354],
    "375x812": [155, 329, 345], "360x780": [155, 329, 345], "375x667": [148, 321, 324], "320x568": [141, 292, 311] }
  const t = table[`${w}x${h}`] || [Math.floor(w * 0.39), Math.floor(w * 0.835), Math.floor(w * 0.875)]
  if (family === "small") return { w: t[0], h: t[0] }
  if (family === "medium") return { w: t[1], h: t[0] }
  return { w: t[1], h: t[2] }
}

// ---------- settings ----------
const DEFAULTS = {
  sections: { builders: true, heroes: true, lab: true, pets: true, bb: true, starlab: true },
  theme: "modern",
  notify: true,
  staleHours: 12,
  lock: { sections: { builders: true, heroes: false, lab: true, pets: true, bb: true, starlab: true }, rect: "sections", circle: "builders" },
  accounts: {},
  order: [],
  current: "",
}
function loadSettings() {
  let s = {}
  try { s = JSON.parse(fm.readString(SETTINGS_PATH)) || {} } catch (e) {}
  const out = Object.assign({}, DEFAULTS, s)
  out.sections = Object.assign({}, DEFAULTS.sections, s.sections || {})
  out.lock = Object.assign({}, DEFAULTS.lock, s.lock || {})
  out.lock.sections = Object.assign({}, DEFAULTS.lock.sections, (s.lock && s.lock.sections) || {})
  out.accounts = s.accounts || {}
  out.order = (s.order || []).filter(k => out.accounts[k])
  for (const k in out.accounts) if (!out.order.includes(k)) out.order.push(k)
  if (!out.accounts[out.current]) out.current = out.order[0] || ""
  applyTheme(out.theme)
  return out
}
function saveSettings(s) { fm.writeString(SETTINGS_PATH, JSON.stringify(s)) }
function accPath(key) { return fm.joinPath(ACC_DIR, `${key}.json`) }

// ---------- accounts ----------
function accountKey(exp, s) {
  const tag = exp.tag || exp.playerTag || exp.player_tag
  if (typeof tag === "string" && tag.trim()) return tag.replace(/[^A-Za-z0-9]/g, "").toUpperCase() || "MAIN"
  return s.current || "MAIN"
}
function ensureAccount(s, key, exp) {
  if (!s.accounts[key]) {
    const tag = exp && (exp.tag || exp.playerTag)
    const nm = exp && (exp.name || exp.playerName)
    s.accounts[key] = { name: nm || (tag ? String(tag) : `Account ${s.order.length + 1}`), tag: tag || "",
      importedAt: 0, builders: 0, bbBuilders: 0, notifIds: [] }
    s.order.push(key)
  }
  return s.accounts[key]
}
function accLabel(s, key) { return (s.accounts[key] || {}).name || key }
function findAccount(s, token) {
  const t = token.toLowerCase().replace(/^#/, "")
  for (const k of s.order) {
    const a = s.accounts[k]
    if (k.toLowerCase() === t || (a.name || "").toLowerCase() === t ||
        String(a.tag || "").toLowerCase().replace(/^#/, "") === t) return k
  }
  return null
}

// ---------- time helpers ----------
function fmt(ms) {
  if (ms <= 0) return "Ready!"
  const m = Math.ceil(ms / 60000)
  const d = Math.floor(m / 1440), h = Math.floor((m % 1440) / 60), mi = m % 60
  if (d) return h ? `${d}d ${h}h` : `${d}d`
  if (h) return mi ? `${h}h ${mi}m` : `${h}h`
  return `${mi}m`
}
function fmtShort(ms) {
  if (ms <= 0) return "✓"
  const m = Math.ceil(ms / 60000)
  if (m >= 1440) return `${Math.floor(m / 1440)}d`
  if (m >= 60) return `${Math.floor(m / 60)}h`
  return `${m}m`
}
function ago(ts) {
  const m = Math.max(0, Math.floor((Date.now() - ts) / 60000))
  if (m < 1) return "just now"
  if (m < 60) return `${m}m ago`
  if (m < 1440) return `${Math.floor(m / 60)}h ago`
  return `${Math.floor(m / 1440)}d ago`
}

// ---------- parsing ----------
function parseExport(raw) {
  if (!raw || typeof raw !== "string") return null
  let j
  try { j = JSON.parse(raw) } catch (e) { return null }
  if (!j || typeof j !== "object") return null
  let n = 0
  ;(function walk(o) {
    if (n > 3 || !o || typeof o !== "object") return
    if (Array.isArray(o)) { o.forEach(walk); return }
    if (typeof o.data === "number" && typeof o.lvl === "number") n++
    for (const k in o) if (o[k] && typeof o[k] === "object") walk(o[k])
  })(j)
  return n > 3 ? j : null
}
function info(id) {
  const m = MAP[id]
  if (!m) return null
  return { name: m[0], kind: m[1], icon: m[2], times: m[3] ? m[3].split(".").map(x => parseInt(x, 36) * 60000) : [] }
}

function analyze(exp, acc) {
  const base = exp.timestamp ? exp.timestamp * 1000 : (acc.importedAt || Date.now())
  const rows = [], have = {}
  ;(function walk(o, key) {
    if (Array.isArray(o)) { for (const x of o) walk(x, key); return }
    if (!o || typeof o !== "object") return
    if (typeof o.data === "number") {
      have[o.data] = (have[o.data] || 0) + (typeof o.cnt === "number" ? o.cnt : 1)
      if (typeof o.timer === "number" && o.timer > 0 && o.data < 93000000) {
        const inf = info(o.data)
        const kind = inf ? inf.kind : KEY_KIND[key]
        if (kind && KIND_SECTION[kind]) {
          const lvl = typeof o.lvl === "number" ? o.lvl : 0
          const remain = o.timer * 1000
          let total = inf && inf.times[lvl] ? inf.times[lvl] : 0
          if (total < remain) total = 0
          let icon = inf ? inf.icon : ""
          const iconLv = Math.min(Math.max(lvl, 1), (inf && inf.times.length) || 1)
          if (icon.includes("#")) icon = icon.replace("#", String(iconLv))
          const cl = (ICON_COLORS[o.data] || "").split(".")
          const color = cl[Math.min(iconLv, cl.length) - 1] || cl[0] || ""
          rows.push({ id: o.data, kind, section: KIND_SECTION[kind], lvl,
            name: inf ? inf.name : `Unknown #${o.data}`, end: base + remain, total, icon, color })
        }
      }
    }
    for (const k in o) if (o[k] && typeof o[k] === "object") walk(o[k], Array.isArray(o[k]) ? k : key)
  })(exp, "")
  rows.sort((a, b) => a.end - b.end)

  const kinds = new Set(Object.keys(have).map(i => (MAP[i] || [])[1]))
  const known = kinds.has("B")
  const present = {
    builders: true,
    heroes: !known || kinds.has("H") || !!have[ID.HERO_HALL],
    lab: !known || !!have[ID.LAB],
    pets: !known || !!have[ID.PET_HOUSE] || kinds.has("P"),
    bb: !known || !!have[ID.BUILDER_HALL] || kinds.has("b"),
    starlab: !known || !!have[ID.STAR_LAB] || kinds.has("l"),
  }
  const autoB = (have[ID.HUT] || 5) + (have[ID.BOB_HUT] ? 1 : 0)
  const autoBB = 1 + (have[ID.OTTO_OUTPOST] ? 1 : 0)
  return { base, rows, present,
    caps: { builders: acc.builders || autoB, bb: acc.bbBuilders || autoBB },
    auto: { builders: autoB, bb: autoBB } }
}

const _cache = {}
function loadState(s, key) {
  if (!key || !s.accounts[key]) return null
  if (key in _cache) return _cache[key]
  _cache[key] = null
  const p = accPath(key)
  if (fm.fileExists(p)) {
    const exp = parseExport(fm.readString(p))
    if (exp) _cache[key] = analyze(exp, s.accounts[key])
  }
  return _cache[key]
}
function clearCache() { for (const k in _cache) delete _cache[k] }

function slot(busy, cap) {
  return { free: Math.max(0, cap - busy.length), cap, next: busy.length ? Math.min(...busy.map(r => r.end)) : null }
}
function status(st, now) {
  const act = sec => st.rows.filter(r => sec.includes(r.section) && r.end > now)
  return {
    builders: slot(act(["builders", "heroes"]), st.caps.builders),
    lab: slot(act(["lab"]), 1), pets: slot(act(["pets"]), 1),
    bb: slot(act(["bb"]), st.caps.bb), starlab: slot(act(["starlab"]), 1),
  }
}
function isStale(st, s, now) { return now - st.base > s.staleHours * 3600000 }

function parseParam(s, param) {
  const out = { account: s.current, sections: null, overview: false, mode: null, first: null }
  if (!param || !param.trim()) return out
  let rest = param
  const colon = param.indexOf(":")
  if (colon > 0) {
    const k = findAccount(s, param.slice(0, colon).trim())
    if (k) { out.account = k; rest = param.slice(colon + 1) }
  }
  const secs = {}
  for (const raw of rest.split(/[,;]+/).map(x => x.trim()).filter(Boolean)) {
    const p = raw.toLowerCase().replace(/\s+/g, "")
    if (p === "accounts" || p === "overview" || p === "allaccounts") { out.overview = true; continue }
    if (p === "all") { ORDER.forEach(k => secs[k] = true); continue }
    if (p === "next" || p === "upcoming") { out.mode = "next"; continue }
    if (ALIASES[p]) { secs[ALIASES[p]] = true; if (!out.first) out.first = ALIASES[p]; continue }
    const k = findAccount(s, raw)
    if (k) out.account = k
  }
  if (Object.keys(secs).length) out.sections = secs
  return out
}
function enabledSections(s, want, st) {
  const w = want || s.sections, out = {}
  for (const k of ORDER) out[k] = !!w[k] && (!st || st.present[k])
  return out
}

// ---------- icons ----------
function shrink(img, size) {
  const dc = new DrawContext()
  dc.size = new Size(size, size); dc.opaque = false; dc.respectScreenScale = false
  const r = Math.min(size / img.size.width, size / img.size.height)
  const w = img.size.width * r, h = img.size.height * r
  dc.drawImageInRect(img, new Rect((size - w) / 2, (size - h) / 2, w, h))
  return dc.getImage()
}
function iconFile(path) { return fm.joinPath(ICON_DIR, path.replace(/\//g, "_")) }
async function getIcon(path, allowNet) {
  if (!path) return null
  const file = iconFile(path)
  if (fm.fileExists(file)) { try { return fm.readImage(file) } catch (e) {} }
  if (!allowNet) return null
  try {
    const req = new Request(ICON_BASE + path)
    req.timeoutInterval = 6
    const img = shrink(await req.loadImage(), 96)
    fm.writeImage(file, img)
    return img
  } catch (e) { return null }
}

// ---------- widget drawing ----------
function bar(p, w, h, color) {
  const dc = new DrawContext()
  dc.size = new Size(w, h); dc.opaque = false; dc.respectScreenScale = true
  const t = new Path(); t.addRoundedRect(new Rect(0, 0, w, h), h / 2, h / 2)
  dc.addPath(t); dc.setFillColor(T.track); dc.fillPath()
  if (p > 0) {
    const f = new Path(); f.addRoundedRect(new Rect(0, 0, Math.max(h, w * Math.min(1, p)), h), h / 2, h / 2)
    dc.addPath(f); dc.setFillColor(color); dc.fillPath()
  }
  return dc.getImage()
}
function hutIconPath() { const m = MAP[1000015]; return m ? m[2].replace("#", "1") : "" }
async function addReady(parent, n, size, color) {
  const st = parent.addStack(); st.layoutHorizontally(); st.centerAlignContent(); st.spacing = 3
  const img = await getIcon(hutIconPath(), true)
  if (img) { const wi = st.addImage(img); wi.imageSize = new Size(size + 3, size + 3) }
  else { const e = st.addText("🛖"); e.font = Font.systemFont(size) }
  const t = st.addText(`${n} Ready`); t.font = fSemi(size); t.textColor = color; t.lineLimit = 1
  return st
}
function barColor(r) { return r.color ? new Color("#" + r.color) : T.accent[r.section] }
function progress(r, now) { return r.end <= now ? 1 : (r.total ? 1 - (r.end - now) / r.total : 0) }

function chipText(key, g, now, compact) {
  const e = SECTIONS[key].emoji
  if (key === "builders" || key === "bb") {
    if (g.free > 0) return { t: compact ? `${e} ${g.free} free` : `${e} ${g.free}/${g.cap} free`, c: T.green }
    return { t: `${e} ${fmt(g.next - now)}`, c: T.gold }
  }
  if (g.free > 0) return { t: `${e} Free`, c: T.green }
  return { t: `${e} ${fmt(g.next - now)}`, c: T.gold }
}
function chipKeys(en) {
  const keys = []
  if (en.builders || en.heroes) keys.push("builders")
  for (const k of ["lab", "pets", "bb", "starlab"]) if (en[k]) keys.push(k)
  return keys
}
async function addIcon(parent, r, size) {
  const img = await getIcon(r.icon, true)
  if (img) { const wi = parent.addImage(img); wi.imageSize = new Size(size, size); return }
  const box = parent.addStack(); box.size = new Size(size, size); box.centerAlignContent()
  const e = box.addText(KIND_EMOJI[r.kind] || "🏗️"); e.font = Font.systemFont(size * 0.7)
}
function staleLine(parent, st, s, now, size, short) {
  const stale = isStale(st, s, now)
  const txt = stale ? `⚠️ Data ${ago(st.base).replace(" ago", "")} old${short ? "" : " — copy export again"}` : `Updated ${ago(st.base)}`
  const t = parent.addText(txt)
  t.font = fReg(size); t.textColor = stale ? T.orange : T.sub; t.lineLimit = 1; t.minimumScaleFactor = 0.7
}
function background(w) {
  const g = new LinearGradient()
  g.colors = [T.bgTop, T.bgBottom]; g.locations = [0, 1]
  g.startPoint = new Point(0, 0); g.endPoint = new Point(0, 1)
  w.backgroundGradient = g
}
function message(parent, text, size) {
  const t = parent.addText(text); t.font = fSemi(size); t.textColor = T.text; t.minimumScaleFactor = 0.6
}

// ---------- widget ----------
async function buildWidget(family, s, param) {
  const w = new ListWidget()
  const now = Date.now()
  const pp = parseParam(s, param)
  const accessory = family && family.startsWith("accessory")
  if (!accessory) { background(w); w.setPadding(12, 12, 12, 12) }
  w.url = `scriptable:///run/${encodeURIComponent(Script.name())}?dash=1`

  if (pp.overview && !accessory) return overviewWidget(w, family, s, now)

  const key = pp.account
  const st = loadState(s, key)
  if (!st) {
    if (accessory) { const t = w.addText("🔨 No data"); t.font = fSemi(12) }
    else message(w, "🔨 Clash Log\n\nIn Clash: Settings → More Settings → Data Export → Copy.\nThen open this script.", 13)
    return w
  }
  const multi = s.order.length > 1
  const name = accLabel(s, key)
  const en = enabledSections(s, pp.sections, st)
  const stat = status(st, now)
  const rows = st.rows.filter(r => en[r.section])
  const active = rows.filter(r => r.end > now)
  const firstBuilder = active.find(r => r.section === "builders" || r.section === "heroes")
  const mark = r => !!firstBuilder && r === firstBuilder && stat.builders.free === 0
  const nextEnd = active.length ? active[0].end : Infinity
  w.refreshAfterDate = new Date(Math.max(now + 60000, Math.min(nextEnd + 30000, now + 15 * 60000)))

  if (accessory) return await lockWidget(w, family, s, st, pp, now, multi, name)

  const secs = ORDER.filter(k => en[k])
  const bySec = {}; for (const k of secs) bySec[k] = rows.filter(r => r.section === k)
  const stale = isStale(st, s, now)
  const size = widgetSize(family)
  const PAD = 14
  w.setPadding(PAD, PAD, PAD, PAD)
  const W = size.w - PAD * 2, H = size.h - PAD * 2

  function secStatus(sec) {
    if (sec === "builders" || sec === "bb") {
      const g = stat[sec]
      return g.free > 0 ? { t: `${g.free} of ${g.cap} free`, c: T.green } : { t: `all ${g.cap} busy`, c: T.sub }
    }
    if (sec === "heroes") {
      const n = bySec.heroes.filter(r => r.end > now).length
      return n ? { t: `${n} upgrading`, c: T.sub } : { t: "all ready", c: T.green }
    }
    return stat[sec].free > 0 ? { t: "free", c: T.green } : { t: "busy", c: T.sub }
  }
  const busy = secs.filter(k => bySec[k].length)
  const idle = secs.filter(k => !bySec[k].length)

  function header(parent, sec, extra, compact) {
    const hd = parent.addStack(); hd.layoutHorizontally(); hd.centerAlignContent()
    const dot = hd.addText(SECTIONS[sec].emoji); dot.font = Font.systemFont(10)
    hd.addSpacer(5)
    const ht = hd.addText(SECTIONS[sec].label.toUpperCase()); ht.font = fBold(10); ht.textColor = T.accent[sec]; ht.lineLimit = 1
    if (extra) { const ex = hd.addText(`  +${extra}`); ex.font = fSemi(10); ex.textColor = T.sub }
    hd.addSpacer()
    if (compact) return
    const ss = secStatus(sec)
    const st2 = hd.addText(ss.t); st2.font = fSemi(10); st2.textColor = ss.c; st2.lineLimit = 1
  }

  async function itemRow(parent, r, rw, o) {
    const ready = r.end <= now
    const GAP = 8
    const row = parent.addStack(); row.layoutHorizontally(); row.centerAlignContent(); row.spacing = GAP
    await addIcon(row, r, o.icon)
    const timeW = o.timeW
    const midW = Math.max(30, rw - o.icon - timeW - 2 * GAP - 6)
    const mid = row.addStack(); mid.layoutVertically(); mid.spacing = 3; mid.size = new Size(midW, 0)
    if (o.names) {
      const nl = mid.addStack(); nl.layoutHorizontally(); nl.bottomAlignContent()
      const n = nl.addText(r.name); n.font = fReg(o.font); n.textColor = T.text; n.lineLimit = 1
      if (o.level) { const lv = nl.addText(`  Lv ${r.lvl + 1}`); lv.font = fReg(o.font - 2); lv.textColor = T.sub; lv.lineLimit = 1 }
    }
    const bi = mid.addImage(bar(progress(r, now), midW, 3, ready ? T.green : barColor(r))); bi.imageSize = new Size(midW, 3)
    const tb = row.addStack(); tb.size = new Size(timeW, 0); tb.layoutHorizontally(); tb.addSpacer()
    const t = tb.addText(ready ? "Ready" : fmt(r.end - now)); t.font = fNum(o.font); t.lineLimit = 1; t.minimumScaleFactor = 0.7
    t.textColor = ready ? T.green : (mark(r) ? T.gold : T.text)
  }

  function pillInfo(k) {
    const g = stat[k === "heroes" ? "builders" : k]
    if (bySec[k] && bySec[k].some(r => r.end > now)) {
      const nx = Math.min(...bySec[k].filter(r => r.end > now).map(r => r.end))
      return { t: `${SECTIONS[k].emoji} ${SHORT[k]} · ${fmt(nx - now)}`, c: T.text }
    }
    if (k === "builders" || k === "bb") return { t: `${SECTIONS[k].emoji} ${SHORT[k]} · ${g.free} free`, c: T.green }
    return { t: `${SECTIONS[k].emoji} ${SHORT[k]} · free`, c: T.green }
  }
  function idlePills(parent, keys, maxW, footer) {
    if (!keys.length && !footer) return
    const row = parent.addStack(); row.layoutHorizontally(); row.spacing = 6; row.centerAlignContent()
    if (footer) maxW -= footer.t.length * 5.6 + 10
    let used = 0, shownN = 0
    for (const k of keys) {
      const pi = pillInfo(k)
      const est = pi.t.length * 6.2 + 22
      if (shownN && used + est > maxW - 30) break
      used += est + 6; shownN++
      const p = row.addStack(); p.backgroundColor = T.chip; p.cornerRadius = 9; p.setPadding(4, 8, 4, 8); p.centerAlignContent()
      const t = p.addText(pi.t); t.font = fSemi(10); t.textColor = pi.c; t.lineLimit = 1; t.minimumScaleFactor = 0.8
    }
    if (shownN < keys.length) { const m = row.addText(`+${keys.length - shownN}`); m.font = fSemi(10); m.textColor = T.sub }
    row.addSpacer()
    if (footer) { const f = row.addText(footer.t); f.font = fReg(10); f.textColor = footer.c; f.lineLimit = 1; f.minimumScaleFactor = 0.7 }
  }

  function share(keys, cap) {
    const take = keys.map(() => 1)
    let left = cap - keys.length, more = true
    while (left > 0 && more) { more = false; keys.forEach((k, i) => { if (left > 0 && take[i] < bySec[k].length) { take[i]++; left--; more = true } }) }
    return take
  }

  if (!secs.length) { message(w, "Nothing selected.\nOpen the script → Choose what to show.", 12); return w }

  if (family === "small") {
    const ready = rows.filter(r => r.end <= now)
    const head = w.addStack(); head.layoutHorizontally(); head.centerAlignContent()
    const ht = head.addText(multi ? name : "Next up"); ht.font = fBold(12); ht.textColor = T.text; ht.lineLimit = 1; ht.minimumScaleFactor = 0.7
    head.addSpacer(4)
    if (stale) { const sw = head.addText("⚠️"); sw.font = Font.systemFont(10) }
    head.addSpacer()
    if (ready.length) await addReady(head, ready.length, 10, T.green)
    w.addSpacer(8)
    if (!active.length) { message(w, ready.length ? "Collect your\nfinished upgrades! ✨" : "All free!\nStart an upgrade 🔨", 13); w.addSpacer(); return w }
    const barW = W - 26 - 8
    for (const r of active.slice(0, 3)) {
      const row = w.addStack(); row.layoutHorizontally(); row.centerAlignContent(); row.spacing = 8
      await addIcon(row, r, 26)
      const v = row.addStack(); v.layoutVertically(); v.spacing = 2
      const tl = v.addStack(); tl.layoutHorizontally(); tl.bottomAlignContent()
      const t = tl.addText(fmt(r.end - now)); t.font = fNum(14); t.lineLimit = 1
      t.textColor = mark(r) ? T.gold : T.text
      tl.addSpacer()
      const n = v.addText(r.name); n.font = fReg(10); n.textColor = T.sub; n.lineLimit = 1
      const bi = v.addImage(bar(progress(r, now), barW, 3, barColor(r))); bi.imageSize = new Size(barW, 3)
      w.addSpacer(7)
    }
    w.addSpacer()
    return w
  }

  if (family === "medium") {
    const ready = rows.filter(r => r.end <= now)
    const footer = { t: `${multi ? name + " · " : ""}${stale ? "⚠️ " : ""}${ago(st.base)}`, c: stale ? T.orange : T.sub }
    const freeKeys = []
    for (const k of secs) {
      if (k === "heroes") continue
      if (stat[k] && stat[k].free > 0) freeKeys.push(k)
    }
    const pills = []
    if (ready.length) pills.push({ t: `${ready.length} Ready`, c: T.green, hut: true })
    for (const k of freeKeys) {
      const g = stat[k]
      pills.push({ t: (k === "builders" || k === "bb") ? `${SECTIONS[k].emoji} ${g.free} free` : `${SECTIONS[k].emoji} free`, c: T.green })
    }
    const ROWH = 40, perCol = Math.max(1, Math.floor((H - 26 + 4) / ROWH))
    const slots = perCol * 2, picked = new Set()
    for (const k of secs) { const first = active.find(r => r.section === k); if (first && picked.size < slots) picked.add(first) }
    for (const r of active) { if (picked.size >= slots) break; picked.add(r) }
    const list = [...picked].sort((a, b) => a.end - b.end)
    if (!list.length) {
      message(w, ready.length ? "Collect your finished upgrades! ✨" : "Everything is free — start an upgrade! 🔨", 13)
    } else {
      const gap = 16, cw = Math.floor((W - gap) / 2), barW = cw - 26 - 8 - 4
      const line = w.addStack(); line.layoutHorizontally(); line.spacing = gap; line.topAlignContent()
      for (let c = 0; c < 2; c++) {
        const col = line.addStack(); col.layoutVertically(); col.size = new Size(cw, 0); col.spacing = 5
        for (const r of list.slice(c * perCol, (c + 1) * perCol)) {
          const row = col.addStack(); row.layoutHorizontally(); row.centerAlignContent(); row.spacing = 8
          await addIcon(row, r, 26)
          const v = row.addStack(); v.layoutVertically(); v.spacing = 2; v.size = new Size(barW, 0)
          const t = v.addText(fmt(r.end - now)); t.font = fNum(13); t.lineLimit = 1
          t.textColor = mark(r) ? T.gold : T.text
          const n = v.addText(`${SECTIONS[r.section].emoji} ${r.name}`); n.font = fReg(10); n.textColor = T.sub; n.lineLimit = 1
          const bi = v.addImage(bar(progress(r, now), barW, 3, barColor(r))); bi.imageSize = new Size(barW, 3)
        }
      }
    }
    w.addSpacer()
    const bottom = w.addStack(); bottom.layoutHorizontally(); bottom.centerAlignContent(); bottom.spacing = 6
    let room = W - footer.t.length * 5.6 - 16, shownP = 0
    for (const p of pills) {
      const est = p.t.length * 6.2 + 22 + (p.hut ? 16 : 0)
      if (shownP && est > room) break
      room -= est + 6; shownP++
      const pp = bottom.addStack(); pp.backgroundColor = T.chip; pp.cornerRadius = 9; pp.setPadding(4, 8, 4, 8)
      if (p.hut) { await addReady(pp, ready.length, 10, p.c); continue }
      const pt = pp.addText(p.t); pt.font = fSemi(10); pt.textColor = p.c; pt.lineLimit = 1; pt.minimumScaleFactor = 0.8
    }
    if (shownP < pills.length) { const m = bottom.addText(`+${pills.length - shownP}`); m.font = fSemi(10); m.textColor = T.sub }
    bottom.addSpacer()
    const f = bottom.addText(footer.t); f.font = fReg(10); f.textColor = footer.c; f.lineLimit = 1; f.minimumScaleFactor = 0.7
    return w
  }

  const head = w.addStack(); head.layoutHorizontally(); head.centerAlignContent()
  const tt = head.addText(multi ? name : "Clash Log"); tt.font = fBold(15); tt.textColor = T.text; tt.lineLimit = 1
  head.addSpacer()
  staleLine(head, st, s, now, 10, true)
  w.addSpacer(10)
  let avail = H - 28 - (idle.length ? 34 : 0)
  const ROW = 28, HEAD = 22
  if (!busy.length) message(w, "Everything is free — start an upgrade! 🔨", 14)
  const cap = Math.max(busy.length, Math.floor((avail - busy.length * HEAD) / ROW))
  const take = share(busy, cap)
  const o = { icon: 22, font: 13, names: true, level: true, timeW: 70 }
  for (let i = 0; i < busy.length; i++) {
    const k = busy[i], list = bySec[k], shown = list.slice(0, take[i])
    header(w, k, list.length - shown.length)
    w.addSpacer(6)
    for (const r of shown) { await itemRow(w, r, W, o); w.addSpacer(6) }
    if (i < busy.length - 1) w.addSpacer(6)
  }
  w.addSpacer()
  idlePills(w, idle, W)
  return w
}

const SHORT = { builders: "Builders", heroes: "Heroes", lab: "Lab", pets: "Pets", bb: "Builder Base", starlab: "Star Lab" }

async function overviewWidget(w, family, s, now) {
  const keys = s.order.filter(k => loadState(s, k))
  if (!keys.length) { message(w, "🔨 No accounts yet.\nCopy a village export, then open this script.", 13); return w }
  const max = family === "small" ? 3 : family === "medium" ? 3 : 7
  const title = w.addText("👥 My Villages"); title.font = fBold(family === "small" ? 12 : 14); title.textColor = T.gold
  w.addSpacer(6)
  let nextEnd = Infinity
  for (const k of keys.slice(0, max)) {
    const st = loadState(s, k), stat = status(st, now)
    const en = enabledSections(s, null, st)
    const act = st.rows.filter(r => r.end > now)
    if (act[0]) nextEnd = Math.min(nextEnd, act[0].end)
    const row = w.addStack(); row.layoutHorizontally(); row.centerAlignContent(); row.spacing = 6
    const nm = row.addText(accLabel(s, k)); nm.font = fBold(family === "small" ? 11 : 13); nm.textColor = T.text
    nm.lineLimit = 1; nm.minimumScaleFactor = 0.6
    if (isStale(st, s, now)) { const wn = row.addText("⚠️"); wn.font = Font.systemFont(10) }
    row.addSpacer()
    if (family === "small") {
      const { t, c } = chipText("builders", stat.builders, now, true)
      const tx = row.addText(t); tx.font = fBold(11); tx.textColor = c; tx.lineLimit = 1; tx.minimumScaleFactor = 0.6
    } else {
      const keysC = chipKeys(en).slice(0, family === "medium" ? 3 : 5)
      for (const ck of keysC) {
        const { t, c } = chipText(ck, stat[ck], now, true)
        const chip = row.addStack(); chip.backgroundColor = T.chip; chip.cornerRadius = 7; chip.setPadding(2, 5, 2, 5)
        const tx = chip.addText(t); tx.font = fBold(10); tx.textColor = c; tx.lineLimit = 1; tx.minimumScaleFactor = 0.6
      }
    }
    w.addSpacer(family === "large" ? 10 : 6)
  }
  w.addSpacer()
  w.refreshAfterDate = new Date(Math.max(now + 60000, Math.min(nextEnd + 30000, now + 15 * 60000)))
  return w
}

// ---------- lock screen ----------
function lockLine(k, st, stat, now, short) {
  const e = SECTIONS[k].emoji
  const T2 = ms => short ? fmtShort(ms) : fmt(ms)
  const act = st.rows.filter(r => r.section === k && r.end > now)
  const soon = act.length ? Math.min(...act.map(r => r.end)) : null
  if (k === "builders" || k === "bb") {
    const g = stat[k]
    if (g.free > 0) return soon ? `${e} ${g.free} free · ${T2(soon - now)}` : `${e} ${g.free} free`
    return `${e} ${T2(g.next - now)}`
  }
  if (k === "heroes") return soon ? `${e} ${T2(soon - now)}` : `${e} ready`
  return soon ? `${e} ${T2(soon - now)}` : `${e} free`
}
function ringImage(p, size, full) {
  const dc = new DrawContext(); dc.size = new Size(size, size); dc.opaque = false; dc.respectScreenScale = true
  const lw = 5, r = size / 2 - lw / 2 - 1, c = size / 2
  const arc = (from, to, color) => {
    const path = new Path(), steps = Math.max(2, Math.round(80 * (to - from)))
    for (let i = 0; i <= steps; i++) {
      const a = -Math.PI / 2 + 2 * Math.PI * (from + (to - from) * i / steps)
      const pt = new Point(c + r * Math.cos(a), c + r * Math.sin(a))
      if (i === 0) path.move(pt); else path.addLine(pt)
    }
    dc.addPath(path); dc.setStrokeColor(color); dc.setLineWidth(lw); dc.strokePath()
  }
  arc(0, 1, new Color("#ffffff", 0.25))
  const v = full ? 1 : Math.max(0.02, Math.min(1, p))
  arc(0, v, new Color("#ffffff", 1))
  return dc.getImage()
}
async function lockWidget(w, family, s, st, pp, now, multi, name) {
  const want = pp.sections || s.lock.sections
  const keys = ORDER.filter(k => want[k] && st.present[k])
  const stat = status(st, now)
  const active = st.rows.filter(r => keys.includes(r.section) && r.end > now)
  if (!keys.length) { const t = w.addText("Clash Log: pick sections"); t.font = fSemi(11); return w }

  if (family === "accessoryInline") {
    const parts = keys.filter(k => k !== "heroes" || !keys.includes("builders")).slice(0, 3).map(k => lockLine(k, st, stat, now, true))
    w.addText((multi ? name.replace(/^#/, "") + " " : "") + parts.join("  "))
    return w
  }

  if (family === "accessoryCircular") {
    w.addAccessoryWidgetBackground = true
    const k = pp.first || (keys.includes(s.lock.circle) ? s.lock.circle : keys[0])
    const g = stat[k === "heroes" ? "builders" : k]
    const secsFor = k === "builders" ? ["builders", "heroes"] : [k]
    const list = st.rows.filter(r => secsFor.includes(r.section) && r.end > now)
    const soon = list[0]
    let big, ring = 0, full = false
    if ((k === "builders" || k === "bb") && g.free > 0) { big = String(g.free); full = true }
    else if (soon) { big = fmtShort(soon.end - now); ring = progress(soon, now) }
    else { big = "✓"; full = true }
    try { w.backgroundImage = ringImage(ring, 76, full) } catch (e) {}
    const v = w.addStack(); v.layoutVertically(); v.centerAlignContent()
    const top = v.addStack(); top.layoutHorizontally(); top.addSpacer()
    const e = top.addText(SECTIONS[k].emoji); e.font = Font.systemFont(11); top.addSpacer()
    const mid = v.addStack(); mid.layoutHorizontally(); mid.addSpacer()
    const t = mid.addText(big); t.font = fBold(big.length > 3 ? 13 : 17); t.minimumScaleFactor = 0.6; t.lineLimit = 1; mid.addSpacer()
    return w
  }

  const mode = pp.mode || s.lock.rect
  const title = w.addText(`Clash Log${multi ? " · " + name.replace(/^#/, "") : ""}`)
  title.font = fBold(10); title.lineLimit = 1; title.minimumScaleFactor = 0.8; title.textOpacity = 0.75
  if (mode === "next") {
    const list = active.slice(0, 3)
    if (!list.length) { const t = w.addText("All free — start an upgrade!"); t.font = fSemi(12); return w }
    for (const r of list) {
      const row = w.addStack(); row.layoutHorizontally()
      const n = row.addText(`${SECTIONS[r.section].emoji} ${r.name}`); n.font = fReg(11); n.lineLimit = 1; n.minimumScaleFactor = 0.8
      row.addSpacer(4)
      const t = row.addText(fmt(r.end - now)); t.font = fBold(11); t.lineLimit = 1
    }
    return w
  }
  const items = keys.filter(k => k !== "heroes" || !keys.includes("builders") || keys.length <= 3).map(k => lockLine(k, st, stat, now, keys.length > 3))
  const lines = []
  if (items.length <= 3) items.forEach(t => lines.push([t]))
  else for (let i = 0; i < Math.min(items.length, 6); i += 2) lines.push(items.slice(i, i + 2))
  const fs = items.length <= 3 ? 12 : 11
  for (const ln of lines) {
    const row = w.addStack(); row.layoutHorizontally()
    const a = row.addText(ln[0]); a.font = fSemi(fs); a.lineLimit = 1; a.minimumScaleFactor = 0.7
    row.addSpacer()
    if (ln[1]) { const b = row.addText(ln[1]); b.font = fSemi(fs); b.lineLimit = 1; b.minimumScaleFactor = 0.7 }
  }
  return w
}

async function lockMenu(s) {
  while (true) {
    const L = s.lock
    const opts = ORDER.map(k => `${L.sections[k] ? "✅" : "⬜️"}  ${SECTIONS[k].emoji} ${SECTIONS[k].label}`)
    opts.push(`▭ Rectangle shows: ${L.rect === "next" ? "Next upgrades" : "Each section's soonest time"}`)
    opts.push(`◯ Circle shows: ${SECTIONS[L.circle].emoji} ${SECTIONS[L.circle].label}`)
    const k = await pick("🔒 Lock Screen widgets", "Choose what Lock Screen widgets show. A widget's Parameter (e.g. \"lab\" or \"next\") overrides this.", opts)
    if (k < 0) return
    if (k < ORDER.length) L.sections[ORDER[k]] = !L.sections[ORDER[k]]
    else if (k === ORDER.length) L.rect = L.rect === "next" ? "sections" : "next"
    else {
      const c = await pick("◯ Circle shows", "Shows the soonest finish with a progress ring (or free builders).", ORDER.map(x => `${SECTIONS[x].emoji} ${SECTIONS[x].label}`))
      if (c >= 0) L.circle = ORDER[c]
    }
    s.lock = L; saveSettings(s)
  }
}

// ---------- notifications ----------
const NOTIF_DEFAULTS = { quiet: false, quietStart: 23 * 60, quietEnd: 7 * 60, group: 5, exportNudge: true }
function nset(s) { return Object.assign({}, NOTIF_DEFAULTS, s.notif || {}) }
function hhmm(m) { return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}` }
function inQuiet(t, N) {
  if (!N.quiet) return false
  const d = new Date(t), m = d.getHours() * 60 + d.getMinutes()
  return N.quietStart > N.quietEnd ? (m >= N.quietStart || m < N.quietEnd) : (m >= N.quietStart && m < N.quietEnd)
}
function quietEndAfter(t, N) {
  const d = new Date(t); d.setHours(Math.floor(N.quietEnd / 60), N.quietEnd % 60, 0, 0)
  if (d.getTime() <= t) d.setDate(d.getDate() + 1)
  return d.getTime()
}
function scriptURL(q) { return `scriptable:///run/${encodeURIComponent(Script.name())}?${q}` }
const CLASH_URL = "clashofclans://"

function addAlertActions(n, title, body) {
  n.addAction("⚔️ Open Clash of Clans", CLASH_URL)
  n.addAction("📊 Open dashboard", scriptURL("dash=1"))
  n.addAction("⏰ Remind me in 15 min", scriptURL(`snooze=1&t=${encodeURIComponent(title)}&b=${encodeURIComponent(body)}`))
}

function doneAlert(key, acc, g, multi) {
  const prefix = multi ? `[${acc.name}] ` : ""
  const n = new Notification()
  n.identifier = `clashlog_${key}_done_${g.at}_${g.items[0].id}`
  n.threadIdentifier = `clash-log-${key}`
  if (g.items.length === 1) {
    const r = g.items[0]
    n.title = `${prefix}${KIND_EMOJI[r.kind] || "🏗️"} ${r.name} → Lv ${r.lvl + 1} done!`
    n.body = (g.night ? "Finished while you slept. " : "") + SECTIONS[r.section].free
  } else {
    n.title = g.night ? `${prefix}🌅 ${g.items.length} upgrades finished overnight` : `${prefix}✅ ${g.items.length} upgrades done!`
    n.body = g.items.map(r => `${KIND_EMOJI[r.kind] || "🏗️"} ${r.name} ${r.lvl + 1}`).join(" · ") + "\nTime to start the next ones!"
  }
  n.sound = "complete"
  n.userInfo = { cb: "done", account: key, night: !!g.night,
    items: g.items.map(r => ({ id: r.id, name: r.name, lvl: r.lvl, icon: r.icon, section: r.section, kind: r.kind, color: r.color || "" })) }
  n.scriptName = Script.name()
  n.preferredContentHeight = Math.min(420, 120 + 64 * Math.min(g.items.length, 4))
  addAlertActions(n, n.title, n.body)
  n.setTriggerDate(new Date(g.at))
  return n
}

async function scheduleNotifs(s, key) {
  const acc = s.accounts[key]; if (!acc) return
  try { if (acc.notifIds && acc.notifIds.length) await Notification.removePending(acc.notifIds) } catch (e) {}
  acc.notifIds = []
  const st = loadState(s, key)
  if (!s.notify || !st) return
  const N = nset(s), now = Date.now(), multi = s.order.length > 1

  const ev = st.rows.filter(r => r.end > now + 30000 && s.sections[r.section]).map(r => ({ r, at: r.end, night: false }))
  for (const e of ev) if (inQuiet(e.at, N)) { e.at = quietEndAfter(e.at, N); e.night = true }
  ev.sort((a, b) => a.at - b.at)

  const groups = []
  for (const e of ev) {
    const g = groups[groups.length - 1]
    const join = g && (e.night && g.night ? e.at === g.at
      : (!e.night && !g.night && N.group > 0 && e.at - g.start <= N.group * 60000))
    if (join) { g.items.push(e.r); g.at = Math.max(g.at, e.at) }
    else groups.push({ start: e.at, at: e.at, night: e.night, items: [e.r] })
  }

  const prefix = multi ? `[${acc.name}] ` : ""
  for (const g of groups) {
    try { const n = doneAlert(key, acc, g, multi); await n.schedule(); acc.notifIds.push(n.identifier) } catch (e) {}
    if (N.exportNudge) {
      try {
        const m = new Notification()
        m.identifier = `clashlog_${key}_nudge_${g.at}`
        m.threadIdentifier = `clash-log-${key}`
        m.title = `${prefix}📋 Started a new upgrade?`
        m.body = "Copy your village export so your widget timers stay right: Settings → More Settings → Data Export → Copy."
        m.sound = "default"
        m.addAction("⚔️ Open Clash of Clans", CLASH_URL)
        m.setTriggerDate(new Date(g.at + 3 * 60000))
        await m.schedule(); acc.notifIds.push(m.identifier)
      } catch (e) {}
    }
  }
}
async function rescheduleAll(s) { for (const k of s.order) await scheduleNotifs(s, k); saveSettings(s) }

async function snooze(q) {
  const n = new Notification()
  n.identifier = `clashlog_snooze_${Date.now()}`
  n.title = q.t || "⏰ Clash reminder"; n.body = q.b || "Your builders are waiting!"
  n.sound = "complete"
  addAlertActions(n, n.title, n.body)
  n.setTriggerDate(new Date(Date.now() + 15 * 60000))
  await n.schedule()
  const a = new Alert(); a.title = "⏰ Reminder set"; a.message = "I'll remind you again in 15 minutes."; a.addAction("OK"); await a.present()
}

async function richNotification(s) {
  const info = (args.notification && args.notification.userInfo) || {}
  const items = info.items || []
  const st = info.account ? loadState(s, info.account) : null
  const now = Date.now()
  const uri = p => { const f = p && iconFile(p); try { if (f && fm.fileExists(f)) return "data:image/png;base64," + fm.read(f).toBase64String() } catch (e) {} return "" }
  const card = (r, right, cls) => `<div class="row"><div class="slot">${uri(r.icon) ? `<img src="${uri(r.icon)}">` : `<span>${KIND_EMOJI[r.kind] || "🏗️"}</span>`}</div>
    <div class="nm">${r.name}<span class="lv">Lv ${r.lvl + 1}</span></div><div class="${cls}">${right}</div></div>`
  const next = st ? st.rows.filter(r => r.end > now && s.sections[r.section]).slice(0, 3) : []
  const html = `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>
  body{margin:0;padding:10px;font-family:ui-rounded,-apple-system,system-ui;color:#3d2410;
   background:repeating-linear-gradient(180deg,#5d3819 0 30px,#2c1607 30px 32px)}
  .panel{background:linear-gradient(180deg,#f3e6c6,#e4cf9f);border:3px solid #6b3f17;border-radius:14px;overflow:hidden;box-shadow:0 4px 0 #1f0f03;margin-bottom:8px}
  .rib{padding:6px 10px;background:linear-gradient(180deg,#a86a33,#653817);border-bottom:3px solid #6b3f17;color:#fff;font-weight:800;font-size:15px;
   text-shadow:0 2px 0 #000,1px 1px 0 #000,-1px 1px 0 #000,1px -1px 0 #000,-1px -1px 0 #000}
  .row{display:flex;align-items:center;gap:10px;padding:6px 10px;border-bottom:2px dashed rgba(107,63,23,.2)}
  .row:last-child{border:none}
  .slot{width:44px;height:44px;flex:none;border-radius:10px;background:linear-gradient(180deg,#fffaf0,#e8d3a6);border:2px solid #a77a43;display:flex;align-items:center;justify-content:center;font-size:24px}
  .slot img{width:40px;height:40px;object-fit:contain}
  .nm{flex:1;font-weight:700;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .lv{font-size:11px;color:#fff;background:#3a6fb0;border:2px solid #1d3d66;border-radius:7px;padding:0 5px;margin-left:6px}
  .ok{color:#fff;font-weight:800;font-size:13px;padding:4px 10px;border-radius:10px;background:linear-gradient(180deg,#a6ee4a,#4a9a0c);border:2px solid #234f04;
   text-shadow:0 1px 0 #1b3a05}
  .tm{font-weight:800;font-size:14px;color:#3d2410}
  </style></head><body>
  <div class="panel"><div class="rib">${info.night ? "🌅 Finished overnight" : "✅ Upgrade complete"}</div>${items.map(r => card(r, "Done!", "ok")).join("")}</div>
  ${next.length ? `<div class="panel"><div class="rib">⏳ Still upgrading</div>${next.map(r => card(r, fmt(r.end - now), "tm")).join("")}</div>` : ""}
  </body></html>`
  const wv = new WebView()
  await wv.loadHTML(html)
  await wv.present()
}

async function notifMenu(s) {
  while (true) {
    const N = nset(s)
    const k = await pick("🔔 Notifications", "Alerts when upgrades finish. Changes apply to all accounts.", [
      `Alerts: ${s.notify ? "On" : "Off"}`,
      `🌙 Quiet hours: ${N.quiet ? hhmm(N.quietStart) + "–" + hhmm(N.quietEnd) : "Off"}`,
      `🧺 Group alerts finishing within: ${N.group ? N.group + " min" : "Off"}`,
      `📋 "Copy export" reminder 3 min after: ${N.exportNudge ? "On" : "Off"}`
    ])
    if (k < 0) return
    if (k === 0) s.notify = !s.notify
    else if (k === 1) {
      const opts = [["Off"], ["22:00–07:00", 22 * 60, 7 * 60], ["23:00–07:00", 23 * 60, 7 * 60], ["00:00–08:00", 0, 8 * 60], ["Custom…"]]
      const q = await pick("🌙 Quiet hours", "Alerts that land in quiet hours are bundled into one morning alert.", opts.map(o => o[0]))
      if (q === 0) N.quiet = false
      else if (q > 0 && q < 4) { N.quiet = true; N.quietStart = opts[q][1]; N.quietEnd = opts[q][2] }
      else if (q === 4) {
        const a = new Alert(); a.title = "Quiet hours"; a.message = "Use 24-hour time, e.g. 23:30 and 07:00."
        a.addTextField("Start", hhmm(N.quietStart)); a.addTextField("End", hhmm(N.quietEnd))
        a.addAction("Save"); a.addCancelAction("Cancel")
        if (await a.present() === 0) {
          const parse = v => { const m = /^(\d{1,2})[:.](\d{2})$/.exec(String(v).trim()); return m && +m[1] < 24 && +m[2] < 60 ? +m[1] * 60 + +m[2] : null }
          const st = parse(a.textFieldValue(0)), en = parse(a.textFieldValue(1))
          if (st !== null && en !== null && st !== en) { N.quiet = true; N.quietStart = st; N.quietEnd = en }
        }
      }
    } else if (k === 2) {
      const opts = [0, 5, 10, 15]
      const q = await pick("🧺 Group alerts", "Upgrades finishing within this time of each other come as one alert.", opts.map(m => m ? `${m} minutes` : "Off"))
      if (q >= 0) N.group = opts[q]
    } else if (k === 3) N.exportNudge = !N.exportNudge
    s.notif = N
    await rescheduleAll(s)
  }
}

// ---------- import ----------
async function importClipboard(s, onlyIfNew) {
  const raw = Pasteboard.paste()
  const exp = parseExport(raw)
  if (!exp) return { ok: false }
  const key = accountKey(exp, s)
  if (onlyIfNew && fm.fileExists(accPath(key)) && fm.readString(accPath(key)) === raw) return { ok: false, same: true, key }
  const isNew = !s.accounts[key]
  const acc = ensureAccount(s, key, exp)
  fm.writeString(accPath(key), raw)
  acc.importedAt = Date.now()
  s.current = key
  clearCache()
  await scheduleNotifs(s, key)
  saveSettings(s)
  const st = loadState(s, key)
  if (st) for (const r of st.rows) await getIcon(r.icon, true)
  await getIcon(hutIconPath(), true)
  return { ok: true, key, isNew }
}

// ---------- dashboard ----------
async function dashboard(s, startKey) {
  const now = Date.now()
  const dataUri = p => {
    const f = p && iconFile(p)
    if (f && fm.fileExists(f)) { try { return "data:image/png;base64," + fm.read(f).toBase64String() } catch (e) {} }
    return p ? ICON_BASE + p : ""
  }
  const accounts = []
  for (const k of s.order) {
    const st = loadState(s, k); if (!st) continue
    const en = enabledSections(s, null, st)
    const rows = st.rows.filter(r => en[r.section]).map(r => ({ name: r.name, lvl: r.lvl, end: r.end, total: r.total,
      section: r.section, icon: dataUri(r.icon), emoji: KIND_EMOJI[r.kind] || "🏗️", color: r.color ? "#" + r.color : "" }))
    accounts.push({ key: k, name: accLabel(s, k), tag: s.accounts[k].tag || "", base: st.base, stale: isStale(st, s, now),
      caps: st.caps, secs: ORDER.filter(x => en[x]), rows })
  }
  const data = { accounts, start: Math.max(0, accounts.findIndex(a => a.key === startKey)), current: s.current,
    sections: SECTIONS, order: ORDER, coffee: !!COFFEE_URL, kofiLogo: KOFI_LOGO_URL, hut: await (async () => { await getIcon(hutIconPath(), true); return dataUri(hutIconPath()) })() }
  const wv = new WebView()
  let coffeeSeen = ""
  const openCoffee = v => { if (COFFEE_URL && v && v !== coffeeSeen) { coffeeSeen = v; Safari.open(COFFEE_URL) } }
  const choose = key => { if (key && s.accounts[key] && s.current !== key) { s.current = key; saveSettings(s) } }
  wv.shouldAllowRequest = req => {
    const u = String((req && req.url) || "")
    if (u.indexOf("clashlog://default/") === 0) { choose(decodeURIComponent(u.slice("clashlog://default/".length))); return false }
    if (u.indexOf("clashlog://coffee") === 0) { openCoffee("hook"); return false }
    return true
  }
  await wv.loadHTML(DASH_HTML.replace("__DATA__", JSON.stringify(data).replace(/</g, "\\u003c")))
  let open = true
  const shown = wv.present(true).then(() => { open = false }, () => { open = false })
  const sleep = ms => new Promise(r => Timer.schedule(ms, false, r))
  while (open) {
    await sleep(400)
    try { choose(await wv.evaluateJavaScript("window.__chosen || ''", false)) } catch (e) {}
    try { const c = await wv.evaluateJavaScript("String(window.__coffee || '')", false); if (c && coffeeSeen !== "hook") openCoffee(c); else if (c) coffeeSeen = c } catch (e) {}
  }
  await shown
  try { choose(await wv.evaluateJavaScript("window.__chosen || ''", false)) } catch (e) {}
}

const DASH_HTML = `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,viewport-fit=cover">
<link href="https://fonts.googleapis.com/css2?family=Lilita+One&display=swap" rel="stylesheet">
<style>
:root{--ink:#3d2410;--ink2:#7a5531;--paper:#f3e6c6;--paper2:#e4cf9f;--edge:#6b3f17;--wood:#7a4a22;--wood2:#4e2c12;
 --green:#7ed321;--green2:#3f8a0c;--gold:#ffd23f;--orange:#f5a623;--red:#e64a2e}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none}
html{background:#2b1909}
body{margin:0;min-height:100vh;font-family:"Lilita One",ui-rounded,-apple-system,system-ui,sans-serif;color:var(--ink);
 background:linear-gradient(180deg,rgba(0,0,0,.15),rgba(0,0,0,.45)),repeating-linear-gradient(180deg,#5d3819 0 34px,#2c1607 34px 36px,#55321a 36px 70px,#2c1607 70px 72px);
 padding:0 12px calc(30px + env(safe-area-inset-bottom))}
.o{color:#fff;text-shadow:0 2px 0 #000,1px 1px 0 #000,-1px 1px 0 #000,1px -1px 0 #000,-1px -1px 0 #000,0 3px 3px rgba(0,0,0,.35)}
.top{position:sticky;top:0;z-index:5;margin:0 -12px 12px;padding:calc(10px + env(safe-area-inset-top)) 16px 12px;
 background:linear-gradient(180deg,#9a6230,#6e3f18 60%,#5a3212);border-bottom:3px solid #2a1405;box-shadow:0 4px 0 rgba(0,0,0,.35)}
.top{display:flex;align-items:center;gap:10px}
.top .ttl{flex:1;min-width:0}
.top h1{margin:0;font-size:24px;font-weight:400;letter-spacing:.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.top .sub{font-size:12px;color:#ffe9b8;margin-top:1px;text-shadow:0 1px 0 #000;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.wbtn{flex:none;max-width:52%;padding:8px 12px;border-radius:12px;font-size:14px;font-family:inherit;color:#fff;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
 background:linear-gradient(180deg,#a6ee4a,#5fb014 55%,#4a9a0c);border:2px solid #234f04;box-shadow:inset 0 2px 0 rgba(255,255,255,.55),0 3px 0 #1b3a05;
 text-shadow:0 2px 0 #1b3a05,1px 1px 0 #1b3a05,-1px 1px 0 #1b3a05,1px -1px 0 #1b3a05,-1px -1px 0 #1b3a05}
.cbtn{flex:none;height:38px;padding:0 10px;border-radius:12px;font-size:15px;font-family:inherit;color:#fff;cursor:pointer;white-space:nowrap;
 text-shadow:0 2px 0 #7a3d00,1px 1px 0 #7a3d00,-1px 1px 0 #7a3d00,1px -1px 0 #7a3d00,-1px -1px 0 #7a3d00;
 background:linear-gradient(180deg,#ffe07a,#f5a623);border:2px solid #7a4a0e;box-shadow:inset 0 2px 0 rgba(255,255,255,.6),0 3px 0 #4a2a05}
.cbtn{display:flex;align-items:center;gap:5px}
.cbtn img{width:24px;height:24px;object-fit:contain;filter:drop-shadow(0 1px 0 rgba(0,0,0,.5))}
.cbtn:active{transform:translateY(2px);box-shadow:inset 0 2px 0 rgba(255,255,255,.6),0 1px 0 #4a2a05}
.wbtn:active{transform:translateY(2px);box-shadow:inset 0 2px 0 rgba(255,255,255,.55),0 1px 0 #1b3a05}
.wbtn.done{background:linear-gradient(180deg,#d9c39a,#b89a68);border-color:#6b4a1f;box-shadow:inset 0 2px 0 rgba(255,255,255,.4),0 3px 0 #3a2208;text-shadow:0 1px 0 #4a3010}
.tabs{display:flex;gap:8px;overflow-x:auto;padding:2px 2px 10px;scrollbar-width:none}
.tabs::-webkit-scrollbar{display:none}
.tab{flex:none;position:relative;padding:9px 16px 10px;border-radius:12px;font-size:16px;color:var(--ink2);
 background:linear-gradient(180deg,#e9d6a8,#cfb07a);border:2px solid var(--edge);box-shadow:inset 0 2px 0 rgba(255,255,255,.55),0 3px 0 #2a1405;transition:transform .15s}
.tab.on{color:#fff;background:linear-gradient(180deg,#ffe07a,#f5a623);border-color:#7a4a0e;transform:translateY(-2px);
 text-shadow:0 2px 0 #7a3d00,1px 1px 0 #7a3d00,-1px 1px 0 #7a3d00,1px -1px 0 #7a3d00,-1px -1px 0 #7a3d00}
.tab .pin{position:absolute;top:-8px;right:-6px;font-size:13px;background:var(--green);border:2px solid #2b5c08;border-radius:10px;padding:0 5px;color:#fff;
 text-shadow:0 1px 0 #000;box-shadow:0 2px 0 #1b3a05}
.bar{display:flex;flex-wrap:wrap;gap:8px;margin:2px 0 12px}
.cap{display:flex;align-items:center;gap:6px;padding:4px 12px 4px 4px;border-radius:20px;background:rgba(0,0,0,.45);border:2px solid rgba(0,0,0,.6);font-size:15px;
 box-shadow:inset 0 2px 0 rgba(255,255,255,.08)}
.cap .ic{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;
 background:radial-gradient(circle at 35% 30%,#fff6d2,#d9b46a 60%,#9a6b2a);border:2px solid #3a2208}
.cap img.ic{object-fit:contain;background:none;border:none}
.cap.free{border-color:#2b5c08;background:linear-gradient(180deg,#8fe02b,#4b9a10)}
.note{background:linear-gradient(180deg,#fff2c2,#f6d77c);border:2px solid #8a5a12;border-radius:12px;padding:8px 12px;margin:0 0 12px;
 font-size:14px;color:#6b3a00;box-shadow:0 3px 0 #2a1405;display:flex;align-items:center;gap:8px}
.panel{background:linear-gradient(180deg,var(--paper),var(--paper2));border:3px solid var(--edge);border-radius:16px;margin:0 0 14px;
 box-shadow:inset 0 3px 0 rgba(255,255,255,.6),inset 0 -4px 0 rgba(120,70,20,.18),0 5px 0 #1f0f03;overflow:hidden;animation:pop .45s cubic-bezier(.2,1.4,.4,1) both}
.ribbon{display:flex;align-items:center;gap:8px;padding:8px 12px;background:linear-gradient(180deg,#a86a33,#7a4620 55%,#653817);border-bottom:3px solid var(--edge)}
.ribbon .t{font-size:18px;flex:1}
.ribbon .st{font-size:14px;padding:2px 10px;border-radius:10px;background:rgba(0,0,0,.35)}
.ribbon .st.free{background:linear-gradient(180deg,#8fe02b,#4b9a10);border:2px solid #2b5c08}
.rows{padding:6px 10px 8px}
.row{display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:2px dashed rgba(107,63,23,.22)}
.row:last-child{border-bottom:none}
.slot{width:52px;height:52px;flex:none;border-radius:12px;background:linear-gradient(180deg,#fffaf0,#e8d3a6);border:2px solid #a77a43;
 box-shadow:inset 0 -3px 0 rgba(120,70,20,.2),0 2px 0 rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center}
.slot img{width:46px;height:46px;object-fit:contain;filter:drop-shadow(0 2px 1px rgba(0,0,0,.35))}
.slot .em{font-size:28px}
.info{flex:1;min-width:0}
.nm{font-size:16px;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lv{font-size:12px;color:#fff;background:#3a6fb0;border:2px solid #1d3d66;border-radius:8px;padding:0 6px;margin-left:6px;vertical-align:2px;text-shadow:0 1px 0 #000}
.tbar{position:relative;height:22px;margin-top:5px;border-radius:11px;background:#2a1708;border:2px solid #120802;overflow:hidden;box-shadow:inset 0 3px 3px rgba(0,0,0,.6)}
.fill{position:absolute;left:0;top:0;bottom:0;width:0;border-radius:9px;transition:width 1.2s cubic-bezier(.2,1,.3,1)}
.fill:before{content:"";position:absolute;left:4px;right:4px;top:2px;height:6px;border-radius:6px;background:rgba(255,255,255,.45)}
.fill:after{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent 35%,rgba(255,255,255,.35) 50%,transparent 65%);transform:translateX(-100%);animation:shine 2.6s ease-in-out infinite}
.tt{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:14px;letter-spacing:.3px}
.row.next .tbar{border-color:#7a4a0e;box-shadow:0 0 0 2px var(--gold),inset 0 3px 3px rgba(0,0,0,.6)}
.ready{display:flex;align-items:center;justify-content:center;gap:6px;height:30px;margin-top:4px;border-radius:12px;font-size:16px;
 background:linear-gradient(180deg,#a6ee4a,#5fb014 55%,#4a9a0c);border:2px solid #234f04;box-shadow:inset 0 2px 0 rgba(255,255,255,.55),0 3px 0 #1b3a05;animation:bounce 1.4s ease-in-out infinite}
.ready img{width:20px;height:20px;object-fit:contain}
.idle{padding:12px;text-align:center;color:var(--ink2);font-size:15px}
.toast{position:fixed;left:50%;bottom:calc(24px + env(safe-area-inset-bottom));transform:translate(-50%,140%);background:rgba(0,0,0,.8);border:2px solid #000;border-radius:14px;
 padding:10px 16px;font-size:15px;transition:transform .35s cubic-bezier(.2,1.4,.4,1),opacity .25s;z-index:9;white-space:nowrap;opacity:0;pointer-events:none}
.toast.show{transform:translate(-50%,0);opacity:1}
.empty{margin-top:30px;text-align:center;font-size:18px}
.confetti{position:fixed;top:-14px;width:10px;height:14px;border-radius:2px;pointer-events:none;z-index:8;animation:fall linear forwards}
@keyframes pop{from{opacity:0;transform:translateY(14px) scale(.97)}}
@keyframes shine{0%{transform:translateX(-100%)}60%,100%{transform:translateX(100%)}}
@keyframes bounce{0%,100%{transform:scale(1)}50%{transform:scale(1.035)}}
@keyframes fall{to{transform:translateY(106vh) rotate(720deg)}}
@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
</style></head><body>
<div class="top"><div class="ttl"><h1 class="o">Clash Log</h1><div class="sub" id="sub"></div></div><button class="cbtn" id="coffee" title="Support me on Ko-fi"><span id="kofiIc">☕</span> Ko-fi</button><button class="wbtn" id="use"></button></div>
<div class="tabs" id="tabs"></div>
<div class="bar" id="bar"></div>
<div id="note"></div>
<div id="list"></div>
<div class="toast o" id="toast"></div>
<script>
var D=__DATA__,cur=D.start,current=D.current,readySeen=new Set();
function $(s){return document.querySelector(s)}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function fmt(ms){if(ms<=0)return"Ready!";var s=Math.ceil(ms/1000),d=Math.floor(s/86400),h=Math.floor(s%86400/3600),m=Math.floor(s%3600/60),x=s%60;
 if(d)return d+"d "+h+"h "+m+"m";if(h)return h+"h "+m+"m "+String(x).padStart(2,"0")+"s";return m+"m "+String(x).padStart(2,"0")+"s"}
function ago(t){var m=Math.floor((Date.now()-t)/60000);return m<1?"just now":m<60?m+"m ago":m<1440?Math.floor(m/60)+"h ago":Math.floor(m/1440)+"d ago"}
function stat(a,now){function act(secs){return a.rows.filter(function(r){return secs.indexOf(r.section)>=0&&r.end>now})}
 function sl(b,c){return{free:Math.max(0,c-b.length),cap:c,next:b.length?Math.min.apply(null,b.map(function(r){return r.end})):null}}
 return{builders:sl(act(["builders","heroes"]),a.caps.builders),lab:sl(act(["lab"]),1),pets:sl(act(["pets"]),1),bb:sl(act(["bb"]),a.caps.bb),starlab:sl(act(["starlab"]),1)}}
function confetti(n){var c=["#ffd23f","#7ed321","#ff6b4a","#4ab8ff","#fff3d6","#e65cf0"];for(var i=0;i<n;i++){var e=document.createElement("div");e.className="confetti";
 e.style.left=Math.random()*100+"vw";e.style.background=c[i%c.length];e.style.animationDuration=(1.6+Math.random()*1.6)+"s";e.style.animationDelay=Math.random()*.4+"s";
 document.body.appendChild(e);(function(el){setTimeout(function(){el.remove()},3800)})(e)}}
function toast(t){var el=$("#toast");el.textContent=t;el.classList.add("show");clearTimeout(window.__tt);window.__tt=setTimeout(function(){el.classList.remove("show")},2200)}
function useBtn(){var a=D.accounts[cur],b=$("#use");if(!a){b.style.display="none";return}
 b.style.display=D.accounts.length>1?"block":"none";
 if(a.key===current){b.className="wbtn done";b.textContent="✔ On widget"}else{b.className="wbtn";b.textContent="Show on widget"}}
$("#coffee").style.display=D.coffee?"flex":"none";
if(D.kofiLogo){var ki=new Image();ki.alt="Ko-fi";ki.onload=function(){var sp=$("#kofiIc");if(sp)sp.replaceWith(ki)};ki.src=D.kofiLogo}
$("#coffee").onclick=function(){window.__coffee=String(Date.now());toast("☕ Thanks for supporting Clash Log!");setTimeout(function(){location.href="clashlog://coffee"},60)};
$("#use").onclick=function(){var a=D.accounts[cur];if(!a||a.key===current)return;current=a.key;window.__chosen=a.key;
 renderTabs();useBtn();toast("Saved ✔ Widgets will show "+a.name);setTimeout(function(){location.href="clashlog://default/"+encodeURIComponent(a.key)},60)}
function renderTabs(){$("#tabs").innerHTML=D.accounts.length>1?D.accounts.map(function(x,i){return'<div class="tab'+(i===cur?" on":"")+'" data-i="'+i+'">'+esc(x.name)+(x.key===current?'<span class="pin">✔</span>':"")+"</div>"}).join(""):"";
 Array.prototype.forEach.call(document.querySelectorAll(".tab"),function(t){t.onclick=function(){cur=+t.dataset.i;render()}})}
function render(){var a=D.accounts[cur];renderTabs();useBtn();
 if(!a){$("#list").innerHTML='<div class="empty o">No village data yet.<br>Copy your export in Clash,<br>then run the script.</div>';return}
 $("#sub").textContent=(a.tag?a.tag+" · ":"")+"Updated "+ago(a.base);
 $("#note").innerHTML=a.stale?'<div class="note">⚠️ This data is '+ago(a.base).replace(" ago","")+' old — copy your village export again.</div>':"";
 var h="",i=0;
 a.secs.forEach(function(k){var rows=a.rows.filter(function(r){return r.section===k});
  h+='<div class="panel" style="animation-delay:'+(i++*70)+'ms"><div class="ribbon"><span style="font-size:18px">'+D.sections[k].emoji+'</span><span class="t o">'+D.sections[k].label+'</span><span class="st o" data-st="'+k+'"></span></div><div class="rows">';
  if(!rows.length)h+='<div class="idle">All free — start an upgrade!</div>';
  rows.forEach(function(r){var col=r.color||"#7ed321";
   h+='<div class="row" data-end="'+r.end+'" data-total="'+r.total+'" data-sec="'+r.section+'"><div class="slot">'+
    (r.icon?'<img src="'+r.icon+'">':'<span class="em">'+r.emoji+"</span>")+'</div><div class="info"><div class="nm">'+esc(r.name)+'<span class="lv">Lv '+(r.lvl+1)+'</span></div>'+
    '<div class="tbar"><div class="fill" style="background:linear-gradient(180deg,'+col+','+col+' 55%,rgba(0,0,0,.25)),'+col+'"></div><span class="tt o"></span></div>'+
    '<div class="ready o" style="display:none">'+(D.hut?'<img src="'+D.hut+'">':"")+'Ready!</div></div></div>'});
  h+="</div></div>"});
 $("#list").innerHTML=h;readySeen=new Set();tick(true)}
function tick(first){var a=D.accounts[cur];if(!a)return;var now=Date.now(),st=stat(a,now),ready=a.rows.filter(function(r){return r.end<=now}).length;
 var caps="";
 if(a.secs.indexOf("builders")>=0||a.secs.indexOf("heroes")>=0){var b=st.builders;caps+='<div class="cap o'+(b.free?" free":"")+'"><span class="ic">🔨</span>'+b.free+"/"+b.cap+"</div>"}
 if(ready)caps+='<div class="cap o free">'+(D.hut?'<img class="ic" src="'+D.hut+'">':'<span class="ic">🛖</span>')+ready+" Ready</div>";
 ["lab","pets","bb","starlab"].forEach(function(k){if(a.secs.indexOf(k)<0)return;var g=st[k];
  caps+='<div class="cap o'+(g.free?" free":"")+'"><span class="ic">'+D.sections[k].emoji+"</span>"+(g.free?(k==="bb"?g.free+"/"+g.cap:"Free"):fmt(g.next-now).split(" ").slice(0,2).join(" "))+"</div>"});
 $("#bar").innerHTML=caps;
 Array.prototype.forEach.call(document.querySelectorAll("[data-st]"),function(el){var k=el.dataset.st,g=st[k==="heroes"?"builders":k],t,free;
  if(k==="heroes"){var n=a.rows.filter(function(r){return r.section==="heroes"&&r.end>now}).length;t=n?n+" upgrading":"All ready";free=!n}
  else if(k==="builders"||k==="bb"){t=g.free+"/"+g.cap+" free";free=g.free>0}else{free=g.free>0;t=free?"Free":"Busy"}
  el.textContent=t;el.classList.toggle("free",free)});
 var nextB=Math.min.apply(null,a.rows.filter(function(r){return(r.section==="builders"||r.section==="heroes")&&r.end>now}).map(function(r){return r.end}).concat([Infinity]));
 var newly=0;
 Array.prototype.forEach.call(document.querySelectorAll(".row"),function(c){var end=+c.dataset.end,total=+c.dataset.total,left=end-now,rd=left<=0;
  var p=rd?1:(total?1-left/total:0),f=c.querySelector(".fill");
  if(first){f.style.width="0";requestAnimationFrame(function(){requestAnimationFrame(function(){f.style.width=Math.max(6,p*100)+"%"})})}else f.style.width=Math.max(6,p*100)+"%";
  c.querySelector(".tt").textContent=fmt(left);
  c.querySelector(".tbar").style.display=rd?"none":"block";c.querySelector(".ready").style.display=rd?"flex":"none";
  c.classList.toggle("next",!rd&&end===nextB&&st.builders.free===0);
  if(rd&&!readySeen.has(c)){readySeen.add(c);if(!first)newly++}});
 if(first&&readySeen.size)setTimeout(function(){confetti(60)},500);if(newly)confetti(80)}
render();setInterval(function(){tick(false)},1000);
</script></body></html>`

// ---------- in-app menu ----------
async function pick(title, msg, options) {
  const a = new Alert(); a.title = title; if (msg) a.message = msg
  options.forEach(o => a.addAction(o)); a.addCancelAction("Back")
  return await a.presentSheet()
}

async function accountsMenu(s) {
  while (true) {
    if (!s.order.length) { await pick("Accounts", "No accounts yet. Copy a village export in Clash and tap Import.", []); return }
    const k = await pick("👥 Accounts",
      "Each village export is saved to its own account automatically (by player tag).",
      s.order.map(key => `${key === s.current ? "⭐️ " : ""}${accLabel(s, key)}${s.accounts[key].tag ? "  (" + s.accounts[key].tag + ")" : ""}`))
    if (k < 0) return
    const key = s.order[k], acc = s.accounts[key]
    const st = loadState(s, key)
    const a = await pick(acc.name,
      st ? `Data from ${ago(st.base)} · Builders: ${acc.builders || "Auto (" + st.auto.builders + ")"} · BB: ${acc.bbBuilders || "Auto (" + st.auto.bb + ")"}` : "",
      ["✏️ Rename", "⭐️ Use as default", "🔨 Builder count", "⬆️ Move up", "🗑 Delete account"])
    if (a === 0) {
      const r = new Alert(); r.title = "Rename account"; r.addTextField("Name", acc.name)
      r.addAction("Save"); r.addCancelAction("Cancel")
      if (await r.present() === 0 && r.textFieldValue(0).trim()) acc.name = r.textFieldValue(0).trim()
    } else if (a === 1) {
      s.current = key
    } else if (a === 2) {
      const b = new Alert(); b.title = "Builder count"
      b.message = `Leave empty for auto.${st ? `\nAuto-detected: ${st.auto.builders} home, ${st.auto.bb} Builder Base.` : ""}`
      b.addTextField("Home Village builders", acc.builders ? String(acc.builders) : "").setNumberPadKeyboard()
      b.addTextField("Builder Base builders", acc.bbBuilders ? String(acc.bbBuilders) : "").setNumberPadKeyboard()
      b.addAction("Save"); b.addCancelAction("Cancel")
      if (await b.present() === 0) {
        acc.builders = parseInt(b.textFieldValue(0)) || 0
        acc.bbBuilders = parseInt(b.textFieldValue(1)) || 0
      }
    } else if (a === 3 && k > 0) {
      s.order.splice(k, 1); s.order.splice(k - 1, 0, key)
    } else if (a === 4) {
      const c = new Alert(); c.title = `Delete ${acc.name}?`; c.message = "Removes its saved data and notifications."
      c.addDestructiveAction("Delete"); c.addCancelAction("Cancel")
      if (await c.present() === 0) {
        try { if (acc.notifIds && acc.notifIds.length) await Notification.removePending(acc.notifIds) } catch (e) {}
        try { fm.remove(accPath(key)) } catch (e) {}
        delete s.accounts[key]; s.order = s.order.filter(x => x !== key)
        if (s.current === key) s.current = s.order[0] || ""
      }
    }
    clearCache(); saveSettings(s)
  }
}

async function menu(s, imported) {
  let note = ""
  if (imported && imported.ok) note = `✅ ${imported.isNew ? "New account added" : "Updated"}: ${accLabel(s, imported.key)}\n`
  while (true) {
    clearCache()
    const st = loadState(s, s.current)
    const now = Date.now()
    const a = new Alert()
    a.title = `Clash Log v${VERSION} by ${AUTHOR}`
    a.message = note + (st
      ? `${s.order.length > 1 ? "⭐️ " + accLabel(s, s.current) + " · " : ""}Data from ${ago(st.base)} · ${st.rows.filter(r => r.end > now).length} active`
      : "No village data yet.\nIn Clash: Settings → More Settings → Data Export → Copy, then tap Import.")
    note = ""
    const acts = [
      ["✨ Open dashboard", "dash"],
      ["📋 Import from clipboard", "import"],
      [`👥 Accounts (${s.order.length})`, "accounts"],
      ["👀 Preview widget", "preview"],
      ["🧩 Choose what to show", "sections"],
      ["🔒 Lock Screen widgets…", "lock"],
      [`🎨 Style: ${s.theme === "wood" ? "Clash wood" : "Modern dark"}`, "theme"],
      [`🔔 Notifications: ${s.notify ? "On" : "Off"}…`, "notify"],
      [`⏰ Old-data warning after: ${s.staleHours}h`, "stale"],
      ["🗑 Clear icon cache", "clear"],
    ]
    if (COFFEE_URL) acts.push(["☕ Support me on Ko-fi", "coffee"])
    acts.forEach(x => a.addAction(x[0]))
    a.addCancelAction("Done")
    const i = await a.presentSheet()
    if (i < 0) return
    const act = acts[i][1]

    if (act === "dash") {
      await dashboard(s, s.current)
    } else if (act === "import") {
      const r = await importClipboard(s, false)
      note = r.ok ? `✅ ${r.isNew ? "New account added" : "Updated"}: ${accLabel(s, r.key)}\n` : "❌ Clipboard doesn't contain a village export.\n"
    } else if (act === "accounts") {
      await accountsMenu(s)
    } else if (act === "preview") {
      const opts = ["Small", "Medium", "Large"]
      if (s.order.length > 1) opts.push("Medium · all accounts", "Large · all accounts")
      const k = await pick("Preview", "", opts)
      if (k >= 0) {
        const fam = ["small", "medium", "large", "medium", "large"][k]
        const w = await buildWidget(fam, s, k >= 3 ? "accounts" : "")
        if (fam === "small") await w.presentSmall(); else if (fam === "medium") await w.presentMedium(); else await w.presentLarge()
      }
    } else if (act === "sections") {
      while (true) {
        const k = await pick("Show on widget",
          "Tap to turn on/off. Things you haven't unlocked are hidden automatically.",
          ORDER.map(key => {
            const locked = st && !st.present[key]
            return `${s.sections[key] ? "✅" : "⬜️"}  ${SECTIONS[key].emoji} ${SECTIONS[key].label}${locked ? "  (not unlocked)" : ""}`
          }))
        if (k < 0) break
        s.sections[ORDER[k]] = !s.sections[ORDER[k]]
      }
      await rescheduleAll(s)
    } else if (act === "theme") {
      s.theme = s.theme === "wood" ? "modern" : "wood"; applyTheme(s.theme); saveSettings(s)
      note = `🎨 Style: ${s.theme === "wood" ? "Clash wood" : "Modern dark"}\n`
    } else if (act === "coffee") {
      Safari.open(COFFEE_URL)
    } else if (act === "lock") {
      await lockMenu(s)
    } else if (act === "notify") {
      await notifMenu(s)
    } else if (act === "stale") {
      const opts = [6, 12, 24, 48]
      const k = await pick("Warn when data is older than…", "", opts.map(h => `${h} hours`))
      if (k >= 0) { s.staleHours = opts[k]; saveSettings(s) }
    } else if (act === "clear") {
      for (const f of fm.listContents(ICON_DIR)) { try { fm.remove(fm.joinPath(ICON_DIR, f)) } catch (e) {} }
      for (const key of s.order) { const x = loadState(s, key); if (x) for (const r of x.rows) await getIcon(r.icon, true) }
      note = "🖼 Icons re-downloaded.\n"
    }
  }
}

// ---------- main ----------
async function main() {
  const s = loadSettings()
  const q = args.queryParameters || {}
  if (config.runsInWidget) {
    Script.setWidget(await buildWidget(config.widgetFamily, s, args.widgetParameter))
  } else if (config.runsInNotification) {
    await richNotification(s)
  } else if (config.runsInApp && q.snooze) {
    await snooze(q)
  } else if (config.runsInApp) {
    const r = await importClipboard(s, true)
    if (args.queryParameters && args.queryParameters.dash) await dashboard(s, s.current)
    await menu(s, r)
  } else {
    await importClipboard(s, true)
  }
}

// ---------- game data ----------
const ICON_COLORS = {
1000000:"e07633.e07431.e28022.e0663d.e0643c.e0543a.e07228.e04f2a.e05032.e0772a.e08731.e7a239.e0b841.e0a74a",
1000001:"fa9f32.f59d32.ee9b32.e7942a.e8952a.e79429.e08d25.e08e2f.e0cdce.e06c16.e5952d.008fe0.24b2e0.e9a940.e02b41.e07c29.e0aa32.3c8de0",
1000002:"e0ac45.e0ac42.e0ac3d.e0ac3e.e0ae3f.e0ae40.e0b043.e0af3f.e0b040.e0b238.e0b241.e0b143.e0a634.e0b14b.e0b249.e0b03c.e0b03b",
1000003:"c731e0.c72ee0.c834e0.c736e0.c82ee0.c82de0.c931e0.c930e0.c72de0.c72de0.c830e0.c830e0.c82fe0.c82fe0.c82ee0.c82fe0.ca34e0.d748ea.c930e0",
1000004:"e0b90c.e0bb0a.e0bb0a.e0ba0a.e0b70d.e0b70b.e0ba0a.e0b90b.e0b80b.e0b206.e0b307.e0b315.e0b618.e0b40e.e0b21e.e0b131.e0b02d",
1000005:"e0ac21.e0ab23.e0ac21.e0ac21.e0ac21.e0ad21.e0ad20.e0ac21.e0ac21.e0ae1e.e0ad1f.e0af1f.e0b021.e0af21.e0aa2a.e0ab2a.e4b73a.edcb40.e5b538",
1000006:"e0644d.e0654d.e0664c.e0644c.e0674c.e07450.e07350.e0834c.e08544.e08f4d.e0633b.e07142.e05d47.e05d45.e05c44.e06848.e05e2c.e0b738.e09841",
1000007:"e0945d.e0c8b9.dd57e0.e09f3b.e09e3b.e0a13e.e0a345.e47721.e7cf42.e5c64f.62b3e9.e0a41b.edbd4c.e09139.e0a934.3488e0",
1000008:"e09758.e09f5b.e0c5be.e0c4b6.e0c3ae.e0c8b5.e0ae48.e0af47.e0ae48.e0a945.e0ab45.e05c37.e07c3b.e0601b.e08c27.367de0.e0af49.e0a843.e0b746.e0a041.e0b656",
1000009:"e09a5b.e09a5a.e09b5b.e09857.e09857.e09754.e09754.e09861.e09356.e0a043.e0cfb1.e09535.e0852b.e08f2b.e0d5c0.cbdde0.e0b633.4cade0.50ade0.e9ae44.e0a94c",
1000010:"e0a64e.e0cec3.e0d0c7.e0d4b7.e0b049.e022c4.b16be0.e0dad8.dad7e0.e0d8c6.fa8507.e0a33c.1c78e0.9eb8e0.f1ae43.e0a441.edb631.f9de48.e0c9da",
1000011:"e0d1c9.e0c7cc.e028e0.e02ed9.e020e0.e039cb.b75be0.a777e0.b090e0.c9b3e0.e0b849.75ade8.72aae6.f0b043.7e61e0.e06f36.e0a42e",
1000012:"e0a15d.e06c49.e05d42.e0741d.e06a1d.e0701c.e0a02c.e0a92d.e1a92a.e5b526.e5b72a.e0c42a.e0a52d.e08d2c.e0911c.e09e33",
1000013:"e09e5a.e0a761.e0a863.e0a749.e0a943.e0a73f.e0a542.e09a3c.e0a540.e08520.e09522.e09725.e7971a.eda52c.e0a842.e07b30.e0b11d.2a79e0",
1000014:"e09656.e09555.e09555.e09752.e0d6d5.e0d1cb.e0b349.4493e0.3fb5e0.f0ac41.9b67e0.e06f35.e0a831.e09f39",
1000015:"e0a067.e0c8af.d8e0ca.f0be4c.eebb4d.e0823f.e0b438.e3ac32",
1000019:"e09e6a.e09e69.e09c6a.e09d6a.e0a25e.e0a558.e0a362.e0a157.e0a043.e0ae4e.e0ac49.e0c151.e0ad47.e0a342.e06e2b.e0bc1c.3d7ce0",
1000020:"e0a361.e0aa66.e0ac4a.e0ab46.e0ac4a.e0ac49.e0ad4a.e0ad4b.e2a234",
1000021:"e0b468.e0ab55.e0a54c.e0843f.e07e39.e0b248.e0b349.e0b54a.e0a845.e8b549.e07d36.e0b735.e8b748",
1000023:"e09e62.e09d61.e0ab50.e0aa51.e0aa50.e0ac48.e0af4c.e0b340.e0a63d.e0b244.e0af44",
1000024:"cebde0.e0c4d7.c3b9e0.e09843.c9c0e0.e9ad4c.e6b24d.e8b14d.e1a341.e3a341.e0a133.e0cd4e.e9b23d",
1000026:"e0514c.e04f4b.e04f4b.e04c49.e08d41.e06c15.e0863b.e0ae41.e08437.e09840.e0ad28.e0871b.e0ac2b",
1000027:"e38d08.e09b24.e0941f.e09e1b.e09a1b.e97c06.e57305.eb8600.e98301.e0731a.e3a703.e3aa36",
1000028:"e03b2b.e03629.e03629.e04e31.e07339.e07839.e0743b",
1000029:"e0514d.e04b4c.e04b4b.e09e47.e09849.e4a928.e0b433.e1ba39",
1000031:"e38742.e0b14c.e0bd4a.e0c04c.e0a943.e4ac44.e0a041",
1000032:"e0915a.e0915a.e0933b.e0532b.e09733.e0972f.e9cd46.eac93e.f3b645.7f61e0.e07b35.e4be3c.e09e3f",
1000033:"e0ad5d.e0ad60.e0a353.d2d8e0.e0d7e0.e0c1bf.e0a69d.b1ade0.e0cbe0.e0b8bb",
1000034:"e69339.ee9a3d.ef993b.ea963b.ea953a.ee9a3c.ea9539.ee9939.ee9936.ee9c2a",
1000035:"e0ac45.e0ab41.6d37e0.6c36e0.6f39e0.703ae0.6f3ae0.6f39e0.e0b040.e0b13b",
1000036:"7031e0.6e2ee0.7234e0.7236e0.6f2ee0.6f2ee0.7131e0.7130e0.6d2de0.6d2de0",
1000037:"e0b90c.e0bb0a.e0bb0a.e0ba0a.e0b70d.e0b70b.e0ba0a.e0b90b.e0b80b.e0b206",
1000038:"e0b720.e0b024.e0b720.e0b720.e0b720.e0b720.e0b720.e0b721.e0b720.e0b71e",
1000039:"e09d42.e09d3f.e09e40.e09f39.e09f37.e09f36.e09d32.e0a12b.e0a325.e0a32d",
1000040:"e05d57.e05d57.e05e55.e05e57.e05e58.e05d50.e05b5a.e05b5a.e05c5c.e05b5a.e08558.e06854",
1000041:"e0b8aa.e0bbae.e0bbba.5f72e0.5d70e0.e0b35b.e1a84f.e0a64e.e0ae57.e5b758",
1000042:"e07d35",
1000043:"e09e6a.e09e69.e09c6a.e09d6a.e0a25e.e0a558.e0a362.e0a157.e0a043.e0ae4e",
1000044:"e09758.e09f5b.e0c5be.e0c4b6.e0c3ae.e0c8b5.e0ae48.e0af47.e0ae48.e0a945",
1000045:"e0b4a0.e0b9b1.e0bcba.e0b0af.e0c3cf.e0c4d0.e0b15d.e0b057.e0c155.e0bd57",
1000046:"6886e0.6888e0.6583e0.e0a958.e0aa5c.e0ac5e.e0aa58.e0aa58.e09e47.e0aa57",
1000048:"e09f6d.e0a06b.e0a06b.e0a068.e0a067.e0a067.beb5e0.e0ae5b.e0ad58.e0ad59",
1000049:"e0673f",
1000050:"e05957.e05350.e05a59.e05a58.e08520.e07b23.e07d22.e0c13b.e0c13d.e0c237",
1000051:"e08422.e49b15.e49b15.e59f17.e5a416.e09924.e0a028.e0a24f.e0a632.e0a330",
1000052:"e0b048.e0b548.e0b348.e0b552.e0b54f.e0b94b.22a3e0.e0af31.e0ae2e.e0b13f",
1000053:"e04f24",
1000054:"5865e0.5965e0.5966e0.5865e0.5865e0.5865e0.e0875a.5b65e0.5b65e0.e4be59",
1000055:"e09e6b.e0c9d1.e0ad5d.cebbe0.e0b85f.e0b457.e0ba5c.e5bc62.e0b65a.e0b452",
1000056:"e0b53d.e0b43f.e0b240.e0b33e.e04c50.f0c942.e0b345.e3ba43.e0bb3d.e07546",
1000057:"e0a664.e09e5f.e09e5f.e0a669.e0ccc9.e0a567.e0c3b0.e0a66f.e0bca0.e0a26c",
1000058:"e05501.e05201.e05501.e06416.e0671a.e0681d.e06b20.e0671b.e06823.e0772a",
1000059:"e05439.ec4f26.ef4b23.ec4b23.ee4d23.ee4c22.ee4c22.ee4e26.ea4b25",
1000063:"ee6524.ee6524.ed6424.ed6424.ec6324.e76f2f.e7712f.e7712f.e3803a.e77b35",
1000064:"e0a55b",
1000065:"e0a05b.e0a05a.e0a15b.e0a059.e0a55b",
1000067:"16ade0.0cade0.eab646.e9b346.e06531.e0a832.e09850",
1000068:"41e0b4.41e0b4.41e0b4.e05027.a316e0.a516e0.a416e0.a915e0.e08b1b.e08320.e0822f.e6b52e",
1000070:"41e0d6.41e0d6.40e0d6.40e0d6.41e0d6.41e0d6.40e0d6.40e0d6.40e0d6.40e0d6",
1000071:"e06562.e05e5b.e05e5b.e05e5b.e05e5a.e05e61.e0605f.e0af4f.e0af4f.e0b14f.e0af4f.e0a746",
1000072:"7b4de0.7b4ce0.7c4de0.7b49e0",
1000077:"a094e0.e0b64e.e0b64c.e0b134.e0b448",
1000078:"eba43e.e08e2d.e08e2d.e9991c.e8991c.e9981b.e8981b.eb9a1a.eca22d.eca22c",
1000079:"e04744.e6b02e.e09733",
1000080:"e06f3f",
1000081:"e0a663.e0ac57.e0a457.e0a44a.2ac7e0",
1000082:"e07431.e07635.e06a35.e04d40.e0473f.e06f3f",
1000084:"e06c34.e07c35.e0691c.e0a938",
1000085:"e04e25.e06f2a.e7b32f.e0a132",
1000086:"e0a94e.e0a94c",
1000089:"e9a928.e4a52c.e09d33",
1000093:"e79213",
1000097:"e05e3b",
1000102:"3e86e8.1184e0",
4000000:"ecb23a",
4000001:"e0388a",
4000002:"b4e055",
4000003:"e7853e",
4000004:"e08a4f",
4000005:"e05e33",
4000006:"348fe0",
4000007:"e08b64",
4000008:"6d5ae0",
4000009:"b240e0",
4000010:"3597e0",
4000011:"e07c65",
4000012:"e05a24",
4000013:"e0cabb",
4000015:"606be0",
4000017:"e06303",
4000022:"534de0",
4000023:"89e050",
4000024:"5d8ee0",
4000031:"efb134",
4000032:"7060e0",
4000033:"99e04d",
4000034:"e27a39",
4000035:"e09445",
4000036:"4aa5e0",
4000037:"e0cec9",
4000038:"e0a74c",
4000041:"89e051",
4000042:"27c7e0",
4000051:"e04923",
4000052:"e0553a",
4000053:"6e69e0",
4000058:"51a0e0",
4000059:"3698e0",
4000062:"e15139",
4000065:"e08328",
4000070:"e06523",
4000075:"e02e26",
4000082:"e4c450",
4000087:"e05133",
4000091:"e05633",
4000092:"e05041",
4000095:"c0c9e0",
4000097:"c034e0",
4000106:"e97420",
4000109:"e7ce34",
4000110:"e07854",
4000123:"e07d43",
4000132:"e74150",
4000135:"e05a45",
4000150:"e07b1c",
4000177:"e0c6b7",
4000188:"e06b47",
12000000:"e0a903.e0a903.e0a836.e0a836.e0aa3a.e0aa3a.e0a63c.e0a63c.e0ac41.e0ac41.e0b043.e0b043.d4e0c1.d4e0c1",
12000001:"e08a4e.e08a4e.e09052.e09052.e09450.e09450.e0924a.e0924a.e09b4e.e09b4e.e0a250.e0a250.e0af55",
12000002:"e0a555.e0a555.e07c48.e07c48.e08846.e08846.e0924a.e0924a.e08140.e08140.e04941.e04941",
12000005:"e05130.e05130.e04b2b.e04b2b.e0502d.e0502d.e0502d.e0502d.e01e4d.e01e4d.e01e4d.e01e4d.e01a4a",
12000006:"e0945d.e0945d.e09b4b.e09b4b.e09a4c.e09a4c.e0a337.e0a337",
12000008:"e09553.e09553.e0984c.e0984c.e0a730",
12000010:"e08a4e.e09052.e09052.e09450.e09450",
12000011:"e0a068.e0a068.e09d63.e09d63.e09d63.e0a547.e0a645.e0a644.e0a946.e0ac4c",
12000013:"e08f60.e07d5f.e05c60.e0465b.e04654.e04654.e0bbd9.e0bdde.e0b9d3.e0c7d2",
12000014:"e0a85f.e0a35e.e0545c.e0435d.e04655.e04756.e0b4d0.e0b8d7.e0b7cc.e04243",
12000016:"e0966a.e0966a.e0966a",
12000020:"e47043.e9784a.e7784a.e28038",
26000000:"05baf8",
26000001:"e0b443",
26000002:"8a1ee0",
26000003:"89e018",
26000005:"42d3eb",
26000009:"e07600",
26000010:"e09950",
26000011:"e044a6",
26000016:"08d3e0",
26000017:"e01c18",
26000028:"e08b4d",
26000035:"5fe0ab",
26000053:"e0547c",
26000070:"bfe01c",
26000098:"e09939",
26000109:"5c76f9",
26000120:"6a9ce0",
26000123:"e0364a",
28000000:"e07949",
28000001:"8052e0",
28000002:"d53ae0",
28000003:"e08646",
28000004:"377de0",
28000005:"e08845",
28000006:"32b8e0",
28000007:"e04347",
73000000:"597fe0",
73000001:"e07622",
73000002:"5ec0e0",
73000003:"ebc548",
73000004:"f12d7d",
73000007:"f0ab2f",
73000008:"6087f4",
73000009:"04b7e0",
73000010:"3ab3e0",
73000011:"e02164",
73000016:"e04cc5",
73000017:"e0afd7",
107000000:"e0b043.e0b043.e0b043.e0b043.e0b043",
107000001:"4578e0.4578e0.4578e0.4578e0.4578e0",
107000008:"e0602b.e0602b.e0602b.e0602b.e0602b"
}

const MAP = {
1000000:["Army Camp","B","home/army-buildings/army-camp/normal/level-#.png","1.5.u.3c.a0.k0.280.3c0.3w0.4g0.5k0.6o0.8c0.go0"],
1000001:["Town Hall","B","home/town-hall/normal/level-#.png","0.0.u.50.a0.k0.u0.140.280.3c0.5k0.6o0.7s0.8c0.8w0.a00.b40.dc0"],
1000002:["Elixir Collector","B","home/resource-buildings/elixir-collector/normal/level-#.png","fu.o6.vo.2.5.f.u.1o.2i.3c.50.6o.8c.a0.go.140.280"],
1000003:["Elixir Storage","B","home/resource-buildings/elixir-storage/normal/level-#.png","0.2.5.f.u.1o.3c.50.6o.8c.a0.k0.u0.140.280.3c0.4g0.5k0.dw0"],
1000004:["Gold Mine","B","home/resource-buildings/gold-mine/normal/level-#.png","fu.o6.vo.2.5.f.u.1o.2i.3c.50.6o.8c.a0.go.140.280"],
1000005:["Gold Storage","B","home/resource-buildings/gold-storage/normal/level-#.png","0.2.5.f.u.1o.3c.50.6o.8c.a0.k0.u0.140.280.3c0.4g0.5k0.dw0"],
1000006:["Barracks","B","home/army-buildings/barracks/normal/level-#.png","0.0.2.u.3c.6o.a0.k0.140.1o0.280.4g0.5k0.6o0.7s0.8c0.8w0.a00.bo0"],
1000007:["Laboratory","B","home/army-buildings/laboratory/normal/level-#.png","1.u.3c.6o.dc.qo.140.1y0.320.4g0.6o0.7s0.8w0.a00.b40.hs0"],
1000008:["Cannon","B","home/defenses/cannon/normal/level-#.png","0.0.2.k.u.1o.3c.50.5u.6o.7i.8c.a0.dc.go.ic.k0.qo.xc.140.1o0"],
1000009:["Archer Tower","B","home/defenses/archer-tower/normal/level-#.png","0.2.k.1o.2i.3c.50.6o.8c.a0.bo.dc.go.ic.k0.qo.xc.140.1e0.1o0.280"],
1000010:["Wall","B","home/defenses/wall/normal/level-#.png","0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0"],
1000011:["Wizard Tower","B","home/defenses/wizard-tower/normal/level-#.png","1o.2i.6o.dc.go.k0.u0.xc.140.1e0.1o0.1y0.280.3c0.4g0.500.640"],
1000012:["Air Defense","B","home/defenses/air-defense/normal/level-#.png","17c.1wc.a0.k0.u0.140.280.2s0.3c0.4g0.500.5k0.6o0.780.7s0.eq0"],
1000013:["Mortar","B","home/defenses/mortar/normal/level-#.png","4g0.6o0.3c.50.a0.dc.k0.u0.xc.140.1e0.1o0.280.2s0.3c0.4g0.5k0.dw0"],
1000014:["Clan Castle","B","home/resource-buildings/clan-castle/normal/level-#.png","0.3c.k0.140.1o0.280.3c0.4g0.6o0.7s0.8w0.a00.b40.fk0"],
1000015:["Builder's Hut","B","home/defenses/builders-hut/normal/level-#.png","1rc.2oo.3c0.4g0.5k0.640.7s0.eg0"],
1000019:["Hidden Tesla","B","home/defenses/hidden-tesla/normal/level-#.png","1zo.2vc.6o.a0.k0.140.1e0.1o0.1y0.280.2s0.3c0.3w0.4g0.5k0.7s0.eg0"],
1000020:["Spell Factory","B","home/army-buildings/spell-factory/normal/level-#.png","a0.k0.140.280.3c0.5k0.7s0.8w0.a00"],
1000021:["X-Bow","B","home/defenses/x-bow/normal/level-#.png","2gc.3c0.280.2s0.3c0.3w0.4g0.500.5k0.640.6o0.8w0.f00"],
1000023:["Dark Elixir Drill","B","home/resource-buildings/dark-elixir-drill/normal/level-#.png","o6.vo.140.u0.140.1o0.1y0.280.2s0.3c0.6o0"],
1000024:["Dark Elixir Storage","B","home/resource-buildings/dark-elixir-storage/normal/level-#.png","dc.qo.140.1o0.1uo.280.3c0.3w0.4g0.500.5k0.7s0.eg0"],
1000026:["Dark Barracks","B","home/army-buildings/dark-barracks/normal/level-#.png","dc.140.1o0.280.2s0.3c0.5k0.6o0.7s0.8c0.8w0.a00.b40"],
1000027:["Inferno Tower","B","home/defenses/inferno-tower/normal/level-#.png","5k0.7s0.280.2s0.3c0.4g0.5k0.6o0.780.7s0.8w0.f00"],
1000028:["Air Sweeper","B","home/defenses/air-sweeper/normal/level-#.png","6o.a0.dc.k0.140.280.3c0"],
1000029:["Dark Spell Factory","B","home/army-buildings/dark-spell-factory/normal/level-#.png","a0.k0.280.3c0.5k0.6o0.7s0.b40"],
1000031:["Eagle Artillery","B","home/defenses/eagle-artillery/normal/level-#.png","4g0.5k0.7s0.8c0.8w0.a00.ak0"],
1000032:["Bomb Tower","B","home/defenses/bomb-tower/normal/level-#.png","2s0.4g0.140.1o0.1y0.280.3c0.3w0.4g0.500.5k0.7s0.eg0"],
1000033:["Wall","b","builder/walls/wall/normal/level-#.png","0.0.0.0.0.0.0.0.0.0"],
1000034:["Builder Hall","b","builder/builder-hall/normal/level-#.png","0.0.1o.140.280.3c0.4g0.5k0.6o0.7s0"],
1000035:["Elixir Collector","b","builder/resource-buildings/elixir-collector/normal/level-#.png","a.k.14.3c.a0.140.1o0.280.2s0.3c0"],
1000036:["Elixir Storage","b","builder/resource-buildings/elixir-storage/normal/level-#.png","u.1o.50.a0.k0.140.280.3c0.4g0.5k0"],
1000037:["Gold Mine","b","builder/resource-buildings/gold-mine/normal/level-#.png","a.k.14.3c.a0.140.1o0.280.2s0.3c0"],
1000038:["Gold Storage","b","builder/resource-buildings/gold-storage/normal/level-#.png","u.1o.50.a0.k0.140.280.3c0.4g0.5k0"],
1000039:["Clock Tower","b","builder/other/clock-tower/normal/level-#.png","3c.50.6o.a0.k0.140.280.3c0.4g0.5k0"],
1000040:["Builder Barracks","b","builder/army-buildings/builder-barracks/normal/level-#.png","0.1.a.u.50.a0.f0.140.280.3c0.4g0.5k0"],
1000041:["Double Cannon","b","builder/defenses/double-cannon/normal/level-#.png","a.1o.50.k0.140.280.4g0.6o0.8w0.b40"],
1000042:["Army Camp","b","builder/army-buildings/army-camp/normal/level-#.png","0"],
1000043:["Hidden Tesla","b","builder/defenses/hidden-tesla/normal/level-#.png","u.50.8c.go.140.280.4g0.6o0.8w0.b40"],
1000044:["Cannon","b","builder/defenses/cannon/normal/level-#.png","1.5.3c.dc.140.280.4g0.6o0.8w0.a00"],
1000045:["Multi Mortar","b","builder/defenses/multi-mortar/normal/level-#.png","dc.k0.140.280.3c0.5k0.7s0.a00.c80.dc0"],
1000046:["Star Laboratory","b","builder/army-buildings/star-laboratory/normal/level-#.png","0.a.u.dc.k0.280.4g0.6o0.8w0.b40"],
1000048:["Archer Tower","b","builder/defenses/archer-tower/normal/level-#.png","5.f.3c.dc.140.280.4g0.6o0.8w0.a00"],
1000049:["Reinforcement Camp","b","builder/army-buildings/reinforcement-camp/normal/level-#.png","0"],
1000050:["Firecrackers","b","builder/defenses/firecrackers/normal/level-#.png","f.3c.6o.k0.140.280.4g0.6o0.8w0.a00"],
1000051:["Guard Post","b","builder/defenses/guard-post/normal/level-#.png","6o.dc.k0.140.280.4g0.6o0.8w0.b40.dc0"],
1000052:["Mega Tesla","b","builder/defenses/mega-tesla/normal/level-#.png","280.3c0.4g0.5k0.6o0.7s0.8w0.b40.c80.dc0"],
1000053:["Battle Machine Altar","b","builder/army-buildings/battle-machine-altar/normal/level-#.png","k0"],
1000054:["Air Bombs","b","builder/defenses/air-bombs/normal/level-#.png","a0.k0.140.280.3c0.5k0.7s0.8w0.b40.dc0"],
1000055:["Crusher","b","builder/defenses/crusher/normal/level-#.png","3c.8c.k0.140.280.4g0.6o0.8w0.b40.dc0"],
1000056:["Roaster","b","builder/defenses/roaster/normal/level-#.png","140.280.3c0.4g0.5k0.6o0.8w0.b40.c80.dc0"],
1000057:["Giant Cannon","b","builder/defenses/giant-cannon/normal/level-#.png","140.280.3c0.4g0.5k0.6o0.8w0.b40.c80.dc0"],
1000058:["Gem Mine","b","builder/resource-buildings/gem-mine/normal/level-#.png","1o.3c.a0.dc.k0.140.280.4g0.6o0.8w0"],
1000059:["Workshop","B","home/army-buildings/workshop/normal/level-#.png","280.3c0.3w0.4g0.5k0.640.6o0.7s0.f00"],
1000063:["Lava Launcher","b","builder/defenses/lava-launcher/normal/level-#.png","280.3c0.4g0.5k0.6o0.7s0.8w0.b40.c80.dc0"],
1000064:["B.O.B's Hut","B","home/other/bobs-hut/normal/level-#.png","0"],
1000065:["B.O.B Control","b","builder/resource-buildings/bob-control/normal/level-#.png","0.0.0.0.0"],
1000067:["Scattershot","B","home/defenses/scattershot/normal/level-#.png","5k0.7s0.8c0.8w0.9g0.a00.go0"],
1000068:["Pet House","B","home/army-buildings/pet-house/normal/level-#.png","140.280.3c0.3w0.4g0.500.5k0.640.6o0.7s0.8w0.f00"],
1000070:["Blacksmith","B","home/army-buildings/blacksmith/normal/level-#.png","k0.140.280.3c0.4g0.500.5k0.6o0.7s0.b40"],
1000071:["Hero Hall","B","home/army-buildings/hero-hall/normal/level-#.png","140.280.3c0.4g0.500.5k0.6o0.780.7s0.8w0.a00.f00"],
1000072:["Spell Tower","B","home/defenses/spell-tower/normal/level-#.png","7s0.8w0.9g0.b40"],
1000077:["Monolith","B","home/defenses/monolith/normal/level-#.png","5k0.7s0.a00.c80.go0"],
1000078:["O.T.T.O's Outpost","b","builder/defenses/ottos-outpost/normal/level-#.png","0.140.280.3c0.4g0.5k0.7s0.a00.b40.c80"],
1000079:["Multi-Gear Tower","B","home/defenses/multi-gear-tower/normal/level-#.png","2oo.33o.fk0"],
1000080:["Battle Copter Altar","b","builder/army-buildings/battle-copter-altar/normal/level-#.png","0"],
1000081:["X-Bow","b","builder/defenses/x-bow/normal/level-#.png","7s0.8w0.b40.c80.dc0"],
1000082:["Healing Hut","b","builder/army-buildings/healing-hut/normal/level-#.png","1e0.280.3c0.4g0.5k0.6o0"],
1000084:["Multi-Archer Tower","B","home/defenses/multi-archer-tower/normal/level-#.png","2oo.33o.a00.fk0"],
1000085:["Ricochet Cannon","B","home/defenses/ricochet-cannon/normal/level-#.png","2oo.33o.a00.f00"],
1000086:["Revenge Tower","B","home/defenses/revenge-tower/normal/level-#.png","7s0.8w0"],
1000089:["Firespitter","B","home/defenses/firespitter/normal/level-#.png","780.8c0.go0"],
1000093:["Helper Hut","B","home/other/helper-hut/normal/level-#.png","0"],
1000097:["Crafting Station","B","home/defenses/crafting-station/normal/level-#.png","0"],
1000102:["Super Wizard Tower","B","home/defenses/super-wizard-tower/normal/level-#.png","6o0.7s0"],
4000000:["Barbarian","L","home/troops/barbarian/icon.png","0.u.1o.3c.6o.dc.k0.140.1o0.280.3c0.4g0.dw0"],
4000001:["Archer","L","home/troops/archer/icon.png","0.1o.3c.50.dc.k0.140.1o0.280.3c0.4g0.500.a00.f00"],
4000002:["Goblin","L","home/troops/goblin/icon.png","0.3c.50.a0.k0.140.1o0.2i0.5k0.fk0"],
4000003:["Giant","L","home/troops/giant/icon.png","0.3c.6o.a0.k0.140.1o0.280.2i0.3c0.4g0.5k0.ak0.f00"],
4000004:["Wall Breaker","L","home/troops/wall-breaker/icon.png","0.50.6o.k0.qo.140.1o0.2s0.3c0.5k0.640.6o0.b40.fk0"],
4000005:["Balloon","L","home/troops/balloon/icon.png","0.6o.a0.u0.140.3c0.3m0.3w0.500.7s0.9g0.c80.ge0"],
4000006:["Wizard","L","home/troops/wizard/icon.png","0.6o.8c.k0.u0.1o0.280.2i0.2s0.3w0.640.7s0.bo0.fk0"],
4000007:["Healer","L","home/troops/healer/icon.png","0.k0.140.280.3c0.500.780.7s0.820.c80.go0"],
4000008:["Dragon","L","home/troops/dragon/icon.png","0.u0.1o0.280.3c0.4g0.500.5k0.7s0.8c0.9g0.b40.go0"],
4000009:["P.E.K.K.A","L","home/troops/pekka/icon.png","0.k0.u0.140.1o0.280.3c0.3w0.4g0.640.7s0.b40.g40"],
4000010:["Minion","L","home/troops/minion/icon.png","0.a0.dc.k0.140.1o0.1y0.280.3c0.4g0.500.5k0.a00.fk0"],
4000011:["Hog Rider","L","home/troops/hog-rider/icon.png","0.go.u0.140.280.2i0.2s0.3c0.3w0.4g0.5k0.640.780.b40.g40"],
4000012:["Valkyrie","L","home/troops/valkyrie/icon.png","0.dc.140.1o0.1y0.280.2i0.3c0.500.5k0.6o0.fk0"],
4000013:["Golem","L","home/troops/golem/icon.png","0.qo.1o0.280.2i0.2s0.320.3c0.3w0.4g0.5k0.640.6o0.b40.g40"],
4000015:["Witch","L","home/troops/witch/icon.png","0.280.3c0.3w0.4g0.640.820.h80"],
4000017:["Lava Hound","L","home/troops/lava-hound/icon.png","0.280.2s0.3c0.4g0.7s0.8w0.gy0"],
4000022:["Bowler","L","home/troops/bowler/icon.png","0.280.2s0.3c0.4g0.6o0.7s0.8c0.b40.go0"],
4000023:["Baby Dragon","L","home/troops/baby-dragon/icon.png","0.140.1o0.280.320.3c0.4g0.6o0.7s0.820.b40.gy0"],
4000024:["Miner","L","home/troops/miner/icon.png","0.140.280.2i0.2s0.3c0.4g0.6o0.780.7s0.ak0.g40"],
4000031:["Raged Barbarian","l","builder/troops/raged-barbarian/icon.png","0.0.5.f.8c.go.p0.xc.140.1o0.280.2s0.3w0.500.640.640.6o0.6o0.780.780"],
4000032:["Sneaky Archer","l","builder/troops/sneaky-archer/icon.png","0.3.a.u.a0.ic.qo.z0.140.1o0.280.2s0.3w0.500.640.640.6o0.6o0.780.780"],
4000033:["Beta Minion","l","builder/troops/beta-minion/icon.png","0.0.0.6o.dc.k0.u0.140.1o0.280.280.2s0.3w0.500.640.640.6o0.6o0.780.780"],
4000034:["Boxer Giant","l","builder/troops/boxer-giant/icon.png","0.0.0.8c.go.qo.xc.140.1o0.280.280.2s0.3w0.500.640.640.6o0.6o0.780.780"],
4000035:["Bomber","l","builder/troops/bomber/icon.png","0.0.0.0.0.qo.xc.140.1o0.280.280.2s0.3w0.500.640.640.6o0.6o0.780.780"],
4000036:["Power P.E.K.K.A","l","builder/troops/power-pekka/icon.png","0.0.0.0.0.0.0.0.0.0.0.0.0.500.640.640.6o0.6o0.780.780"],
4000037:["Cannon Cart","l","builder/troops/cannon-cart/icon.png","0.0.0.0.0.0.0.140.1o0.280.280.2s0.3w0.500.640.640.6o0.6o0.780.780"],
4000038:["Drop Ship","l","builder/troops/drop-ship/icon.png","0.0.0.0.0.0.0.0.0.0.0.2s0.3w0.500.640.640.6o0.6o0.780.780"],
4000041:["Baby Dragon","l","builder/troops/baby-dragon/icon.png","0.0.0.0.0.qo.xc.140.1o0.280.280.2s0.3w0.500.640.640.6o0.6o0.780.780"],
4000042:["Night Witch","l","builder/troops/night-witch/icon.png","0.0.0.0.0.0.0.0.0.280.280.2s0.3w0.500.640.640.6o0.6o0.780.780"],
4000051:["Wall Wrecker","L","home/siege-machines/wall-wrecker/icon.png","0.280.3c0.7s0.a00.f00"],
4000052:["Battle Blimp","L","home/siege-machines/battle-blimp/icon.png","0.280.3c0.7s0.a00.f00"],
4000053:["Yeti","L","home/troops/yeti/icon.png","0.3c0.500.7s0.8c0.960.b40.h80"],
4000058:["Ice Golem","L","home/troops/ice-golem/icon.png","0.280.2s0.3m0.4g0.780.8c0.8w0.brc"],
4000059:["Electro Dragon","L","home/troops/electro-dragon/icon.png","0.4g0.500.7s0.8w0.9g0.a00.b40.hs0"],
4000062:["Stone Slammer","L","home/siege-machines/stone-slammer/icon.png","0.280.3c0.7s0.a00.f00"],
4000065:["Dragon Rider","L","home/troops/dragon-rider/icon.png","0.6o0.8w0.a00.be0.h80"],
4000070:["Hog Glider","l","builder/troops/hog-glider/icon.png","0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.640.6o0.6o0.780.780"],
4000075:["Siege Barracks","L","home/siege-machines/siege-barracks/icon.png","0.3c0.4g0.7s0.dc0.go0"],
4000082:["Headhunter","L","home/troops/headhunter/icon.png","0.5k0.7s0.h80"],
4000087:["Log Launcher","L","home/siege-machines/log-launcher/icon.png","0.3c0.4g0.7s0.dc0.go0"],
4000091:["Flame Flinger","L","home/siege-machines/flame-flinger/icon.png","0.3c0.4g0.7s0.dc0"],
4000092:["Battle Drill","L","home/siege-machines/battle-drill/icon.png","0.4g0.5k0.8w0.a00.h80"],
4000095:["Electro Titan","L","home/troops/electro-titan/icon.png","0.8w0.a00.c80.hs0"],
4000097:["Apprentice Warden","L","home/troops/apprentice-warden/icon.png","0.6o0.8c0.8w0"],
4000106:["Electrofire Wizard","l","builder/troops/electrofire-wizard/icon.png","0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.6o0.780.780"],
4000109:["Ruin Witch","L","home/troops/ruin-witch/icon.png","0.c80.dc0.h80"],
4000110:["Root Rider","L","home/troops/root-rider/icon.png","0.8w0.b40.hs0"],
4000123:["Druid","L","home/troops/druid/icon.png","0.8w0.a00.c80.dc0.h80"],
4000132:["Thrower","L","home/troops/thrower/icon.png","0.ak0.bo0.go0"],
4000135:["Troop Launcher","L","home/siege-machines/troop-launcher/icon.png","0.6o0.a00.a00"],
4000150:["Furnace","L","home/troops/furnace/icon.png","0.a00.c80.go0"],
4000177:["Meteor Golem","L","home/troops/meteor-golem/icon.png","0.fk0.hs0"],
4000188:["Sky Wagon","L","home/siege-machines/sky-wagon/icon.png","0.b40.f00.hs0"],
12000000:["Bomb","B","home/traps/bomb/normal/level-#.png","0.1.5.14.1o.3c.50.6o.a0.k0.u0.140.280.8w0"],
12000001:["Spring Trap","B","home/traps/spring-trap/normal/level-#.png","0.1o.3c.50.6o.a0.dc.k0.u0.140.280.3c0.c80"],
12000002:["Giant Bomb","B","home/traps/giant-bomb/normal/level-#.png","0.1o.50.6o.go.ic.k0.140.280.2s0.4g0.bo0"],
12000005:["Air Bomb","B","home/traps/air-bomb/normal/level-#.png","0.u.1o.6o.dc.k0.nc.qo.140.1o0.280.3c0.a00"],
12000006:["Seeking Air Mine","B","home/traps/seeking-air-mine/normal/level-#.png","0.a0.140.1o0.280.3c0.5k0.cs0"],
12000008:["Skeleton Trap","B","home/traps/skeleton-trap/normal/level-#.png","0.8c.dc.k0.7s0"],
12000010:["Spring Trap","b","builder/traps/spring-trap/normal/level-#.png","0.1o.140.280.3c0"],
12000011:["Push Trap","b","builder/traps/push-trap/normal/level-#.png","0.5.k.3c.6o.k0.qo.140.1o0.280"],
12000013:["Mine","b","builder/traps/mine/normal/level-#.png","0.u.1o.3c.a0.k0.140.1o0.280.2s0"],
12000014:["Mega Mine","b","builder/traps/mega-mine/normal/level-#.png","0.1o.50.a0.k0.140.1o0.280.3c0.4g0"],
12000016:["Tornado Trap","B","home/traps/tornado-trap/normal/level-#.png","0.140.280"],
12000020:["Giga Bomb","B","home/traps/giga-bomb/normal/level-#.png","0.4g0.5k0.eg0"],
26000000:["Lightning Spell","L","home/spells/lightning-spell/icon.png","0.3c.6o.a0.140.1o0.3c0.3w0.5k0.6o0.7s0.b40.fk0"],
26000001:["Healing Spell","L","home/spells/healing-spell/icon.png","0.50.a0.k0.140.1o0.3c0.5k0.780.7s0.bo0.go0"],
26000002:["Rage Spell","L","home/spells/rage-spell/icon.png","0.a0.k0.140.280.4g0.fk0"],
26000003:["Jump Spell","L","home/spells/jump-spell/icon.png","0.140.280.4g0.5k0"],
26000005:["Freeze Spell","L","home/spells/freeze-spell/icon.png","0.140.1o0.280.2s0.3w0.5k0.h80"],
26000009:["Poison Spell","L","home/spells/poison-spell/icon.png","0.a0.u0.280.3c0.4g0.5k0.780.7s0.8w0.aqo.g40"],
26000010:["Earthquake Spell","L","home/spells/earthquake-spell/icon.png","0.k0.140.3c0.3w0.8w0.a00.f00"],
26000011:["Haste Spell","L","home/spells/haste-spell/icon.png","0.140.280.3c0.4g0.a00.dw0"],
26000016:["Clone Spell","L","home/spells/clone-spell/icon.png","0.140.280.2i0.2s0.4g0.5k0.7s0.f00"],
26000017:["Skeleton Spell","L","home/spells/skeleton-spell/icon.png","0.k0.140.280.2s0.3c0.4g0.6o0"],
26000028:["Bat Spell","L","home/spells/bat-spell/icon.png","0.u0.1o0.2i0.4g0.7s0.9g0.eg0"],
26000035:["Invisibility Spell","L","home/spells/invisibility-spell/icon.png","0.3c0.4g0.5k0"],
26000053:["Recall Spell","L","home/spells/recall-spell/icon.png","0.7s0.8c0.8w0.a00.c80.hs0"],
26000070:["Overgrowth Spell","L","home/spells/overgrowth-spell/icon.png","0.5k0.9g0.b40.hs0"],
26000098:["Revive Spell","L","home/spells/revive-spell/icon.png","0.7s0.8w0.cs0.hs0"],
26000109:["Ice Block Spell","L","home/spells/ice-block-spell/icon.png","0.b40.c80.dc0.fk0.hs0"],
26000120:["Totem Spell","L","home/spells/totem-spell/icon.png","0.dc0.fk0.hs0"],
26000123:["Angry Spell","L","home/spells/angry-spell/icon.png","0.adc.dc0.go0"],
28000000:["Barbarian King","H","home/heroes/barbarian-king/icon.png","0.3c.6o.dc.go.k0.nc.qo.u0.xc.10o.140.140.140.140.140.140.140.140.140.140.140.140.140.140.280.280.280.280.280.2i0.2i0.2i0.2i0.2i0.2s0.2s0.2s0.2s0.2s0.3c0.3c0.3c0.3c0.3c0.3c0.3c0.3c0.3c0.3c0.3c0.3c0.3c0.3c0.3c0.3c0.3c0.3c0.3c0.3c0.4g0.4g0.4g0.4g0.4g0.4g0.4g0.4g0.4g0.4g0.4g0.4g0.4g0.4g0.4g0.4g0.4g0.4g0.4g0.4g0.5k0.5k0.5k0.5k0.5k0.6o0.6o0.6o0.6o0.6o0.7s0.7s0.7s0.7s0.7s0.8w0.8w0.8w0.8w0.8w0.8w0.8w0.8w0.8w0.8w0.8w0.8w0.8w0.8w0.8w0"],
28000001:["Archer Queen","H","home/heroes/archer-queen/icon.png","0.3c.6o.dc.go.k0.nc.qo.u0.xc.10o.140.140.140.140.140.140.140.140.140.140.140.140.140.140.280.280.280.280.280.2i0.2i0.2i0.2i0.2i0.2s0.2s0.2s0.2s0.2s0.3c0.3c0.3c0.3c0.3c0.3c0.3c0.3c0.3c0.3c0.3c0.3c0.3c0.3c0.3c0.3c0.3c0.3c0.3c0.3c0.4g0.4g0.4g0.4g0.4g0.4g0.4g0.4g0.4g0.4g0.4g0.4g0.4g0.4g0.4g0.4g0.4g0.4g0.4g0.4g0.5k0.5k0.5k0.5k0.5k0.6o0.6o0.6o0.6o0.6o0.7s0.7s0.7s0.7s0.7s0.8w0.8w0.8w0.8w0.8w0.8w0.8w0.8w0.8w0.8w0.8w0.8w0.8w0.8w0.8w0"],
28000002:["Grand Warden","H","home/heroes/grand-warden/icon.png","0.3c.6o.dc.go.k0.nc.qo.u0.xc.140.140.140.140.140.140.140.140.140.140.140.140.140.140.140.1o0.1o0.1o0.1o0.1o0.280.280.280.280.280.280.280.280.280.280.3c0.3c0.3c0.3c0.3c0.3c0.3c0.3c0.3c0.3c0.4g0.4g0.4g0.4g0.4g0.4g0.4g0.4g0.4g0.4g0.6o0.6o0.6o0.6o0.6o0.7s0.7s0.7s0.7s0.8c0.8w0.8w0.8w0.8w0.8w0.8w0.8w0.8w0.8w0.8w0.8w0.8w0.8w0.8w0.8w0"],
28000003:["Battle Machine","h","builder/heroes/battle-machine/icon.png","k0.k0.k0.140.140.1o0.1o0.280.280.2s0.2s0.3c0.3c0.3w0.3w0.4g0.4g0.4g0.4g0.4g0.5k0.5k0.5k0.5k0.5k0.6o0.6o0.6o0.6o0.6o0.7s0.7s0.7s0.7s0.7s0"],
28000004:["Royal Champion","H","home/heroes/royal-champion/icon.png","0.6o.go.k0.xc.140.140.140.140.140.140.140.140.140.140.1o0.1o0.1o0.1o0.1o0.280.280.280.280.280.3c0.3c0.3c0.3c0.3c0.4g0.4g0.4g0.4g0.4g0.5k0.5k0.5k0.5k0.5k0.5k0.6o0.780.7s0.8c0.8w0.8w0.8w0.8w0.8w0.8w0.8w0.8w0.8w0.8w0"],
28000005:["Battle Copter","h","builder/heroes/battle-copter/icon.png","0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.5k0.5k0.5k0.5k0.5k0.5k0.5k0.5k0.5k0.5k0.6o0.6o0.6o0.6o0.6o0.7s0.7s0.7s0.7s0.7s0"],
28000006:["Minion Prince","H","home/heroes/minion-prince/icon.png","0.3c.6o.dc.go.k0.nc.qo.u0.xc.10o.140.140.140.140.140.140.140.140.140.140.140.140.140.140.1o0.1o0.1o0.1o0.1o0.280.280.280.280.280.280.280.280.280.280.2i0.2i0.2i0.2i0.2i0.3c0.3c0.3c0.3c0.3c0.4g0.4g0.4g0.4g0.4g0.4g0.4g0.4g0.4g0.4g0.5k0.5k0.5k0.5k0.5k0.6o0.6o0.6o0.6o0.6o0.7s0.7s0.7s0.7s0.7s0.8c0.8c0.8c0.8c0.8c0.8w0.8w0.8w0.8w0.8w0.8w0.8w0.8w0.8w0.8w0.8w0.8w0.8w0.8w0.8w0"],
28000007:["Dragon Duke","H","home/heroes/dragon-duke/icon.png","0.a0.k0.140.140.280.280.280.3c0.3c0.4g0.5k0.5k0.6o0.6o0.7s0.7s0.8w0.8w0.8w0.8w0.8w0.8w0.8w0.8w0"],
73000000:["L.A.S.S.I","P","home/pets/lassi/icon.png","0.140.1o0.280.2s0.3c0.3w0.4g0.500.5k0.640.6o0.780.7s0.8c0"],
73000001:["Mighty Yak","P","home/pets/mighty-yak/icon.png","0.140.1o0.280.2s0.3c0.3w0.4g0.500.5k0.640.6o0.780.7s0.8c0"],
73000002:["Electro Owl","P","home/pets/electro-owl/icon.png","0.1o0.280.3c0.4g0.500.5k0.640.6o0.780.7s0.8w0.8w0.8w0.8w0"],
73000003:["Unicorn","P","home/pets/unicorn/icon.png","0.1o0.280.3c0.4g0.500.5k0.640.6o0.780.7s0.8w0.8w0.8w0.8w0"],
73000004:["Phoenix","P","home/pets/phoenix/icon.png","0.1o0.280.3c0.4g0.500.5k0.640.6o0.780"],
73000007:["Poison Lizard","P","home/pets/poison-lizard/icon.png","0.140.1o0.280.2s0.3c0.3w0.4g0.500.5k0.6o0.7s0.8w0.8w0.8w0"],
73000008:["Diggy","P","home/pets/diggy/icon.png","0.1o0.280.3c0.4g0.500.5k0.640.6o0.780.7s0.8c0.8w0.8w0.8w0"],
73000009:["Frosty","P","home/pets/frosty/icon.png","0.1o0.280.3c0.4g0.500.5k0.640.6o0.780.7s0.8w0.8w0.8w0.8w0"],
73000010:["Spirit Fox","P","home/pets/spirit-fox/icon.png","0.3c0.4g0.5k0.640.6o0.780.7s0.8c0.8w0"],
73000011:["Angry Jelly","P","home/pets/angry-jelly/icon.png","0.3c0.4g0.5k0.6o0.7s0.8w0.8w0.8w0.8w0"],
73000016:["Sneezy","P","home/pets/sneezy/icon.png","0.8w0.8w0.8w0.8w0.8w0.8w0.8w0.8w0.8w0"],
73000017:["Greedy Raven","P","home/pets/greedy-raven/icon.png","0.8w0.8w0.8w0.8w0.8w0.8w0.8w0.8w0.8w0"],
103000008:["Roaster","B","",""],
103000009:["Air Bombs","B","",""],
103000010:["Lava Launcher","B","",""],
103000011:["Hot Candle","B","",""],
103000012:["Hero Hunter","B","",""],
103000013:["Cake-A-Pult","B","",""],
107000000:["Longshot","B","home/guardians/longshot/normal/level-#.png","0.7s0.a00.c80.eg0"],
107000001:["Smasher","B","home/guardians/smasher/normal/level-#.png","0.7s0.a00.c80.eg0"],
107000008:["Logger","B","home/guardians/logger/normal/level-#.png","0.7s0.a00.c80.eg0"]
}

await main()
Script.complete()
