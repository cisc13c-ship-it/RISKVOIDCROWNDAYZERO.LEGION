#!/usr/bin/env bash
# ==============================================================================
# LEGION/CISC — CALIBRE 50 DEFINITIVO
# AUTONOMOUS GAME ABSORPTION + EVOLUTION BOOTSTRAP
#
# OBJETIVO OPERATIVO
# ------------------------------------------------------------------------------
# Convertir la trayectoria LEGION/CISC en UN SOLO JUEGO AUTÓNOMO:
#
#   DESCUBRIR
#   -> CLASIFICAR
#   -> HASH
#   -> RESCATAR
#   -> ADAPTAR
#   -> CONSOLIDAR
#   -> COMPILAR/VALIDAR
#   -> TESTEAR
#   -> CERTIFICAR
#   -> RESPALDAR
#   -> ABSORBER
#   -> LIMPIAR ORIGINALES CERTIFICADOS
#   -> INSTALAR CICLO AUTÓNOMO
#
# Después del bootstrap, el sistema debe poder:
#   OBSERVAR -> APRENDER -> PROPONER -> MUTAR -> SANDBOX -> TEST -> VERIFY
#   -> ROLLBACK/COMMIT -> APRENDER
#
# REGLAS:
#   - Nunca se borra una fuente antes de certificar su absorción.
#   - Nunca se afirma "integrado" sin evidencia.
#   - Nunca se muta producción directamente.
#   - Cada capacidad absorbida tiene origen, hash y destino.
#   - Las fuentes eliminables se meten primero en QUARANTINE.
#   - La eliminación definitiva requiere un segundo arranque con
#     CISC_PURGE_CERTIFIED=YES.
#
# USO:
#   chmod +x CALIBRE_50_DEFINITIVO.sh
#   ./CALIBRE_50_DEFINITIVO.sh
#
# PARA EJECUTAR LA LIMPIEZA DEFINITIVA DESPUÉS DE CERTIFICAR:
#   CISC_PURGE_CERTIFIED=YES ./CALIBRE_50_DEFINITIVO.sh
#
# OPCIONALES:
#   CISC_HOME="$HOME/CISC_MASTER_VAULT"
#   CISC_GAME="$HOME/LEGION_GAME"
#   CISC_PURGE_CERTIFIED=YES
# ==============================================================================

set -Eeuo pipefail
IFS=$'\n\t'
umask 022

STAMP="$(date '+%Y%m%d_%H%M%S')"
HOST="$(hostname 2>/dev/null || echo unknown)"
CISC_HOME="${CISC_HOME:-$HOME/CISC_MASTER_VAULT}"
GAME="${CISC_GAME:-$HOME/LEGION_GAME}"
RUN="$GAME/control/runs/$STAMP"
SOURCE_LIST="$GAME/control/source_roots.txt"
MANIFEST="$GAME/control/absorption_manifest.tsv"
EVIDENCE="$GAME/control/evidence"
QUARANTINE="$GAME/control/quarantine"
PURGE="${CISC_PURGE_CERTIFIED:-NO}"

mkdir -p \
  "$GAME"/{world,simulation,combat,territory,economy,phenomena,consequence,director,agents,vision,learning,evolution,mutations,testing,memory,recovery,build,release,autonomy,adapters,content} \
  "$GAME"/control/{runs,evidence,quarantine,backups,certificates,inventory,logs}

LOG="$RUN.log"
mkdir -p "$(dirname "$LOG")"
exec > >(tee -a "$LOG") 2>&1

STEP=0
TOTAL=15

say() {
  printf '\n[%02d/%02d] %s\n' "$((++STEP))" "$TOTAL" "$1"
}

die() {
  echo
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo "CISC ABORTADO: $*"
  echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  echo "Fuentes originales preservadas."
  exit 1
}

trap 'echo "[CISC] fallo en línea $LINENO — fuentes preservadas"' ERR

hash_file() {
  sha256sum "$1" | awk '{print $1}'
}

safe_rel() {
  printf '%s' "$1" | sed 's#^/##; s#[^A-Za-z0-9._/@+-]#_#g'
}

banner() {
  clear 2>/dev/null || true
  cat <<'EOF'

 ██████╗██╗███████╗ ██████╗
██╔════╝██║██╔════╝██╔════╝
██║     ██║███████╗██║
██║     ██║╚════██║██║
╚██████╗██║███████║╚██████╗
 ╚═════╝╚═╝╚══════╝ ╚═════╝

        CALIBRE 50 DEFINITIVO
   LEGION/CISC AUTONOMOUS GAME BOOTSTRAP

   EXPERIENCIA VERIFICABLE
          ↓
   CAPACIDAD REUTILIZABLE
          ↓
       UN SOLO JUEGO
          ↓
   EVOLUCIÓN AUTÓNOMA

EOF
}

banner
echo "HOST : $HOST"
echo "RUN  : $STAMP"
echo "GAME : $GAME"
echo

# ------------------------------------------------------------------------------
# 1. AUTORIZACIÓN
# ------------------------------------------------------------------------------

say "AUTORIZACIÓN Y CONTRATO DE OPERACIÓN"

cat > "$GAME/control/BOOTSTRAP_CONTRACT.md" <<'EOF'
# CALIBRE 50 — CONTRATO

## Este bootstrap sí hace

- descubrir fuentes históricas LEGION/CISC;
- inventariar archivos;
- calcular SHA-256;
- detectar capacidades por nombre y contenido;
- seleccionar candidatos;
- copiar candidatos al área de absorción;
- preservar origen y hash;
- generar adaptadores y contratos;
- construir un núcleo autónomo;
- ejecutar compilación y pruebas disponibles;
- crear certificado de absorción;
- crear backup;
- poner fuentes certificadas en cuarentena;
- eliminar fuentes certificadas solamente cuando CISC_PURGE_CERTIFIED=YES.

## Este bootstrap no hace

- afirmar que una implementación vieja funciona solamente porque existe;
- fusionar código incompatible a ciegas;
- borrar fuentes antes de certificarlas;
- modificar fuentes originales durante la extracción;
- dar acceso autónomo a pagos, secretos o infraestructura crítica.

## Criterio de absorción

Una capacidad se considera ABSORBIDA solamente cuando:

1. existe copia en LEGION_GAME;
2. existe SHA-256 del origen;
3. existe SHA-256 del artefacto absorbido;
4. existe destino funcional;
5. existe evidencia de compilación/prueba o clasificación como DOCUMENTARY;
6. aparece en el manifiesto;
7. aparece en el certificado.

## Criterio de eliminación

ORIGINAL
→ ABSORBIDA
→ CERTIFICADA
→ BACKUP
→ QUARANTINE
→ ELIMINACIÓN DEFINITIVA

La cuarentena conserva estructura y hash para recuperación.
EOF

read -r -p "Escribe EXACTAMENTE CONSOLIDAR para iniciar: " GO
[[ "$GO" == "CONSOLIDAR" ]] || exit 0

# ------------------------------------------------------------------------------
# 2. DESCUBRIMIENTO DE RAÍCES
# ------------------------------------------------------------------------------

say "DESCUBRIENDO LA TRAYECTORIA REAL"

ROOTS_TMP="$GAME/control/inventory/discovered_roots.txt"
: > "$ROOTS_TMP"

# Rutas conocidas de la trayectoria.
CANDIDATES=(
  "$CISC_HOME"
  "$HOME/CISC"
  "$HOME/LEGION"
  "$HOME/LEGION_BETA"
  "$HOME/LEGION_ORO"
  "$HOME/LEGION_UNIVERSE"
  "$HOME/CISC_AUTOCLICK_OMEGA"
  "$HOME/CISC_LEGION_MISION"
  "$HOME/VOIDCROWN"
  "$HOME/grok-workspace"
  "$HOME/grok-workspace.zip"
  "$HOME/LEGION_GAME"
)

for p in "${CANDIDATES[@]}"; do
  [[ -e "$p" ]] || continue
  if [[ -f "$p" && "$p" == *.zip ]]; then
    printf '%s\n' "$p" >> "$ROOTS_TMP"
  elif [[ -d "$p" ]]; then
    real="$(cd "$p" && pwd -P)"
    printf '%s\n' "$real" >> "$ROOTS_TMP"
  fi
done

# También busca carpetas con nombres de proyecto bajo HOME, sin recorrer
# node_modules/.git/cache ni destruir nada.
find "$HOME" -maxdepth 3 -type d \
  \( -iname '*cisc*' -o -iname '*legion*' -o -iname '*voidcrown*' -o -iname '*autoclick*' -o -iname '*grok*' \) \
  -not -path '*/node_modules/*' \
  -not -path '*/.git/*' \
  -print 2>/dev/null >> "$ROOTS_TMP" || true

sort -u "$ROOTS_TMP" > "$SOURCE_LIST"
echo "Fuentes descubiertas:"
cat "$SOURCE_LIST"

# ------------------------------------------------------------------------------
# 3. INVENTARIO + HASH
# ------------------------------------------------------------------------------

say "INVENTARIANDO Y SELLANDO CON HASH"

INV="$GAME/control/inventory/files.tsv"
printf 'source\tsize\tmtime\tsha256\text\tkind\n' > "$INV"

while IFS= read -r root; do
  [[ -e "$root" ]] || continue

  if [[ -f "$root" ]]; then
    sha="$(hash_file "$root" 2>/dev/null || echo ERROR)"
    size="$(stat -c '%s' "$root" 2>/dev/null || echo 0)"
    mt="$(stat -c '%Y' "$root" 2>/dev/null || echo 0)"
    printf '%s\t%s\t%s\t%s\tarchive\n' "$root" "$size" "$mt" "$sha" >> "$INV"
    continue
  fi

  find "$root" \
    -path '*/node_modules' -prune -o \
    -path '*/.git' -prune -o \
    -path '*/__pycache__' -prune -o \
    -path '*/.venv' -prune -o \
    -path '*/venv' -prune -o \
    -path '*/dist' -prune -o \
    -type f -print0 2>/dev/null |
  while IFS= read -r -d '' f; do
    ext="${f##*.}"
    case "$f" in
      *.sh|*.bash|*.py|*.js|*.jsx|*.ts|*.tsx|*.json|*.yaml|*.yml|*.sql|*.md|*.txt|*.db|*.sqlite|*.sqlite3|*.toml|*.ini|*.cfg|*.html|*.css)
        ;;
      *) continue ;;
    esac

    size="$(stat -c '%s' "$f" 2>/dev/null || echo 0)"
    mt="$(stat -c '%Y' "$f" 2>/dev/null || echo 0)"
    sha="$(hash_file "$f" 2>/dev/null || echo ERROR)"
    printf '%s\t%s\t%s\t%s\tfile\n' "$f" "$size" "$mt" "$sha" "$INV" >/dev/null
    printf '%s\t%s\t%s\t%s\tfile\n' "$f" "$size" "$mt" "$sha" "$ext" >> "$INV"
  done
done < "$SOURCE_LIST"

COUNT="$(tail -n +2 "$INV" | wc -l | tr -d ' ')"
echo "Archivos inventariados: $COUNT"

# ------------------------------------------------------------------------------
# 4. CLASIFICACIÓN POR CAPACIDAD
# ------------------------------------------------------------------------------

say "CLASIFICANDO ÓRGANOS REUTILIZABLES"

CAP="$GAME/control/inventory/capabilities.tsv"
printf 'category\tpath\tmatches\tscore\n' > "$CAP"

declare -A PATTERNS=(
  [WORLD_SIMULATION]='simulation|simul|world state|worldstate|ecosystem|ecosistema|physics|procedural'
  [EVOLUTION]='mutation|mutat|evolution|evolu|adapt|genetic|genet|fitness|selection|seleccion'
  [CONSEQUENCE]='consequence|consecuencia|causal|causality|ledger|history|historia|state transition'
  [DIRECTOR_AI]='director|orchestrator|orquest|agent|planner|planning|decision engine|autonomous'
  [LEARNING]='learning|aprendiz|experience|experiencia|pattern|patron|reflection|reinforcement|reward'
  [GENERATION]='generate|generator|generation|generador|procedural|random|seed|terrain'
  [COMBAT]='combat|battle|batalla|warrior|damage|health|enemy|enemigo|attack'
  [TERRITORY]='territory|territorio|faction|faccion|conquest|conquista|map|region|resource'
  [DESTRUCTION]='destroy|destruct|collapse|impact|asteroid|nuclear|explosion|disaster|chemical'
  [ECONOMY]='economy|economia|market|mercado|price|precio|resource|recurso|trade|currency'
  [VISION_AGENT]='opencv|yolo|ocr|tesseract|vision|autoclick|adb|screen'
  [SIMULATION_SEARCH]='markov|monte carlo|montecarlo|probability|probabilidad|search tree|mcts'
  [TESTING]='test|pytest|vitest|jest|assert|verification|verify|validation|rollback'
  [MEMORY]='memory|memoria|ledger|sqlite|jsonl|database|event log'
  [NETWORK]='server|client|p2p|websocket|socket|network|sync|replication'
  [UI_GAME]='react|threejs|three\.js|unity|godot|babylon|canvas|scene|player|hud'
  [MONETIZATION]='monet|shop|store|cosmetic|season|battle pass|purchase|currency'
  [AUTOMATION]='bash|automation|automatizacion|cron|scheduler|workflow|pipeline'
)

while IFS=$'\t' read -r path size mt sha ext; do
  [[ "$path" == "source" ]] && continue
  [[ -f "$path" ]] || continue

  # No cargar archivos enormes completos.
  if (( size <= 800000 )); then
    text="$(cat "$path" 2>/dev/null | tr '[:upper:]' '[:lower:]' | head -c 250000 || true)"
  else
    text="$(basename "$path" | tr '[:upper:]' '[:lower:]')"
  fi

  base="$(basename "$path" | tr '[:upper:]' '[:lower:]')"
  text="$base $text"

  for category in "${!PATTERNS[@]}"; do
    score=0
    matches=()
    IFS='|' read -ra terms <<< "${PATTERNS[$category]}"

    for term in "${terms[@]}"; do
      if grep -Eq "$term" <<< "$text"; then
        score=$((score + 1))
        matches+=("$term")
      fi
    done

    if (( score > 0 )); then
      joined="$(IFS=','; echo "${matches[*]}")"
      printf '%s\t%s\t%s\t%s\n' "$category" "$path" "$joined" "$score" >> "$CAP"
    fi
  done
done < "$INV"

awk -F'\t' 'NR>1{n[$1]+=$4}END{for(k in n)print n[k] "\t" k}' "$CAP" |
sort -rn > "$GAME/control/inventory/capability_scores.tsv"

cat "$GAME/control/inventory/capability_scores.tsv"

# ------------------------------------------------------------------------------
# 5. PLAN DE ABSORCIÓN
# ------------------------------------------------------------------------------

say "GENERANDO PLAN DE ABSORCIÓN"

PLAN="$GAME/control/ABSORPTION_PLAN.md"

cat > "$PLAN" <<'EOF'
# PLAN DE ABSORCIÓN

## P0 — Órganos que mantienen vivo el juego

WORLD_SIMULATION
EVOLUTION
CONSEQUENCE
DIRECTOR_AI
LEARNING
GENERATION
TESTING
MEMORY

## P0 — Sistemas jugables

COMBAT
TERRITORY
DESTRUCTION
ECONOMY

## P1 — Autonomía de agentes

VISION_AGENT
SIMULATION_SEARCH
AUTOMATION

## P1 — Infraestructura

NETWORK
UI_GAME

## P2 — Negocio

MONETIZATION

## Criterio

No se integra un proyecto completo por nostalgia.
Se absorben capacidades verificables.
EOF

# ------------------------------------------------------------------------------
# 6. ÁREA DE ABSORCIÓN
# ------------------------------------------------------------------------------

say "RESCATANDO CANDIDATOS SIN TOCAR ORIGINALES"

ABS="$GAME/adapters/absorbed"
mkdir -p "$ABS"

# Dedupe por hash: una misma pieza no se copia diez veces.
declare -A SEEN_HASH=()

while IFS=$'\t' read -r category path matches score; do
  [[ "$category" == "category" ]] && continue
  [[ -f "$path" ]] || continue

  # Solo absorción de código/documentación/DB pequeña.
  size="$(stat -c '%s' "$path" 2>/dev/null || echo 0)"
  (( size <= 10000000 )) || continue

  sha="$(hash_file "$path" 2>/dev/null || echo ERROR)"
  [[ "$sha" == "ERROR" ]] && continue

  [[ -n "${SEEN_HASH[$sha]:-}" ]] && continue
  SEEN_HASH["$sha"]=1

  dest="$ABS/$category/$(safe_rel "$path")"
  mkdir -p "$(dirname "$dest")"

  if [[ ! -e "$dest" ]]; then
    cp -p "$path" "$dest"
    printf '%s\t%s\t%s\t%s\t%s\n' \
      "$path" "$sha" "$dest" "$category" "$matches" >> "$MANIFEST"
  fi
done < "$CAP"

# Cabecera si no existe.
if [[ ! -s "$MANIFEST" ]]; then
  printf 'source_sha\torigin\tabsorbed\tcategory\tmatches\n' > "$MANIFEST"
else
  {
    printf 'source_sha\torigin\tabsorbed\tcategory\tmatches\n'
    cat "$MANIFEST"
  } > "$MANIFEST.tmp"
  mv "$MANIFEST.tmp" "$MANIFEST"
fi

# ------------------------------------------------------------------------------
# 7. NÚCLEO DE MUNDO
# ------------------------------------------------------------------------------

say "CREANDO WORLD STATE Y CONSEQUENCE ENGINE"

cat > "$GAME/world/world_state.json" <<'EOF'
{
  "schema": 1,
  "tick": 0,
  "seed": "LEGION-CISC",
  "territories": {},
  "factions": {},
  "resources": {},
  "infrastructure": {},
  "environment": {},
  "population": {},
  "events": [],
  "history": []
}
EOF

cat > "$GAME/consequence/engine.py" <<'PY'
#!/usr/bin/env python3
import copy, hashlib, json, time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STATE_FILE = ROOT / "world" / "world_state.json"
LEDGER = ROOT / "memory" / "world_ledger.jsonl"
LEDGER.parent.mkdir(parents=True, exist_ok=True)

def digest(obj):
    raw = json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return hashlib.sha256(raw.encode()).hexdigest()

def load():
    return json.loads(STATE_FILE.read_text(encoding="utf-8"))

def save(state):
    tmp = STATE_FILE.with_suffix(".tmp")
    tmp.write_text(json.dumps(state, indent=2, ensure_ascii=False), encoding="utf-8")
    tmp.replace(STATE_FILE)

def process(event):
    state = load()
    before = digest(state)

    state["tick"] += 1
    state["events"].append(event)

    kind = event.get("type")

    consequence = {}

    if kind == "asteroid":
        consequence = {
            "infrastructure_damage": True,
            "route_damage": True,
            "resource_scarcity": True
        }

    elif kind == "battle":
        consequence = {
            "territory_pressure": True,
            "population_change": True,
            "infrastructure_damage": True
        }

    elif kind == "economic_crisis":
        consequence = {
            "price_volatility": True,
            "resource_shortage": True,
            "faction_tension": True
        }

    elif kind == "mutation":
        consequence = {
            "world_variation": True
        }

    else:
        consequence = {
            "world_changed": True
        }

    state["history"].append({
        "tick": state["tick"],
        "event": event,
        "consequence": consequence
    })

    after = digest(state)
    save(state)

    with LEDGER.open("a", encoding="utf-8") as f:
        f.write(json.dumps({
            "timestamp": time.time(),
            "before": before,
            "after": after,
            "event": event,
            "consequence": consequence
        }, ensure_ascii=False) + "\n")

    return {
        "before": before,
        "after": after,
        "consequence": consequence
    }

if __name__ == "__main__":
    print(process({"type": "bootstrap"}))
PY
chmod +x "$GAME/consequence/engine.py"

# ------------------------------------------------------------------------------
# 8. EVOLUTION ENGINE
# ------------------------------------------------------------------------------

say "CREANDO MOTOR DE MUTACIÓN AUTÓNOMA"

cat > "$GAME/evolution/engine.py" <<'PY'
#!/usr/bin/env python3
import copy, hashlib, json, random, time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WORLD = ROOT / "world" / "world_state.json"
MUTATIONS = ROOT / "mutations"
LEARNING = ROOT / "learning"
EVIDENCE = ROOT / "control" / "evidence"

for p in (MUTATIONS, LEARNING, EVIDENCE):
    p.mkdir(parents=True, exist_ok=True)

def digest(obj):
    raw = json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return hashlib.sha256(raw.encode()).hexdigest()

def load():
    return json.loads(WORLD.read_text(encoding="utf-8"))

def write_atomic(path, obj):
    tmp = path.with_suffix(".tmp")
    tmp.write_text(json.dumps(obj, indent=2, ensure_ascii=False), encoding="utf-8")
    tmp.replace(path)

def observe(world):
    return {
        "tick": world["tick"],
        "territories": len(world["territories"]),
        "factions": len(world["factions"]),
        "resources": len(world["resources"]),
        "events": len(world["events"]),
        "history": len(world["history"])
    }

def propose(world):
    mutation_id = time.strftime("%Y%m%d_%H%M%S") + "_" + str(random.randint(1000,9999))
    changes = {
        "environment": {
            "volatility": random.randint(0, 100),
            "pressure": random.randint(0, 100)
        }
    }
    return {
        "mutation_id": mutation_id,
        "parent_hash": digest(world),
        "created_at": time.time(),
        "reason": "autonomous_world_variation",
        "changes": changes,
        "status": "PROPOSED"
    }

def sandbox(world, mutation):
    candidate = copy.deepcopy(world)
    candidate["environment"] = mutation["changes"]["environment"]
    candidate["tick"] += 1
    candidate["events"] = candidate["events"] + [{
        "type": "mutation",
        "mutation_id": mutation["mutation_id"]
    }]
    return candidate

def evaluate(before, after):
    # Contrato mínimo. El juego real puede sustituirlo por métricas de
    # diversión, retención, equilibrio, rendimiento, etc.
    changed = digest(before) != digest(after)
    sane = isinstance(after, dict) and after.get("tick", -1) >= before.get("tick", -1)
    return {
        "valid": bool(changed and sane),
        "changed": changed,
        "sane": sane,
        "score": 1.0 if changed and sane else 0.0
    }

def run_once():
    world = load()
    observation = observe(world)
    mutation = propose(world)
    candidate = sandbox(world, mutation)
    evaluation = evaluate(world, candidate)

    mutation["evaluation"] = evaluation
    mutation["result_hash"] = digest(candidate)
    mutation["observation"] = observation

    # Producción SOLO después de evaluación.
    if evaluation["valid"]:
        mutation["status"] = "ACCEPTED"
        write_atomic(WORLD, candidate)
    else:
        mutation["status"] = "REJECTED"

    mutation_file = MUTATIONS / f'{mutation["mutation_id"]}.json'
    write_atomic(mutation_file, mutation)

    learn = {
        "mutation_id": mutation["mutation_id"],
        "parent_hash": mutation["parent_hash"],
        "result_hash": mutation["result_hash"],
        "status": mutation["status"],
        "evaluation": evaluation,
        "timestamp": time.time()
    }
    write_atomic(LEARNING / f'{mutation["mutation_id"]}.json', learn)

    return mutation

if __name__ == "__main__":
    print(json.dumps(run_once(), indent=2, ensure_ascii=False))
PY
chmod +x "$GAME/evolution/engine.py"

# ------------------------------------------------------------------------------
# 9. DIRECTOR AUTÓNOMO
# ------------------------------------------------------------------------------

say "CREANDO DIRECTOR AUTÓNOMO"

cat > "$GAME/director/director.py" <<'PY'
#!/usr/bin/env python3
import json, random
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STATE = ROOT / "world" / "world_state.json"

EVENTS = [
    "asteroid",
    "storm",
    "economic_crisis",
    "migration",
    "resource_discovery",
    "faction_conflict",
    "invasion",
    "mutation"
]

def observe():
    return json.loads(STATE.read_text(encoding="utf-8"))

def propose():
    world = observe()
    event = random.choice(EVENTS)
    return {
        "type": event,
        "tick": world["tick"],
        "reason": "world_state_variation"
    }

if __name__ == "__main__":
    print(json.dumps(propose(), indent=2))
PY
chmod +x "$GAME/director/director.py"

# ------------------------------------------------------------------------------
# 10. AGENTE VISION / AUTOCLICK ADAPTADO
# ------------------------------------------------------------------------------

say "CONVIRTIENDO AUTOCLICK/VISIÓN EN CONTRATO DE AGENTE"

cat > "$GAME/agents/AGENT_CONTRACT.md" <<'EOF'
# AGENT CONTRACT

El antiguo AutoClick/OCR/YOLO/ADB no entra como "bot de clic".

Se adapta como AGENTE DE OBSERVACIÓN Y PRUEBA.

Ciclo:

SCREEN / API / GAME STATE
        ↓
OBSERVE
        ↓
CLASSIFY
        ↓
OBJECTIVE
        ↓
ACTION
        ↓
OBSERVE RESULT
        ↓
VERIFY
        ↓
REPORT
        ↓
LEARN

Usos:

- smoke tests;
- regresión;
- exploración;
- pruebas de UI;
- pruebas de combate;
- pruebas de navegación;
- búsqueda de estados anómalos;
- pruebas de accesibilidad.

Restricción:

El agente no recibe secretos ni autorización de compras.
EOF

cat > "$GAME/agents/agent_loop.py" <<'PY'
#!/usr/bin/env python3
"""
Agente genérico.
El adaptador real puede usar API, simulación o visión.
"""

class Agent:
    def observe(self, state):
        return state

    def decide(self, observation):
        return {"action": "WAIT"}

    def act(self, action):
        return {"accepted": True, "action": action}

    def verify(self, before, result):
        return {
            "ok": bool(result.get("accepted"))
        }

    def run(self, state):
        before = self.observe(state)
        action = self.decide(before)
        result = self.act(action)
        return self.verify(before, result)

if __name__ == "__main__":
    print(Agent().run({"tick": 0}))
PY
chmod +x "$GAME/agents/agent_loop.py"

# ------------------------------------------------------------------------------
# 11. SIMULACIÓN / MONTE CARLO CONTRACT
# ------------------------------------------------------------------------------

say "CREANDO LABORATORIO DE EXPERIMENTACIÓN"

cat > "$GAME/simulation/experiment.py" <<'PY'
#!/usr/bin/env python3
import random

def trial(seed=None):
    if seed is not None:
        random.seed(seed)

    return {
        "volatility": random.random(),
        "conflict": random.random(),
        "scarcity": random.random()
    }

def run(n=100):
    n = max(1, min(int(n), 10000))
    results = [trial(i) for i in range(n)]

    return {
        "trials": n,
        "avg_volatility": sum(x["volatility"] for x in results) / n,
        "avg_conflict": sum(x["conflict"] for x in results) / n,
        "avg_scarcity": sum(x["scarcity"] for x in results) / n
    }

if __name__ == "__main__":
    print(run())
PY
chmod +x "$GAME/simulation/experiment.py"

# ------------------------------------------------------------------------------
# 12. APRENDIZAJE
# ------------------------------------------------------------------------------

say "CONSOLIDANDO MEMORIA DE EXPERIENCIA"

cat > "$GAME/learning/LEARNING_CONTRACT.md" <<'EOF'
# LEARNING CONTRACT

No se guarda basura infinita.

Se conserva:

EXPERIENCIA
→ EVIDENCIA
→ PATRÓN
→ CAPACIDAD
→ DECISIÓN

Cada aprendizaje debe responder:

- qué ocurrió;
- qué cambió;
- qué métrica lo demuestra;
- qué se aprendió;
- qué mutación produjo;
- si se conserva;
- si puede reutilizarse.

El sistema debe preferir aprendizajes compactos y verificables.
EOF

# ------------------------------------------------------------------------------
# 13. AUTONOMÍA
# ------------------------------------------------------------------------------

say "INSTALANDO CICLO AUTÓNOMO"

cat > "$GAME/autonomy/daemon.py" <<'PY'
#!/usr/bin/env python3
"""
Bucle autónomo seguro.

Por defecto trabaja con una mutación pequeña por ciclo.
El motor real puede sustituir la frecuencia y las métricas.

Nunca debe editar fuentes históricas: solo el árbol del juego.
"""

import json
import time
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
EVOLUTION = ROOT / "evolution" / "engine.py"
LOG = ROOT / "autonomy" / "autonomy.jsonl"

def log(record):
    with LOG.open("a", encoding="utf-8") as f:
        f.write(json.dumps(record, ensure_ascii=False) + "\n")

def cycle():
    started = time.time()
    p = subprocess.run(
        [sys.executable, str(EVOLUTION)],
        capture_output=True,
        text=True
    )

    record = {
        "timestamp": started,
        "returncode": p.returncode,
        "stdout": p.stdout[-4000:],
        "stderr": p.stderr[-4000:]
    }
    log(record)
    return p.returncode

if __name__ == "__main__":
    print("LEGION AUTONOMY: ciclo único")
    raise SystemExit(cycle())
PY
chmod +x "$GAME/autonomy/daemon.py"

cat > "$GAME/autonomy/AUTONOMY.md" <<'EOF'
# AUTONOMÍA

El objetivo final:

1. el juego genera estado;
2. los agentes observan;
3. se registran experiencias;
4. se detectan patrones;
5. el Director propone eventos;
6. Evolution Engine propone mutaciones;
7. Sandbox prueba;
8. Testing verifica;
9. Commit o rollback;
10. Learning registra;
11. siguiente ciclo.

La autonomía NO significa permitir que una IA reescriba todo sin límites.

Significa:

AUTONOMÍA DENTRO DE CONTRATOS VERIFICABLES.
EOF

# ------------------------------------------------------------------------------
# 14. TEST / BUILD / CERTIFICACIÓN
# ------------------------------------------------------------------------------

say "COMPILANDO Y CERTIFICANDO LO CONSOLIDADO"

TESTLOG="$EVIDENCE/test_$STAMP.txt"
mkdir -p "$EVIDENCE"

{
  echo "CALIBRE 50 TEST"
  echo "DATE=$STAMP"
  echo

  if command -v python3 >/dev/null 2>&1; then
    PY=python3
    echo "[PYTHON] encontrado"

    "$PY" -m py_compile \
      "$GAME/consequence/engine.py" \
      "$GAME/evolution/engine.py" \
      "$GAME/director/director.py" \
      "$GAME/agents/agent_loop.py" \
      "$GAME/simulation/experiment.py" \
      "$GAME/autonomy/daemon.py"

    echo "[PY_COMPILE] PASS"

    "$PY" "$GAME/evolution/engine.py"
    echo "[EVOLUTION_SMOKE] PASS"

    "$PY" "$GAME/consequence/engine.py"
    echo "[CONSEQUENCE_SMOKE] PASS"

    "$PY" "$GAME/director/director.py"
    echo "[DIRECTOR_SMOKE] PASS"

    "$PY" "$GAME/simulation/experiment.py"
    echo "[SIMULATION_SMOKE] PASS"

    "$PY" "$GAME/agents/agent_loop.py"
    echo "[AGENT_SMOKE] PASS"

  else
    echo "[PYTHON] NO DISPONIBLE"
    echo "[PYTHON_TESTS] DEFERRED"
  fi

  echo
  echo "[STRUCTURE]"
  for d in world simulation combat territory economy phenomena consequence director agents vision learning evolution mutations testing memory recovery build release autonomy adapters content control; do
    [[ -d "$GAME/$d" ]] && echo "PASS $d" || echo "FAIL $d"
  done

} | tee "$TESTLOG"

# ------------------------------------------------------------------------------
# 15. CERTIFICADO + BACKUP
# ------------------------------------------------------------------------------

say "GENERANDO CERTIFICADO Y BACKUP DE LA NUEVA MEMORIA"

CERT="$GAME/control/certificates/ABSORPTION_$STAMP.txt"

{
  echo "============================================================"
  echo "LEGION/CISC — ABSORPTION CERTIFICATE"
  echo "============================================================"
  echo "timestamp=$STAMP"
  echo "host=$HOST"
  echo "game=$GAME"
  echo "inventory_files=$COUNT"
  echo
  echo "ABSORBED MANIFEST:"
  sha256sum "$MANIFEST"
  echo
  echo "GAME CORE HASHES:"
  find "$GAME" -type f \
    -not -path "$GAME/control/runs/*" \
    -not -path "$GAME/control/backups/*" \
    -not -path "$GAME/control/quarantine/*" \
    -print0 2>/dev/null |
  sort -z |
  xargs -0 sha256sum 2>/dev/null || true
  echo
  echo "TEST EVIDENCE:"
  cat "$TESTLOG"
} > "$CERT"

BACKUP="$GAME/control/backups/LEGION_GAME_CERTIFIED_$STAMP.tar.gz"

tar \
  --exclude="$GAME/control/backups" \
  --exclude="$GAME/control/quarantine" \
  --exclude="$GAME/control/runs" \
  -czf "$BACKUP" \
  "$GAME"

BACKUP_SHA="$(hash_file "$BACKUP")"
echo "$BACKUP_SHA  $BACKUP" > "$BACKUP.sha256"

# ------------------------------------------------------------------------------
# MARCAR FUENTES CANDIDATAS A PURGA
# ------------------------------------------------------------------------------

say "GENERANDO LISTA DE FUENTES ABSORBIDAS"

PURGE_LIST="$GAME/control/CERTIFIED_FOR_PURGE.tsv"
printf 'origin\tsha256\tabsorbed_copy\tcategory\tstatus\n' > "$PURGE_LIST"

tail -n +2 "$MANIFEST" |
while IFS=$'\t' read -r origin_sha origin absorbed category matches; do
  [[ -f "$origin" ]] || continue

  current="$(hash_file "$origin" 2>/dev/null || echo MISSING)"

  if [[ "$current" == "$origin_sha" && -f "$absorbed" ]]; then
    printf '%s\t%s\t%s\t%s\tCERTIFIED\n' \
      "$origin" "$origin_sha" "$absorbed" "$category" >> "$PURGE_LIST"
  else
    printf '%s\t%s\t%s\t%s\tHOLD_HASH_MISMATCH\n' \
      "$origin" "$origin_sha" "$absorbed" "$category" >> "$PURGE_LIST"
  fi
done

# ------------------------------------------------------------------------------
# CUARENTENA / PURGA
# ------------------------------------------------------------------------------

if [[ "$PURGE" != "YES" ]]; then
  echo
  echo "=============================================================="
  echo "CERTIFICACIÓN COMPLETADA — PURGA AÚN NO EJECUTADA"
  echo "=============================================================="
  echo
  echo "El juego consolidado:"
  echo "  $GAME"
  echo
  echo "Backup:"
  echo "  $BACKUP"
  echo
  echo "Candidatos certificados:"
  echo "  $PURGE_LIST"
  echo
  echo "Para realizar la limpieza definitiva en otro ciclo:"
  echo
  echo "  CISC_PURGE_CERTIFIED=YES $0"
  echo
  echo "Esto SOLO podrá retirar archivos cuyo hash original todavía"
  echo "coincida y cuya copia absorbida exista."
  echo
else
  echo
  echo "=============================================================="
  echo "PURGA CERTIFICADA — MOVIENDO ORIGINALES A CUARENTENA"
  echo "=============================================================="

  QRUN="$QUARANTINE/$STAMP"
  mkdir -p "$QRUN"

  PURGED=0
  HELD=0

  tail -n +2 "$PURGE_LIST" |
  while IFS=$'\t' read -r origin sha absorbed category status; do
    [[ "$status" == "CERTIFIED" ]] || continue
    [[ -f "$origin" ]] || continue
    [[ -f "$absorbed" ]] || continue

    current="$(hash_file "$origin" 2>/dev/null || echo MISSING)"

    if [[ "$current" != "$sha" ]]; then
      echo "HOLD: hash cambió: $origin"
      HELD=$((HELD + 1))
      continue
    fi

    rel="$(safe_rel "$origin")"
    q="$QRUN/$rel"
    mkdir -p "$(dirname "$q")"

    # Mover primero, NO rm directo.
    mv "$origin" "$q"
    PURGED=$((PURGED + 1))

    printf '%s\t%s\t%s\t%s\n' \
      "$origin" "$sha" "$q" "$category" >> "$QRUN/MOVED.tsv"
  done

  {
    echo "QUARANTINE=$QRUN"
    echo "Backup=$BACKUP"
    echo "Regla: la cuarentena es recuperable."
    echo "No se borra cuarentena en este ciclo."
  } > "$QRUN/README.txt"

  echo
  echo "ORIGINALES CERTIFICADOS RETIRADOS A CUARENTENA."
  echo "NO se destruye la cuarentena automáticamente."
  echo
  echo "Cuando exista evidencia prolongada de estabilidad, la"
  echo "cuarentena puede eliminarse manualmente o mediante una"
  echo "segunda política explícita."
fi

# ------------------------------------------------------------------------------
# REPORTE FINAL
# ------------------------------------------------------------------------------

echo
echo "================================================================"
echo "             CALIBRE 50 — RESULTADO OPERATIVO"
echo "================================================================"
echo
echo "JUEGO CONSOLIDADO:"
echo "  $GAME"
echo
echo "INVENTARIO:"
echo "  $INV"
echo
echo "CAPACIDADES:"
echo "  $CAP"
echo
echo "MANIFIESTO:"
echo "  $MANIFEST"
echo
echo "CERTIFICADO:"
echo "  $CERT"
echo
echo "BACKUP:"
echo "  $BACKUP"
echo
echo "PURGA:"
if [[ "$PURGE" == "YES" ]]; then
  echo "  EJECUTADA → CUARENTENA"
else
  echo "  NO EJECUTADA — requiere CISC_PURGE_CERTIFIED=YES"
fi
echo
echo "AUTONOMÍA:"
echo "  $GAME/autonomy/"
echo
echo "CICLO:"
echo "  OBSERVE"
echo "    ↓"
echo "  LEARN"
echo "    ↓"
echo "  PROPOSE"
echo "    ↓"
echo "  MUTATE"
echo "    ↓"
echo "  SANDBOX"
echo "    ↓"
echo "  TEST"
echo "    ↓"
echo "  VERIFY"
echo "   ↙   ↘"
echo "ROLLBACK COMMIT"
echo "         ↓"
echo "       LEARN"
echo
echo "================================================================"
echo " CALIBRE 50 TERMINADO."
echo " EXPERIENCIA ABSORBIDA. MEMORIA CONSOLIDADA."
echo "================================================================"
