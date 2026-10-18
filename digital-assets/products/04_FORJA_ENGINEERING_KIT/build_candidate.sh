#!/bin/bash
SRC="$1"; LABEL="${2:-mut}"; OUT="candidates/CANDIDATE_$(date -u +%Y%m%dT%H%M%SZ)_${LABEL}.html"
cp "$SRC" "$OUT"; sha256sum "$OUT" | tee -a FENIX/memory.jsonl; echo "$OUT"
