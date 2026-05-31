/* ============================================================
   Leo's Speakers — shared catalog, cart engine, and renders
   ============================================================ */

/* ---------- Catalog ---------- */
const CATALOG = {
  mini: {
    id: "mini",
    name: "Leo Mini",
    eyebrow: "Portable Geometric Speaker",
    tag: "15cm of pocketable power.",
    base: 299,
    desc: "The smallest Leo, machined from a single faceted billet and wrapped in a copper-trimmed leather strap. Room-filling sound that clips to your bag and goes anywhere.",
    scale: 0.62,
    finishes: [
      { id: "obsidian", name: "Obsidian Black", body: "#1a1a1c", price: 0 },
      { id: "graphite", name: "Graphite", body: "#3a3b3f", price: 0 },
      { id: "copper", name: "Copper Edition", body: "#5a4636", price: 40 },
      { id: "silver", name: "Silver", body: "#b8b8bd", price: 0 },
    ],
    configs: [
      { id: "single", name: "Single", desc: "One Leo Mini", price: 0 },
      { id: "pair", name: "Stereo pair", desc: "Two, paired for true stereo", price: 269 },
    ],
    addons: [
      { id: "case", name: "Travel case", desc: "Hard shell, water-resistant", price: 49 },
      { id: "care", name: "Leo Care+", desc: "Extends warranty to 3 years", price: 59 },
    ],
    highlights: [
      ["Truly pocketable", "Under 12 oz with a machined copper strap loop. Clip it on and go."],
      ["20-hour battery", "All-day play with fast USB-C charging."],
      ["IP67 waterproof", "Rain, pool, sand — the Mini shrugs it all off."],
    ],
  },
  pro: {
    id: "pro",
    name: "Leo Pro",
    eyebrow: "Home Geometric System",
    tag: "35cm of room-filling presence.",
    base: 799,
    desc: "A faceted home system with a dedicated tweeter, mid, and woofer behind a copper-ringed geometric grille. Touch controls, multi-room sync, and a presence that anchors any room.",
    scale: 0.82,
    finishes: [
      { id: "obsidian", name: "Obsidian Black", body: "#1a1a1c", price: 0 },
      { id: "graphite", name: "Graphite", body: "#3a3b3f", price: 0 },
      { id: "copper", name: "Copper Edition", body: "#5a4636", price: 80 },
      { id: "silver", name: "Silver", body: "#b8b8bd", price: 0 },
    ],
    configs: [
      { id: "single", name: "Single", desc: "One Leo Pro", price: 0 },
      { id: "pair", name: "Stereo pair", desc: "Two, for true left/right stereo", price: 719 },
      { id: "trio", name: "Multi-room trio", desc: "Three, synced across rooms", price: 1399 },
    ],
    addons: [
      { id: "stand", name: "Floor stand", desc: "Machined aluminum, height-matched", price: 149 },
      { id: "case", name: "Travel case", desc: "Hard shell, tour-grade", price: 89 },
      { id: "care", name: "Leo Care+", desc: "Extends warranty to 3 years", price: 99 },
    ],
    highlights: [
      ["3-way sound", "Dedicated tweeter, midrange, and woofer fill the whole room."],
      ["Touch control", "A backlit copper control ring, right on top."],
      ["Multi-room", "Sync a Pro in every room from the Leo app."],
    ],
  },
  max: {
    id: "max",
    name: "Leo Max",
    eyebrow: "Professional Geometric Stereo",
    tag: "65cm. Concert in a box.",
    base: 1499,
    desc: "Our flagship: a five-driver professional stereo with a dual-woofer faceted cabinet, XLR + balanced inputs, and 115 dB of clean, floor-shaking output. Built for big rooms and bigger nights.",
    scale: 1.0,
    finishes: [
      { id: "obsidian", name: "Obsidian Black", body: "#1a1a1c", price: 0 },
      { id: "graphite", name: "Graphite", body: "#3a3b3f", price: 0 },
      { id: "copper", name: "Copper Edition", body: "#5a4636", price: 120 },
    ],
    configs: [
      { id: "single", name: "Single", desc: "One Leo Max", price: 0 },
      { id: "pair", name: "Stereo pair", desc: "Two, wall-to-wall stereo", price: 1399 },
      { id: "rig", name: "Stage rig", desc: "Four, synced for the venue", price: 4499 },
    ],
    addons: [
      { id: "rolling", name: "Rolling road case", desc: "Wheeled, tour-grade protection", price: 199 },
      { id: "stand", name: "Speaker stand", desc: "Adjustable tripod, per speaker", price: 129 },
      { id: "care", name: "Leo Care+", desc: "Extends warranty to 3 years", price: 179 },
    ],
    highlights: [
      ["115 dB, distortion-free", "Dual woofers and a dedicated sub stay clean at volume."],
      ["Pro connectivity", "Balanced XLR, TRS, USB-C, and optical in."],
      ["Tour-ready", "IP54 cabinet with a machined handle and road-case fit."],
    ],
  },
};

const MODEL_ORDER = ["mini", "pro", "max"];
const FREE_SHIP = true;
const TAX_RATE = 0.0875;
const money = (n) => "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

/* ---------- Faceted speaker render (SVG) ---------- */
/* drivers: number of woofer circles to draw (1 = mini, 2 = pro, 3 = max) */
function speakerSVG(bodyColor, drivers) {
  drivers = drivers || 1;
  const driverMarkup = (() => {
    if (drivers >= 3) {
      return `
        <circle class="drv" cx="100" cy="78" r="16" />
        <circle class="drv" cx="70" cy="120" r="26" />
        <circle class="drv" cx="130" cy="120" r="26" />
        <circle class="drv drv--sub" cx="100" cy="185" r="40" />`;
    }
    if (drivers === 2) {
      return `
        <circle class="drv" cx="100" cy="92" r="20" />
        <circle class="drv drv--sub" cx="100" cy="165" r="40" />`;
    }
    return `<circle class="drv drv--sub" cx="100" cy="135" r="42" />`;
  })();

  return `
  <svg viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Leo speaker">
    <defs>
      <radialGradient id="cone" cx="42%" cy="38%" r="70%">
        <stop offset="0%" stop-color="#4a4a4f"/><stop offset="55%" stop-color="#202023"/><stop offset="100%" stop-color="#050506"/>
      </radialGradient>
      <linearGradient id="copperEdge" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#d89b6a"/><stop offset="100%" stop-color="#8a521f"/>
      </linearGradient>
    </defs>
    <!-- faceted cabinet -->
    <polygon class="body" points="40,40 160,40 185,90 185,215 100,245 15,215 15,90"/>
    <polygon class="facet-l" points="15,90 100,72 100,245 15,215"/>
    <polygon class="facet-r" points="185,90 100,72 100,245 185,215"/>
    <polygon class="facet-t" points="40,40 160,40 185,90 100,72 15,90"/>
    <polygon class="edge" points="40,40 160,40 185,90 185,215 100,245 15,215 15,90"/>
    <line class="edge" x1="100" y1="72" x2="100" y2="245"/>
    <line class="edge" x1="15" y1="90" x2="100" y2="72"/>
    <line class="edge" x1="185" y1="90" x2="100" y2="72"/>
    <!-- copper accent ring near top -->
    <rect x="78" y="50" width="44" height="5" rx="2.5" fill="url(#copperEdge)"/>
    <!-- drivers -->
    <g>${driverMarkup}</g>
  </svg>`;
}

/* drivers per model */
const DRIVERS = { mini: 1, pro: 2, max: 3 };

/* Inject a render into an element; el may carry data-model + data-finish */
function renderInto(el, model, finishId) {
  const p = CATALOG[model];
  if (!p) return;
  const finish = p.finishes.find((f) => f.id === finishId) || p.finishes[0];
  el.classList.add("render");
  el.style.setProperty("--body", finish.body);
  el.innerHTML = speakerSVG(finish.body, DRIVERS[model]);
  // style driver cones via inline CSS once
  el.querySelectorAll(".drv").forEach((c) => {
    c.setAttribute("fill", "url(#cone)");
    c.setAttribute("stroke", "rgba(0,0,0,0.6)");
    c.setAttribute("stroke-width", "2");
  });
}

/* Auto-render any [data-render] element on load */
function hydrateRenders(root) {
  (root || document).querySelectorAll("[data-render]").forEach((el) => {
    renderInto(el, el.dataset.render, el.dataset.finish || null);
  });
}

/* ---------- Cart (localStorage) ---------- */
const CART_KEY = "leo_cart_v1";

function cartRead() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}
function cartWrite(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  updateBagCount();
}
function cartCount() {
  return cartRead().reduce((n, it) => n + it.qty, 0);
}
function cartAdd(item) {
  const items = cartRead();
  // merge identical configurations
  const key = (it) => [it.model, it.finish, it.config, (it.addons || []).slice().sort().join(","), it.engraving || ""].join("|");
  const existing = items.find((it) => key(it) === key(item));
  if (existing) existing.qty += item.qty;
  else items.push(item);
  cartWrite(items);
}
function cartUpdateQty(index, qty) {
  const items = cartRead();
  if (!items[index]) return;
  items[index].qty = Math.max(1, Math.min(10, qty));
  cartWrite(items);
}
function cartRemove(index) {
  const items = cartRead();
  items.splice(index, 1);
  cartWrite(items);
}
function cartClear() { cartWrite([]); }

/* unit price for a stored line item */
function lineUnitPrice(it) {
  const p = CATALOG[it.model];
  if (!p) return 0;
  const finish = p.finishes.find((f) => f.id === it.finish);
  const config = p.configs.find((c) => c.id === it.config);
  let price = p.base;
  if (finish) price += finish.price;
  if (config) price += config.price;
  (it.addons || []).forEach((aid) => {
    const a = p.addons.find((x) => x.id === aid);
    if (a) price += a.price;
  });
  if (it.engraving) price += 0; // engraving is free
  return price;
}
function cartSubtotal() {
  return cartRead().reduce((sum, it) => sum + lineUnitPrice(it) * it.qty, 0);
}

/* readable option summary for a line item */
function lineOptionText(it) {
  const p = CATALOG[it.model];
  const parts = [];
  const finish = p.finishes.find((f) => f.id === it.finish);
  const config = p.configs.find((c) => c.id === it.config);
  if (finish) parts.push(finish.name);
  if (config) parts.push(config.name);
  (it.addons || []).forEach((aid) => {
    const a = p.addons.find((x) => x.id === aid);
    if (a) parts.push(a.name);
  });
  if (it.engraving) parts.push('Engraving: "' + it.engraving + '"');
  return parts.join(" · ");
}

/* ---------- Bag count badge in nav ---------- */
function updateBagCount() {
  const badge = document.getElementById("bag-count");
  if (!badge) return;
  const n = cartCount();
  badge.textContent = n;
  badge.classList.toggle("show", n > 0);
}

/* ---------- Toast ---------- */
let _toastTimer;
function showToast(msg) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
}

/* ---------- init common ---------- */
document.addEventListener("DOMContentLoaded", () => {
  hydrateRenders();
  updateBagCount();
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
