/* ============================================================
   Bag page — renders cart lines + order summary
   Expects <main class="bag" data-page="cart">
   ============================================================ */
(function () {
  const root = document.querySelector('[data-page="cart"]');
  if (!root) return;

  function render() {
    const items = cartRead();
    const wrap = document.getElementById("bag-body");

    if (!items.length) {
      wrap.innerHTML = `
        <div class="bag__empty">
          <div class="render" data-render="pro"></div>
          <p>Your bag is empty.</p>
          <a href="index.html#lineup" class="btn btn--solid btn--lg">Shop speakers</a>
        </div>`;
      hydrateRenders(wrap);
      return;
    }

    const linesHTML = items.map((it, i) => {
      const p = CATALOG[it.model];
      const unit = lineUnitPrice(it);
      return `
        <div class="line">
          <div class="line__art"><div class="render" data-render="${it.model}" data-finish="${it.finish}"></div></div>
          <div>
            <div class="line__name">${p.name}</div>
            <div class="line__opts">${lineOptionText(it)}</div>
            <div class="line__controls">
              <div class="qty qty--sm" data-index="${i}">
                <button type="button" data-step="-1" aria-label="Decrease">−</button>
                <input type="number" value="${it.qty}" min="1" max="10" aria-label="Quantity" />
                <button type="button" data-step="1" aria-label="Increase">+</button>
              </div>
              <button class="line__remove" data-remove="${i}">Remove</button>
            </div>
          </div>
          <div class="line__price">${money(unit * it.qty)}</div>
        </div>`;
    }).join("");

    const subtotal = cartSubtotal();
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    wrap.innerHTML = `
      <div class="bag__grid">
        <div class="bag__lines">${linesHTML}</div>
        <aside class="summary">
          <h2>Summary</h2>
          <div class="summary__row"><span>Subtotal</span><strong>${money(subtotal)}</strong></div>
          <div class="summary__row"><span>Shipping</span><strong>${FREE_SHIP ? "Free" : money(0)}</strong></div>
          <div class="summary__row"><span>Estimated tax</span><strong>${money(tax)}</strong></div>
          <div class="summary__total"><span>Total</span><span>${money(total)}</span></div>
          <a href="checkout.html" class="btn btn--solid btn--block btn--lg">Check Out</a>
          <p class="summary__fine">Free engraving · 60-day returns · 2-year warranty</p>
        </aside>
      </div>`;

    hydrateRenders(wrap);

    // wire qty steppers + inputs
    wrap.querySelectorAll(".qty--sm").forEach((q) => {
      const index = Number(q.dataset.index);
      const input = q.querySelector("input");
      q.querySelectorAll("button").forEach((b) =>
        b.addEventListener("click", () => {
          cartUpdateQty(index, (Number(input.value) || 1) + Number(b.dataset.step));
          render();
        }));
      input.addEventListener("change", () => { cartUpdateQty(index, Number(input.value) || 1); render(); });
    });

    // wire remove
    wrap.querySelectorAll("[data-remove]").forEach((b) =>
      b.addEventListener("click", () => { cartRemove(Number(b.dataset.remove)); render(); }));
  }

  render();
})();
