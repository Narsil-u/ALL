// Footer year (every page)
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---------- Product configurator (mini/pro/max) ----------
const product = document.querySelector(".product");
if (product) {
  const base = Number(product.dataset.base);
  const name = product.dataset.product;

  const stage = document.getElementById("stage");
  const colorGroup = document.getElementById("colors");
  const selColor = document.getElementById("sel-color");
  const configGroup = document.getElementById("configs");
  const addonGroup = document.getElementById("addons");
  const qtyInput = document.getElementById("qty-input");
  const totalEl = document.getElementById("total");
  const summarySel = document.getElementById("summary-sel");
  const toast = document.getElementById("toast");

  const money = (n) => "$" + n.toLocaleString("en-US");

  // Single-select group: pressing one releases the others.
  function wireSingle(group, onChange) {
    if (!group) return;
    group.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        group.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", "false"));
        btn.setAttribute("aria-pressed", "true");
        onChange();
      });
    });
  }
  // Multi-select group: each button toggles independently.
  function wireMulti(group, onChange) {
    if (!group) return;
    group.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const on = btn.getAttribute("aria-pressed") === "true";
        btn.setAttribute("aria-pressed", on ? "false" : "true");
        onChange();
      });
    });
  }

  const pressed = (group) => group && group.querySelector('[aria-pressed="true"]');

  function recalc() {
    // Color
    const color = pressed(colorGroup);
    if (color) {
      if (selColor) selColor.textContent = color.dataset.name;
      if (stage && color.dataset.stage) stage.style.background = color.dataset.stage;
    }

    // Config (single)
    const config = pressed(configGroup);
    const configPrice = config ? Number(config.dataset.price) : 0;

    // Add-ons (multi)
    let addonPrice = 0;
    const addonNames = [];
    if (addonGroup) {
      addonGroup.querySelectorAll('[aria-pressed="true"]').forEach((a) => {
        addonPrice += Number(a.dataset.price);
        addonNames.push(a.dataset.name);
      });
    }

    const qty = Math.max(1, Math.min(10, Number(qtyInput.value) || 1));
    qtyInput.value = qty;

    const unit = base + configPrice + addonPrice;
    const total = unit * qty;
    totalEl.textContent = money(total);

    // Selection summary
    const parts = [];
    if (color) parts.push(color.dataset.name);
    if (config && config.dataset.name !== "Single") parts.push(config.dataset.name);
    else if (config) parts.push("Single");
    if (addonNames.length) parts.push(addonNames.join(" + "));
    if (qty > 1) parts.push("Qty " + qty);
    if (summarySel) summarySel.textContent = parts.join(" · ");
  }

  wireSingle(colorGroup, recalc);
  wireSingle(configGroup, recalc);
  wireMulti(addonGroup, recalc);

  // Quantity stepper
  document.querySelectorAll("#qty button").forEach((btn) => {
    btn.addEventListener("click", () => {
      qtyInput.value = (Number(qtyInput.value) || 1) + Number(btn.dataset.step);
      recalc();
    });
  });
  qtyInput.addEventListener("input", recalc);

  // Add to cart -> toast confirmation
  const buy = document.getElementById("buy");
  buy.addEventListener("click", () => {
    recalc();
    const sel = summarySel && summarySel.textContent ? " (" + summarySel.textContent + ")" : "";
    showToast("Added " + name + sel + " — " + totalEl.textContent);
  });

  let toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
  }

  recalc();
}
