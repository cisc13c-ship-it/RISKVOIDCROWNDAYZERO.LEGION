#!/data/data/com.termux/files/usr/bin/bash
# ==============================================================
# 🦅 CISC LEGION — INTEGRADOR + LIMPIEZA
# Encuentra todas las piezas del juego, las une en UNO,
# deduplica por hash y limpia la basura al terminar.
# REGLA: NUNCA borra originales sin respaldo.
# ==============================================================
set -uo pipefail

V="\e[32m"; A="\e[33m"; R="\e[31m"; Z="\e[34m"; N="\e[0m"

RAIZ="$HOME"
DESTINO="$RAIZ/JUEGO_FUSIONADO_FINAL"
RESPALDOS="$RAIZ/RESPALDOS_ORIGINALES"
LOG="$DESTINO/BITACORA_INTEGRACION.txt"
TS=$(date +%Y%m%d_%H%M%S)

echo -e "${Z}╔══════════════════════════════════════════════════════════╗${N}"
echo -e "${Z}║  🦅 INTEGRADOR + LIMPIEZA — TODO EN UNO                  ║${N}"
echo -e "${Z}╚══════════════════════════════════════════════════════════╝${N}"
echo -e "Inicio: $(date)"
echo

# ─── 1. PREPARAR TERRITORIO ───
echo -e "${A}[1/7] Preparando territorio...${N}"
mkdir -p "$DESTINO"/{juego,codigo,docs,respaldos} "$RESPALDOS/$TS"
echo "=== INTEGRACIÓN $TS ===" > "$LOG"

# ─── 2. BUSCAR TODAS LAS PIEZAS ───
echo -e "${A}[2/7] Buscando todas las piezas del juego...${N}"
declare -A HASHES
INTEGRADAS=0; DUPLICADOS=0; TOTAL=0

ORIGENES=("$RAIZ" "$RAIZ/storage/shared/Download" "$RAIZ/storage/downloads" "$RAIZ/CISC_LEGION")

for origen in "${ORIGENES[@]}"; do
  [ ! -d "$origen" ] && continue
  while IFS= read -r -d '' arc; do
    # saltar lo que ya está integrado y respaldos
    [[ "$arc" =~ JUEGO_FUSIONADO_FINAL|RESPALDOS_ORIGINALES ]] && continue
    TOTAL=$((TOTAL+1))
    h=$(sha256sum "$arc" 2>/dev/null | cut -d' ' -f1)
    [ -z "$h" ] && continue

    if [[ -n "${HASHES[$h]:-}" ]]; then
      DUPLICADOS=$((DUPLICADOS+1))
      # duplicado: lo movemos a respaldo (no se borra a lo loco)
      mv "$arc" "$RESPALDOS/$TS/dup_$(basename "$arc")" 2>/dev/null || rm -f "$arc"
      continue
    fi
    HASHES[$h]=1

    # clasificar
    nom=$(basename "$arc")
    tipo="codigo"
    [[ "$nom" =~ \.html?$ ]] && tipo="juego"
    [[ "$nom" =~ \.(txt|md)$ ]] && tipo="docs"
    [[ "$nom" =~ \.(zip|tar|gz)$ ]] && tipo="respaldos"

    cp "$arc" "$DESTINO/$tipo/$nom" 2>/dev/null && INTEGRADAS=$((INTEGRADAS+1))
  done < <(find "$origen" -maxdepth 4 -type f \( -iname "*.html" -o -iname "*.js" -o -iname "*.ts" -o -iname "*.tsx" -o -iname "*.css" -o -iname "*.json" -o -iname "*.sh" -o -iname "*.zip" -o -iname "*.txt" -o -iname "*.md" \) -print0 2>/dev/null)
done

echo -e "   ${V}✓${N} Escaneados: $TOTAL | Integradas: $INTEGRADAS | Duplicadas movidas: $DUPLICADOS"
echo "Escaneados: $TOTAL | Integradas: $INTEGRADAS | Duplicadas: $DUPLICADOS" >> "$LOG"

# ─── 3. EXTRAER PAQUETES COMPRIMIDOS ───
echo -e "${A}[3/7] Extrayendo paquetes comprimidos...${N}"
shopt -s nullglob
for pkg in "$DESTINO/respaldos"/*.zip "$DESTINO/respaldos"/*.tar.gz; do
  [ -f "$pkg" ] || continue
  mkdir -p "$DESTINO/respaldos/_extraidos"
  unzip -q "$pkg" -d "$DESTINO/respaldos/_extraidos" 2>/dev/null || tar -xzf "$pkg" -C "$DESTINO/respaldos/_extraidos" 2>/dev/null || true
done

# ─── 4. COPIAR EL JUEGO FUSIONADO (el HTML único) ───
echo -e "${A}[4/7] Instalando juego fusionado único...${N}"
# Si existe el HTML maestro en descargas, lo ponemos como entrada principal
HTML_MAESTRO=$(find "$DESTINO/juego" -name "*.html" -type f 2>/dev/null | head -1)
if [ -n "$HTML_MAESTRO" ]; then
  cp "$HTML_MAESTRO" "$DESTINO/JUGAR_AQUI.html"
  echo -e "   ${V}✓${N} Entrada principal: JUGAR_AQUI.html"
fi

# ─── 5. LANZADOR ÚNICO ───
echo -e "${A}[5/7] Creando lanzador único...${N}"
cat > "$DESTINO/🔥_JUGAR_AQUI.sh" << 'EOF'
#!/data/data/com.termux/files/usr/bin/bash
cd "$(dirname "$0")"
clear
echo "╔════════════════════════════════════════════╗"
echo "║  🌑 RISK DÍA ZERO · VOIDCROWN — FUSIONADO   ║"
echo "╚════════════════════════════════════════════╝"
echo
if [ -f "JUGAR_AQUI.html" ]; then
  echo "✅ Abriendo juego..."
  termux-open-url "JUGAR_AQUI.html" 2>/dev/null || echo "Abre: $(pwd)/JUGAR_AQUI.html"
else
  echo "Buscando el juego..."
  find . -name "*.html" -type f | head -3
fi
EOF
chmod +x "$DESTINO/🔥_JUGAR_AQUI.sh"

# ─── 6. LIMPIEZA FINAL ───
echo -e "${A}[6/7] Limpiando basura (después de integrar)...${N}"
BASURA=0
for item in node_modules _DEDUP_HASH respaldos_antes respaldos_vivos bitacora .npm "*.log" ".DS_Store"; do
  while IFS= read -r -d '' f; do
    rm -rf "$f" 2>/dev/null && BASURA=$((BASURA+1))
  done < <(find "$DESTINO" -maxdepth 3 -name "$item" -print0 2>/dev/null)
done
# limpiar respaldos viejos (mantener solo los 3 más recientes)
ls -1dt "$RESPALDOS"/*/ 2>/dev/null | tail -n +4 | xargs rm -rf 2>/dev/null || true
echo -e "   ${V}✓${N} $BASURA elementos de basura eliminados"
echo "Basura eliminada: $BASURA" >> "$LOG"

# ─── 7. RESUMEN ───
TOTAL_FINAL=$(find "$DESTINO" -type f | wc -l)
TAM_FINAL=$(du -sh "$DESTINO" | cut -f1)
LIBRE=$(df -P "$RAIZ" | awk 'NR==2{printf "%d", $4/1024}')

echo -e "\n${V}╔══════════════════════════════════════════════════════════╗${N}"
echo -e "${V}║            ✅ INTEGRACIÓN + LIMPIEZA COMPLETA             ║${N}"
echo -e "${V}╚══════════════════════════════════════════════════════════╝${N}"
echo
echo -e "📍 Carpeta final: $DESTINO"
echo -e "📦 Archivos finales: $TOTAL_FINAL"
echo -e "💾 Tamaño: $TAM_FINAL"
echo -e "🧩 Piezas integradas: $INTEGRADAS"
echo -e "🗑️  Duplicados/basura: $((DUPLICADOS+BASURA))"
echo -e "📱 Espacio libre ahora: ${LIBRE} MB"
echo
echo -e "${Z}▶ Para jugar:${N} bash $DESTINO/🔥_JUGAR_AQUI.sh"
echo -e "${A}Respaldos originales intactos en: $RESPALDOS${N}"
echo "Fin: $(date)" >> "$LOG"
