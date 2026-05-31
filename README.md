# Leo's Speakers — Premium Storefront

A multi-page, Apple Store–style storefront for Leo's Geometric Series speakers,
with deep per-product customization, a persistent Bag, and a checkout flow
(demo mode, with a clearly-marked Stripe integration point).

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Home — hero, lineup, features, comparison table |
| `mini.html` / `pro.html` / `max.html` | Product buy pages (built from the catalog) |
| `cart.html` | Bag — line items, quantities, order summary |
| `checkout.html` | Checkout — contact/shipping/payment + confirmation |

## Scripts

| File | Purpose |
|------|---------|
| `catalog.js` | Product catalog, cart engine (localStorage), faceted SVG speaker renders, bag badge, toast |
| `product.js` | Builds each buy page's configurator from the catalog |
| `cart.js` | Renders the Bag and order summary |
| `checkout.js` | Demo checkout + order confirmation |
| `styles.css` | Shared premium styling |

## Customization per speaker

Each product page lets you choose:

- **Finish** — Obsidian, Graphite, Copper Edition, Silver (recolors the live render)
- **Configuration** — single, stereo pair, multi-room / stage rigs
- **Add-ons** — cases, stands, Leo Care+ (multi-select)
- **Engraving** — free, up to 16 characters
- **Quantity**

The running total updates live, and **Add to Bag** merges identical configs. The
Bag persists in `localStorage` across pages and shows a count badge in the nav.

## Pricing (premium)

- Leo Mini — from **$299**
- Leo Pro — from **$799**
- Leo Max — from **$1,499**

## Stripe

Checkout runs in **demo mode** — no card is charged. To connect real payments,
see the `STRIPE_INTEGRATION` block in `checkout.js`: replace the demo order
block with a `fetch` to a serverless function that creates a Stripe Checkout
Session (using `STRIPE_SECRET_KEY`) and redirect to `session.url`. Because
GitHub Pages is static-only, the function must be hosted somewhere that runs
code (e.g. Vercel/Netlify Functions).

## Run it

Static site, no build step:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```
