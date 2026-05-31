/* ============================================================
   Leo's Speakers — Apple Store–style global nav + mega-menu
   ------------------------------------------------------------
   LINK LEGEND  (this is the "comment which links actually work"
   the request asked for):

     real: true   → the link genuinely navigates to that thing on
                    this site (a real page or an on-page section).
     real: false  → placeholder. There's nothing to point at yet,
                    so instead of dead-ending it shows a "Coming
                    soon" toast and stays put.

   Every link below is tagged, and each line also has a trailing
   comment naming exactly where a real link lands.
   ============================================================ */

const NAV_MENU = [
  {
    id: "store",
    label: "Store",
    groups: [
      {
        heading: "Shop",
        links: [
          { label: "Shop the lineup", href: "index.html#lineup",  real: true  }, // → home page, lineup section
          { label: "Your Bag",        href: "cart.html",          real: true  }, // → cart/bag page
          { label: "Order status",    href: "#",                  real: false }, // placeholder — no orders backend
          { label: "Financing",       href: "#",                  real: false }, // placeholder
        ],
      },
      {
        heading: "Speakers",
        links: [
          { label: "Leo Mini", href: "mini.html",          real: true }, // → Mini product page
          { label: "Leo Pro",  href: "pro.html",           real: true }, // → Pro product page
          { label: "Leo Max",  href: "max.html",           real: true }, // → Max product page
          { label: "Compare",  href: "index.html#compare", real: true }, // → home page, compare table
        ],
      },
    ],
  },
  {
    id: "mini",
    label: "Mini",
    thumb: "mini",
    groups: [
      {
        heading: "Explore Mini",
        links: [
          { label: "Leo Mini overview", href: "mini.html",          real: true  }, // → Mini product page
          { label: "Tech specs",        href: "index.html#compare", real: true  }, // → compare table
        ],
      },
      {
        heading: "Shop Mini",
        links: [
          { label: "Buy Leo Mini",  href: "mini.html", real: true  }, // → Mini product page (configurator)
          { label: "Travel case",   href: "mini.html", real: true  }, // → Mini page (add-on lives there)
          { label: "Leo Care+",     href: "mini.html", real: true  }, // → Mini page (add-on lives there)
          { label: "All accessories", href: "#",       real: false }, // placeholder — no accessories page
        ],
      },
    ],
  },
  {
    id: "pro",
    label: "Pro",
    thumb: "pro",
    groups: [
      {
        heading: "Explore Pro",
        links: [
          { label: "Leo Pro overview", href: "pro.html",           real: true }, // → Pro product page
          { label: "Tech specs",       href: "index.html#compare", real: true }, // → compare table
        ],
      },
      {
        heading: "Shop Pro",
        links: [
          { label: "Buy Leo Pro",     href: "pro.html", real: true  }, // → Pro product page (configurator)
          { label: "Floor stand",     href: "pro.html", real: true  }, // → Pro page (add-on lives there)
          { label: "Leo Care+",       href: "pro.html", real: true  }, // → Pro page (add-on lives there)
          { label: "All accessories", href: "#",        real: false }, // placeholder
        ],
      },
    ],
  },
  {
    id: "max",
    label: "Max",
    thumb: "max",
    groups: [
      {
        heading: "Explore Max",
        links: [
          { label: "Leo Max overview", href: "max.html",           real: true }, // → Max product page
          { label: "Tech specs",       href: "index.html#compare", real: true }, // → compare table
        ],
      },
      {
        heading: "Shop Max",
        links: [
          { label: "Buy Leo Max",      href: "max.html", real: true  }, // → Max product page (configurator)
          { label: "Rolling road case",href: "max.html", real: true  }, // → Max page (add-on lives there)
          { label: "Leo Care+",        href: "max.html", real: true  }, // → Max page (add-on lives there)
          { label: "All accessories",  href: "#",        real: false }, // placeholder
        ],
      },
    ],
  },
  {
    id: "accessories",
    label: "Accessories",
    groups: [
      {
        heading: "Shop by type",
        // NOTE: there is no standalone accessories page yet, so these are
        // placeholders. The closest real path is buying an add-on on a
        // product page — surfaced under each product's "Shop" menu above.
        links: [
          { label: "Cases & covers", href: "#", real: false }, // placeholder
          { label: "Stands",         href: "#", real: false }, // placeholder
          { label: "Cables",         href: "#", real: false }, // placeholder
          { label: "Leo Care+",      href: "#", real: false }, // placeholder
        ],
      },
    ],
  },
  {
    id: "support",
    label: "Support",
    groups: [
      {
        heading: "Get help",
        links: [
          { label: "Support home", href: "#", real: false }, // placeholder
          { label: "Warranty",     href: "#", real: false }, // placeholder
          { label: "Returns",      href: "#", real: false }, // placeholder
          { label: "Contact us",   href: "#", real: false }, // placeholder
        ],
      },
    ],
  },
];

(function buildNav() {
  const mount = document.getElementById("leo-nav");
  if (!mount) return;

  const bagIcon = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
      <path d="M6 7h12l-1 13H7L6 7z"/><path d="M9 7a3 3 0 0 1 6 0"/>
    </svg>`;

  // ---- desktop top-bar items ----
  const itemsHTML = NAV_MENU.map((m) =>
    `<button class="gnav__item" type="button" data-menu="${m.id}" aria-expanded="false" aria-controls="panel-${m.id}">${m.label}</button>`
  ).join("");

  // ---- a flyout panel for each menu ----
  const linkHTML = (lk) =>
    `<li><a class="gnav__link" href="${lk.href}" data-real="${lk.real}">${lk.label}</a></li>`;

  const colHTML = (g) =>
    `<div class="gnav__col">
       <p class="gnav__heading">${g.heading}</p>
       <ul class="gnav__list">${g.links.map(linkHTML).join("")}</ul>
     </div>`;

  const panelsHTML = NAV_MENU.map((m) => {
    const thumb = m.thumb
      ? `<div class="gnav__feature"><div class="render" data-render="${m.thumb}"></div></div>`
      : "";
    return `
      <div class="gnav__panel" id="panel-${m.id}" data-panel="${m.id}" hidden>
        <div class="container--wide container gnav__panelinner">
          ${thumb}
          <div class="gnav__cols">${m.groups.map(colHTML).join("")}</div>
        </div>
      </div>`;
  }).join("");

  // ---- mobile accordion sheet ----
  const sheetHTML = NAV_MENU.map((m) => `
    <div class="gnav__acc" data-acc="${m.id}">
      <button class="gnav__acc-btn" type="button" aria-expanded="false">${m.label}<span class="gnav__chevron">›</span></button>
      <div class="gnav__acc-body">
        ${m.groups.map((g) => `
          <p class="gnav__heading">${g.heading}</p>
          <ul class="gnav__list">${g.links.map(linkHTML).join("")}</ul>`).join("")}
      </div>
    </div>`).join("");

  mount.innerHTML = `
    <header class="gnav" id="gnav">
      <div class="container--wide container gnav__bar">
        <a href="index.html" class="brand"><span class="brand__mark"></span> <span class="brand__txt">Leo's Speakers</span></a>
        <nav class="gnav__items" aria-label="Primary">${itemsHTML}</nav>
        <div class="gnav__right">
          <a href="cart.html" class="nav__bag" aria-label="Bag">${bagIcon}<span class="bag-count" id="bag-count">0</span></a>
          <button class="gnav__burger" id="gnav-burger" type="button" aria-label="Menu" aria-expanded="false">
            <span></span><span></span>
          </button>
        </div>
      </div>
      <div class="gnav__drop" id="gnav-drop">${panelsHTML}</div>
      <div class="gnav__sheet" id="gnav-sheet">${sheetHTML}</div>
    </header>
    <div class="gnav__scrim" id="gnav-scrim"></div>`;

  // render the little speaker thumbnails in product panels
  if (typeof hydrateRenders === "function") hydrateRenders(mount);

  // ====================== behavior ======================
  const gnav   = document.getElementById("gnav");
  const drop   = document.getElementById("gnav-drop");
  const scrim  = document.getElementById("gnav-scrim");
  const items  = Array.from(mount.querySelectorAll(".gnav__item"));
  const panels = Array.from(mount.querySelectorAll(".gnav__panel"));
  let current = null;
  let closeTimer;

  function openMenu(id) {
    clearTimeout(closeTimer);
    const panel = panels.find((p) => p.dataset.panel === id);
    if (!panel) return;
    panels.forEach((p) => { p.hidden = p !== panel; });
    items.forEach((b) => b.setAttribute("aria-expanded", String(b.dataset.menu === id)));
    // animate the drawer to the active panel's height
    drop.style.height = panel.offsetHeight + "px";
    gnav.classList.add("is-open");
    scrim.classList.add("show");
    current = id;
  }

  function closeMenu() {
    drop.style.height = "0px";
    items.forEach((b) => b.setAttribute("aria-expanded", "false"));
    gnav.classList.remove("is-open");
    scrim.classList.remove("show");
    current = null;
  }

  // Desktop: hover to open (like Apple), with a small close delay so you
  // can move the cursor from the tab down into the panel.
  items.forEach((btn) => {
    btn.addEventListener("mouseenter", () => { if (window.innerWidth > 833) openMenu(btn.dataset.menu); });
    btn.addEventListener("focus", () => openMenu(btn.dataset.menu));
    btn.addEventListener("click", () => { current === btn.dataset.menu ? closeMenu() : openMenu(btn.dataset.menu); });
  });

  gnav.addEventListener("mouseleave", () => { closeTimer = setTimeout(closeMenu, 140); });
  gnav.addEventListener("mouseenter", () => clearTimeout(closeTimer));

  // keep the drawer height correct on resize
  window.addEventListener("resize", () => {
    if (current) {
      const panel = panels.find((p) => p.dataset.panel === current);
      if (panel) drop.style.height = panel.offsetHeight + "px";
    }
  });

  // Escape + scrim click close
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeMenu(); closeSheet(); } });
  scrim.addEventListener("click", () => { closeMenu(); closeSheet(); });

  // ---- link handling: real links navigate; placeholders toast ----
  mount.addEventListener("click", (e) => {
    const link = e.target.closest(".gnav__link");
    if (!link) return;
    if (link.dataset.real === "true") {
      closeMenu(); closeSheet();          // real → let it navigate
    } else {
      e.preventDefault();                 // placeholder → no destination yet
      if (typeof showToast === "function") showToast(link.textContent.trim() + " — coming soon");
      closeMenu(); closeSheet();
    }
  });

  // ====================== mobile sheet ======================
  const burger = document.getElementById("gnav-burger");
  const sheet  = document.getElementById("gnav-sheet");

  function openSheet() {
    gnav.classList.add("is-sheet");
    burger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeSheet() {
    gnav.classList.remove("is-sheet");
    burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  burger.addEventListener("click", () =>
    gnav.classList.contains("is-sheet") ? closeSheet() : openSheet());

  // accordion sections inside the mobile sheet
  sheet.querySelectorAll(".gnav__acc-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      btn.parentElement.classList.toggle("open", !open);
    });
  });

  if (typeof updateBagCount === "function") updateBagCount();
})();
