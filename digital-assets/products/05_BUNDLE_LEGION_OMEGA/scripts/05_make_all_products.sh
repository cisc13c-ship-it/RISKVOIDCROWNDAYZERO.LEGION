#!/bin/bash
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
for p in 01_VOIDCROWN_PLAYABLE 02_SKILL_PACK_IA 03_SOLAR_PHYSICS_LAB 04_FORJA_ENGINEERING_KIT 05_BUNDLE_LEGION_OMEGA; do
  bash scripts/02_build_product_tarball.sh "$p" "products/$p" dist
  python3 scripts/03_generate_store_listing.py "products/$p" "storefront/LISTING_${p}.md"
done
bash scripts/04_price_matrix.sh > storefront/PRICE_MATRIX.md
ls -lh dist/
