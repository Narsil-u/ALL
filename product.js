/* ============================================================
   Product (buy) page — builds configurator from CATALOG
   Expects <main class="pdp" data-model="mini|pro|max">
   ============================================================ */
(function () {
  const root = document.querySelector(".pdp[data-model]");
  if (!root) return;
  const model = root.dataset.model;
  const p = CATALOG[model];
  if (!p) return;

  document.title = p.name + " — Leo's Speakers";

  // selection state
  const state = {
    finish: p.finishes[0].id,
    config: p.configs[0].id,
    addons: new Set(),
    engraving: "",
    qty: 1,
  };

  // ---- build markup ----
  const finishesHTML = p.finishes.map((f) => `
    <button class="finish" data-finish="${f.id}" style="background:${f.body};"
            aria-pressed="${f.id === state.finish}" aria-label="${f.name}"
            title="${f.name}${f.price ? " (+" + money(f.price) + ")" : ""}"></button>`).join("");

  const configsHTML = p.configs.map((c) => `
    <button class="card2" data-config="${c.id}" aria-pressed="${c.id === state.config}">
      <span><span class="card2__name">${c.name}</span><span class="card2__desc">${c.desc}</span></span>
      <span class="card2__price">${c.price ? "+" + money(c.price) : "Included"}</span>
    </button>`).join("");

  const addonsHTML = p.addons.map((a) => `
    <button class="card2" data-addon="${a.id}" aria-pressed="false">
      <span><span class="card2__name">${a.name}</span><span class="card2__desc">${a.desc}</span></span>
      <span class="card2__price">+${money(a.price)}</span>
    </button>`).join("");

  const highlightsHTML = p.highlights.map(([h, d]) => `
    <div class="hl"><h3>${h}</h3><p>${d}</p></div>`).join("");

  root.innerHTML = `
    <div class="container">
      <p class="breadcrumb"><a href="index.html">Home</a> / <a href="index.html#lineup">Speakers</a> / ${p.name}</p>
      <div class="pdp__grid">
        <div class="stage" id="stage" style="background:#f5f5f7;">
          <div class="render" id="hero-render" data-render="${model}" data-finish="${state.finish}"></div>
        </div>

        <div class="buy">
          <p class="buy__eyebrow">${p.eyebrow}</p>
          <h1 class="buy__title">${p.name}</h1>
          <p class="buy__tag">${p.tag}</p>
          <p class="buy__from">From ${money(p.base)}</p>
          <p class="buy__desc">${p.desc}</p>

          <div class="opt">
            <div class="opt__head"><span class="opt__title">Finish</span><span class="opt__note" id="finish-name">${p.finishes[0].name}</span></div>
            <div class="finishes" id="finishes">${finishesHTML}</div>
          </div>

          <div class="opt">
            <div class="opt__head"><span class="opt__title">Configuration</span></div>
            <div class="cards" id="configs">${configsHTML}</div>
          </div>

          <div class="opt">
            <div class="opt__head"><span class="opt__title">Add-ons</span><span class="opt__note">Optional</span></div>
            <div class="cards" id="addons">${addonsHTML}</div>
          </div>

          <div class="opt engrave">
            <div class="opt__head"><span class="opt__title">Engraving</span><span class="opt__note">Free</span></div>
            <input id="engraving" type="text" maxlength="16" placeholder="Add initials or a short message" />
            <p class="engrave__hint">Up to 16 characters, laser-etched into the copper plate.</p>
          </div>

          <div class="opt">
            <div class="opt__head"><span class="opt__title">Quantity</span></div>
            <div class="qty" id="qty">
              <button type="button" data-step="-1" aria-label="Decrease">−</button>
              <input id="qty-input" type="number" value="1" min="1" max="10" aria-label="Quantity" />
              <button type="button" data-step="1" aria-label="Increase">+</button>
            </div>
          </div>

          <div class="purchase">
            <p class="purchase__sel" id="sel"></p>
            <div class="purchase__row">
              <span class="opt__title">Total</span>
              <span class="purchase__total" id="total">${money(p.base)}</span>
            </div>
            <button class="btn btn--solid btn--block btn--lg" id="add">Add to Bag</button>
            <p class="purchase__note">Free shipping · 60-day returns · 2-year warranty</p>
          </div>
        </div>
      </div>

      <section class="highlights">
        <div class="section__head"><h2 class="section__title">Why you'll love the ${p.name.replace("Leo ", "")}</h2></div>
        <div class="highlights__grid">${highlightsHTML}</div>
      </section>
    </div>`;

  // ---- references ----
  const stage = document.getElementById("stage");
  const heroRender = document.getElementById("hero-render");
  const finishName = document.getElementById("finish-name");
  const totalEl = document.getElementById("total");
  const selEl = document.getElementById("sel");
  const qtyInput = document.getElementById("qty-input");
  const engInput = document.getElementById("engraving");

  const stageBg = { obsidian: "#f5f5f7", graphite: "#ececed", copper: "#f3ece4", silver: "#eef0f2" };

  function recalc() {
    const finish = p.finishes.find((f) => f.id === state.finish);
    const config = p.configs.find((c) => c.id === state.config);

    // re-render speaker in chosen finish
    renderInto(heroRender, model, state.finish);
    finishName.textContent = finish.name + (finish.price ? " · +" + money(finish.price) : "");
    stage.style.background = stageBg[state.finish] || "#f5f5f7";

    let unit = p.base + finish.price + config.price;
    state.addons.forEach((aid) => {
      const a = p.addons.find((x) => x.id === aid);
      if (a) unit += a.price;
    });
    state.qty = Math.max(1, Math.min(10, Number(qtyInput.value) || 1));
    qtyInput.value = state.qty;

    totalEl.textContent = money(unit * state.qty);

    const parts = [finish.name];
    if (config.id !== "single") parts.push(config.name);
    state.addons.forEach((aid) => {
      const a = p.addons.find((x) => x.id === aid);
      if (a) parts.push(a.name);
    });
    if (state.engraving) parts.push('"' + state.engraving + '"');
    if (state.qty > 1) parts.push("Qty " + state.qty);
    selEl.textContent = parts.join(" · ");
  }

  // ---- wire interactions ----
  document.getElementById("finishes").addEventListener("click", (e) => {
    const btn = e.target.closest(".finish"); if (!btn) return;
    state.finish = btn.dataset.finish;
    document.querySelectorAll("#finishes .finish").forEach((b) => b.setAttribute("aria-pressed", b === btn));
    recalc();
  });

  document.getElementById("configs").addEventListener("click", (e) => {
    const btn = e.target.closest(".card2"); if (!btn) return;
    state.config = btn.dataset.config;
    document.querySelectorAll("#configs .card2").forEach((b) => b.setAttribute("aria-pressed", b === btn));
    recalc();
  });

  document.getElementById("addons").addEventListener("click", (e) => {
    const btn = e.target.closest(".card2"); if (!btn) return;
    const id = btn.dataset.addon;
    if (state.addons.has(id)) { state.addons.delete(id); btn.setAttribute("aria-pressed", "false"); }
    else { state.addons.add(id); btn.setAttribute("aria-pressed", "true"); }
    recalc();
  });

  document.querySelectorAll("#qty button").forEach((b) =>
    b.addEventListener("click", () => { qtyInput.value = (Number(qtyInput.value) || 1) + Number(b.dataset.step); recalc(); }));
  qtyInput.addEventListener("input", recalc);

  engInput.addEventListener("input", () => { state.engraving = engInput.value.trim(); recalc(); });

  document.getElementById("add").addEventListener("click", () => {
    recalc();
    cartAdd({
      model,
      finish: state.finish,
      config: state.config,
      addons: Array.from(state.addons),
      engraving: state.engraving,
      qty: state.qty,
    });
    showToast("Added " + p.name + " to your Bag");
  });

  // initial paint
  hydrateRenders(root);
  recalc();
})();
