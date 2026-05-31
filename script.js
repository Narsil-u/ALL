// Current year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Reveal sections on scroll
const revealEls = document.querySelectorAll(".card, .product, .quote, .spec-list li");
revealEls.forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(16px)";
  el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
});

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealEls.forEach((el) => io.observe(el));

// Friendly confirmation for the email capture form
const form = document.querySelector(".cta__form");
if (form) {
  form.addEventListener("submit", () => {
    const input = form.querySelector("input");
    const btn = form.querySelector("button");
    if (input && input.value.trim()) {
      btn.textContent = "🎉 Check your inbox!";
      input.value = "";
      setTimeout(() => (btn.textContent = "Get My Discount"), 3500);
    }
  });
}

// Respect reduced-motion: skip reveal animation
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  revealEls.forEach((el) => {
    el.style.opacity = "1";
    el.style.transform = "none";
    el.style.transition = "none";
  });
}
