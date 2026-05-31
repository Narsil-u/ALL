# Leo's Speakers — Website

A multi-page, responsive marketing + storefront site for Leo's Speakers, styled
after the clean, bright Google Store aesthetic.

## Pages

- `index.html` — home: hero, lineup tiles, features, and a comparison table
- `mini.html` — Leo Mini buy page
- `pro.html` — Leo Pro buy page
- `max.html` — Leo Max buy page
- `styles.css` — shared styling
- `script.js` — shared product configurator logic

## Buy pages

Each product page has a live configurator with:

- **Color** swatches (also recolors the product backdrop)
- **Configuration** (single / stereo pair / bundle)
- **Add-ons** (multi-select: cases, stands, Leo Care+)
- **Quantity** stepper

The running **total** updates instantly, and **Add to cart** shows a confirmation
toast. The Buy buttons on the home page and comparison table link straight to the
matching product page.

## Run it

Static site, no build step:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```
