#!/usr/bin/env python3
import zipfile, pathlib, hashlib, sys, datetime
src = pathlib.Path(sys.argv[1]).resolve()
out = pathlib.Path(sys.argv[2]).resolve(); out.mkdir(parents=True, exist_ok=True)
name = src.name; stamp = datetime.datetime.utcnow().strftime("%Y%m%d")
zp = out / f"{name}_{stamp}.zip"
with zipfile.ZipFile(zp, "w", zipfile.ZIP_DEFLATED) as z:
    for p in src.rglob("*"):
        if p.is_file():
            z.write(p, arcname=str(pathlib.Path(name)/p.relative_to(src)))
h = hashlib.sha256(zp.read_bytes()).hexdigest()
(zp.with_suffix(".zip.sha256")).write_text(f"{h}  {zp.name}\n")
print(zp.name, zp.stat().st_size, h[:16])
