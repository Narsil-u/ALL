/* ============================================================
   Checkout page — demo flow with a clearly marked Stripe hook.
   Expects <main class="checkout" data-page="checkout">
   ============================================================ */
(function () {
  const root = document.querySelector('[data-page="checkout"]');
  if (!root) return;

  const items = cartRead();

  // If the cart is empty, show confirmation if we just ordered, else bounce to bag.
  const justOrdered = sessionStorage.getItem("leo_last_order");

  if (!items.length && justOrdered) {
    renderConfirmation(JSON.parse(justOrdered));
    return;
  }
  if (!items.length) {
    root.innerHTML = `
      <div class="container">
        <div class="bag__empty">
          <div class="render" data-render="mini"></div>
          <p>Your bag is empty — nothing to check out.</p>
          <a href="index.html#lineup" class="btn btn--solid btn--lg">Shop speakers</a>
        </div>
      </div>`;
    hydrateRenders(root);
    return;
  }

  const subtotal = cartSubtotal();
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const orderLines = items.map((it) => {
    const p = CATALOG[it.model];
    return `<div class="osum__line">
        <span>${p.name} × ${it.qty}<small>${lineOptionText(it)}</small></span>
        <span>${money(lineUnitPrice(it) * it.qty)}</span>
      </div>`;
  }).join("");

  root.innerHTML = `
    <div class="container">
      <h1 class="checkout__title">Checkout</h1>
      <div class="demo-banner">
        🔒 <strong>Demo checkout.</strong> No real card is charged. This is where the
        Stripe payment session connects — see <code>STRIPE_INTEGRATION</code> in <code>checkout.js</code>.
      </div>
      <form class="checkout__grid" id="checkout-form" novalidate>
        <div>
          <div class="fieldset">
            <h2>Contact</h2>
            <div class="field"><label>Email</label><input type="email" name="email" required placeholder="you@example.com" /></div>
          </div>
          <div class="fieldset">
            <h2>Shipping address</h2>
            <div class="field--row">
              <div class="field"><label>First name</label><input name="first" required /></div>
              <div class="field"><label>Last name</label><input name="last" required /></div>
            </div>
            <div class="field"><label>Address</label><input name="address" required /></div>
            <div class="field--row">
              <div class="field"><label>City</label><input name="city" required /></div>
              <div class="field"><label>ZIP</label><input name="zip" required /></div>
            </div>
          </div>
          <div class="fieldset">
            <h2>Payment</h2>
            <div class="field"><label>Card number</label><input name="card" inputmode="numeric" placeholder="4242 4242 4242 4242" required /></div>
            <div class="field--row">
              <div class="field"><label>Expiry</label><input name="exp" placeholder="MM / YY" required /></div>
              <div class="field"><label>CVC</label><input name="cvc" inputmode="numeric" placeholder="123" required /></div>
            </div>
          </div>
        </div>

        <aside class="osum">
          <h2>Order summary</h2>
          ${orderLines}
          <div class="osum__line"><span>Subtotal</span><span>${money(subtotal)}</span></div>
          <div class="osum__line"><span>Shipping</span><span>${FREE_SHIP ? "Free" : money(0)}</span></div>
          <div class="osum__line"><span>Tax</span><span>${money(tax)}</span></div>
          <div class="summary__total" style="border:none;padding-top:0.8rem;"><span>Total</span><span>${money(total)}</span></div>
          <button type="submit" class="btn btn--solid btn--block btn--lg" id="pay">Pay ${money(total)}</button>
          <p class="summary__fine">By paying you agree to Leo's demo terms. No charge is made.</p>
        </aside>
      </form>
    </div>`;

  hydrateRenders(root);

  document.getElementById("checkout-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const order = {
      id: "LEO-" + Date.now().toString(36).toUpperCase().slice(-7),
      email: form.email.value,
      name: form.first.value + " " + form.last.value,
      total: total,
      items: items.length,
    };

    // ===========================================================
    // STRIPE_INTEGRATION
    // -----------------------------------------------------------
    // To take real payments, replace the demo block below with a
    // call to your backend that creates a Stripe Checkout Session:
    //
    //   const res = await fetch("/api/create-checkout-session", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ items: cartRead() }),
    //   });
    //   const { url } = await res.json();
    //   window.location = url;   // redirect to Stripe Checkout
    //
    // The serverless function uses your STRIPE_SECRET_KEY to build
    // line_items from CATALOG and returns session.url. On success
    // Stripe redirects back to checkout.html?status=success.
    // ===========================================================

    // ---- demo: skip Stripe, record order locally ----
    sessionStorage.setItem("leo_last_order", JSON.stringify(order));
    cartClear();
    renderConfirmation(order);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  function buildConfirmation(order) {
    return `
      <div class="container">
        <div class="confirm">
          <div class="confirm__check">✓</div>
          <h1>Thank you${order.name ? ", " + order.name.split(" ")[0] : ""}!</h1>
          <p>Your order <span class="confirm__order">${order.id}</span> is confirmed.</p>
          <p>A receipt is on its way to <strong>${order.email}</strong>. (Demo order — no charge was made.)</p>
          <div style="margin-top:2rem;display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">
            <a href="index.html" class="btn btn--solid btn--lg">Continue shopping</a>
            <a href="index.html#lineup" class="btn btn--outline btn--lg">View the lineup</a>
          </div>
        </div>
      </div>`;
  }

  function renderConfirmation(order) {
    root.innerHTML = buildConfirmation(order);
    updateBagCount();
  }
})();

/* If returning from a real Stripe redirect with ?status=success, you would
   read the query param here and show the confirmation. Left as a hook. */
