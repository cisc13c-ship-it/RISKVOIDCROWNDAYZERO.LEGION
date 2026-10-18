#!/usr/bin/env python3
import sys, json, hashlib
from pathlib import Path
from datetime import datetime, timezone

def sha256_file(p: Path) -> str:
    h = hashlib.sha256()
    with p.open("rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()

def main():
    if len(sys.argv) < 3:
        print("uso: 03_generate_store_listing.py product_dir out.md"); sys.exit(1)
    pdir = Path(sys.argv[1]); out = Path(sys.argv[2])
    files = [f for f in pdir.rglob("*") if f.is_file()]
    rows = [f"| `{f.relative_to(pdir)}` | {f.stat().st_size} | `{sha256_file(f)[:16]}…` |" for f in files]
    meta = pdir / "product.json"
    info = json.loads(meta.read_text()) if meta.exists() else {"name": pdir.name, "price_usd": "TBD", "tagline": ""}
    md = f"""# {info.get('name', pdir.name)}
**Tagline:** {info.get('tagline','')}
**Precio sugerido:** USD {info.get('price_usd','TBD')} · {info.get('price_tier','')}
**Versión:** {info.get('version','1.0.0')} · {datetime.now(timezone.utc).strftime('%Y-%m-%d')}
**Tipo:** Activo digital descargable

## Qué incluye
{info.get('includes','- Ver archivos')}

## Cómo usar
{info.get('how_to','1. Descargar 2. Extraer 3. Abrir')}

## Archivos
| Archivo | Bytes | SHA256 (prefijo) |
|---------|------:|------------------|
""" + "\n".join(rows) + f"""

## Licencia
{info.get('license_summary','Uso personal OK. Reventa pack original no. Comercial: contactar.')}

## Keywords
{info.get('keywords','html5, digital download, voidcrown, forja')}
"""
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(md, encoding="utf-8")
    print("Wrote", out)

if __name__ == "__main__":
    main()
