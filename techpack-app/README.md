# Tech Pack Builder — Green Neurons

React app for building and exporting apparel tech packs.
Deploys to greenneurons.us/techpack via Cloudflare Pages.

## Local dev
```
npm start
```
Opens at http://localhost:3000

## Build for deploy
```
npm run build
```
Outputs to `build/` — point Cloudflare Pages root to this folder.

## Cloudflare Pages setup
- Build command: `npm run build`
- Build output directory: `build`
- Root directory: (repo subfolder, e.g. `techpack-app`)

## Data flow
1. Fill in Cover Sheet, Colorways, BOM, POM tabs
2. Click **Export JSON** — downloads `techpack_STYLENUMBER_SEASON.json`
3. Feed JSON to Python generator (openpyxl + reportlab) for .xlsx + .pdf output

## Adding the Python export generator
Next phase — run `generate_techpack.py` with the exported JSON to produce:
- `TechPack_STYLENAME.xlsx` — formatted multi-sheet Excel
- `TechPack_STYLENAME.pdf` — print-ready PDF

## Stack
- React 19 + TypeScript
- DM Sans / DM Mono / Playfair Display (Google Fonts)
- Zero external UI dependencies
- Green Neurons design tokens (cream/navy/slate)
