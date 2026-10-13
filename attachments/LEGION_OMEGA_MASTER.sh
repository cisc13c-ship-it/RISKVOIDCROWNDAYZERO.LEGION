#!/usr/bin/env bash
# ==============================================================================
# LEGION OMEGA — CISC UNIVERSAL AI BOOTSTRAP
# "Una IA con todo": núcleo + memoria + herramientas + agentes + visión +
# nodos + ledger + experiencia + sandbox + CALIBRE 50.
#
# Principio:
#   OBSERVAR -> INVENTARIAR -> RESPALDAR -> PREPARAR -> AUTORIZAR ->
#   EJECUTAR -> VERIFICAR -> RECUPERAR -> REGISTRAR -> APRENDER
#
# Este bootstrap NO borra originales, NO ejecuta acciones remotas por defecto
# y NO asume que una herramienta está instalada: descubre y registra capacidad.
# ==============================================================================

set -Eeuo pipefail
IFS=$'\n\t'

VERSION="OMEGA-0.1"
ROOT="${LEGION_ROOT:-$HOME/LEGION_OMEGA}"
TS="$(date +%Y%m%d_%H%M%S)"
LOG="$ROOT/ledger/bootstrap_${TS}.log"

mkdir -p "$ROOT"/{bin,core,agents,providers,tools,nodes,memory,ledger,experience,\
proposals,sandbox,snapshots,config,workspace,artifacts,reports,plugins,tests}

exec > >(tee -a "$LOG") 2>&1

say(){ printf '\n[%s] %s\n' "$(date '+%H:%M:%S')" "$*"; }
ok(){ printf '  ✓ %s\n' "$*"; }
warn(){ printf '  ! %s\n' "$*"; }

clear 2>/dev/null || true
cat <<'BANNER'
╔══════════════════════════════════════════════════════════════════════════════╗
║                         L E G I O N   Ω                                     ║
║                 CISC UNIVERSAL AI / OMEGA-0.1                              ║
║                                                                            ║
║       OBSERVE → THINK → ACT → VERIFY → LEARN → EVOLVE                     ║
╚══════════════════════════════════════════════════════════════════════════════╝
BANNER

say "ROOT: $ROOT"
say "INICIO: $TS"

# ------------------------------------------------------------------------------
# 00. DETECCIÓN
# ------------------------------------------------------------------------------
say "00 / Detectando entorno"

PY=""
for p in python3 python; do
  if command -v "$p" >/dev/null 2>&1; then PY="$(command -v "$p")"; break; fi
done

declare -A CAP
for c in bash git curl wget jq sqlite3 node npm ollama adb docker podman aider \
         gemini tesseract ffmpeg whisper; do
  if command -v "$c" >/dev/null 2>&1; then CAP["$c"]="available"; else CAP["$c"]="missing"; fi
done

cat > "$ROOT/nodes/local_capabilities.json" <<JSON
{
  "version":"$VERSION",
  "timestamp":"$(date -Is)",
  "host":"$(hostname 2>/dev/null || echo unknown)",
  "os":"$(uname -s 2>/dev/null || echo unknown)",
  "arch":"$(uname -m 2>/dev/null || echo unknown)",
  "python":"${PY:-missing}",
  "capabilities":{
    "bash":"${CAP[bash]}","git":"${CAP[git]}","curl":"${CAP[curl]}",
    "jq":"${CAP[jq]}","sqlite3":"${CAP[sqlite3]}","node":"${CAP[node]}",
    "npm":"${CAP[npm]}","ollama":"${CAP[ollama]}","adb":"${CAP[adb]}",
    "docker":"${CAP[docker]}","podman":"${CAP[podman]}",
    "aider":"${CAP[aider]}","gemini":"${CAP[gemini]}",
    "tesseract":"${CAP[tesseract]}","ffmpeg":"${CAP[ffmpeg]}",
    "whisper":"${CAP[whisper]}"
  }
}
JSON
ok "Censo local registrado"

# ------------------------------------------------------------------------------
# 01. LEDGER
# ------------------------------------------------------------------------------
say "01 / Creando ledger de verdad"

if [[ "${CAP[sqlite3]}" == "available" ]]; then
  sqlite3 "$ROOT/ledger/legion.sqlite3" <<'SQL'
PRAGMA journal_mode=WAL;
CREATE TABLE IF NOT EXISTS events(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts TEXT NOT NULL,
  kind TEXT NOT NULL,
  actor TEXT,
  target TEXT,
  status TEXT,
  evidence TEXT,
  payload TEXT
);
CREATE TABLE IF NOT EXISTS tools(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  path TEXT,
  version TEXT,
  status TEXT,
  capabilities TEXT,
  first_seen TEXT,
  last_seen TEXT
);
CREATE TABLE IF NOT EXISTS experiences(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts TEXT NOT NULL,
  mission TEXT,
  observation TEXT,
  action TEXT,
  verification TEXT,
  consequence TEXT,
  lesson TEXT,
  reusable_capability TEXT
);
CREATE TABLE IF NOT EXISTS mutations(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts TEXT NOT NULL,
  mutation_id TEXT UNIQUE NOT NULL,
  target TEXT,
  pre_hash TEXT,
  post_hash TEXT,
  status TEXT,
  rollback_path TEXT
);
SQL
  ok "SQLite ledger listo"
else
  warn "sqlite3 no instalado; se usará JSONL como fallback"
fi

# ------------------------------------------------------------------------------
# 02. CORE PYTHON
# ------------------------------------------------------------------------------
say "02 / Construyendo núcleo de IA"

cat > "$ROOT/core/legion_core.py" <<'PY'
#!/usr/bin/env python3
import json, os, sqlite3, subprocess, time, hashlib
from pathlib import Path

ROOT = Path(os.environ.get("LEGION_ROOT", Path.home()/ "LEGION_OMEGA"))
DB = ROOT/"ledger"/"legion.sqlite3"
JSONL = ROOT/"ledger"/"events.jsonl"

def now(): return time.strftime("%Y-%m-%dT%H:%M:%S%z")

def emit(kind, actor="LEGION", target="", status="observed",
         evidence="", payload=None):
    event = {
        "ts": now(), "kind": kind, "actor": actor, "target": target,
        "status": status, "evidence": evidence, "payload": payload or {}
    }
    JSONL.parent.mkdir(parents=True, exist_ok=True)
    with JSONL.open("a", encoding="utf-8") as f:
        f.write(json.dumps(event, ensure_ascii=False)+"\n")
    if DB.exists():
        con=sqlite3.connect(DB)
        con.execute("""INSERT INTO events
            (ts,kind,actor,target,status,evidence,payload)
            VALUES (?,?,?,?,?,?,?)""",
            (event["ts"],kind,actor,target,status,evidence,
             json.dumps(payload or {},ensure_ascii=False)))
        con.commit(); con.close()
    return event

def sha256(path):
    h=hashlib.sha256()
    with open(path,"rb") as f:
        for chunk in iter(lambda:f.read(1024*1024),b""): h.update(chunk)
    return h.hexdigest()

def discover():
    names=["bash","git","curl","jq","sqlite3","node","npm","ollama",
           "adb","docker","podman","aider","gemini","tesseract","ffmpeg",
           "whisper"]
    result=[]
    for name in names:
        p=subprocess.run(["bash","-lc",f"command -v {name}"],
                         text=True,capture_output=True)
        path=p.stdout.strip()
        if path:
            v=subprocess.run(["bash","-lc",f"{name} --version 2>/dev/null | head -1"],
                             text=True,capture_output=True).stdout.strip()
            result.append({"name":name,"path":path,"version":v})
    emit("DISCOVERY",target="local_tools",evidence="command -v",
         payload={"tools":result})
    return result

def status():
    return {
        "root":str(ROOT),
        "db":DB.exists(),
        "jsonl":JSONL.exists(),
        "providers": [p.name for p in (ROOT/"providers").glob("*.json")],
        "agents": [p.name for p in (ROOT/"agents").glob("*.json")]
    }

if __name__=="__main__":
    print(json.dumps(status(),indent=2,ensure_ascii=False))
PY
chmod +x "$ROOT/core/legion_core.py"
ok "LEGION Core listo"

# ------------------------------------------------------------------------------
# 03. PROVIDER REGISTRY
# ------------------------------------------------------------------------------
say "03 / Registrando miembros IA"

cat > "$ROOT/providers/registry.json" <<'JSON'
{
  "providers": [
    {
      "id":"ollama",
      "role":"local_ai",
      "transport":"local",
      "authority":false,
      "capabilities":["reasoning","classification","generation","offline"]
    },
    {
      "id":"gemini",
      "role":"external_ai",
      "transport":"api_or_cli",
      "authority":false,
      "capabilities":["multimodal","analysis","planning","synthesis"]
    },
    {
      "id":"grok",
      "role":"external_ai",
      "transport":"external",
      "authority":false,
      "capabilities":["research","analysis","generation"]
    },
    {
      "id":"qwen",
      "role":"local_model",
      "transport":"ollama",
      "authority":false,
      "capabilities":["coding","reasoning","local_inference"]
    },
    {
      "id":"llama",
      "role":"local_model",
      "transport":"ollama",
      "authority":false,
      "capabilities":["reasoning","generation","offline"]
    },
    {
      "id":"aider",
      "role":"code_agent",
      "transport":"cli",
      "authority":false,
      "capabilities":["code_editing","refactoring","repository_work"]
    }
  ],
  "rule":"provider != authority; evidence + policy + verification decide"
}
JSON
ok "Registro de proveedores creado"

# ------------------------------------------------------------------------------
# 04. AGENT REGISTRY
# ------------------------------------------------------------------------------
cat > "$ROOT/agents/registry.json" <<'JSON'
{
  "agents":[
    {"id":"black_hole","role":"discovery","actions":["inventory","hash","classify"]},
    {"id":"ojo","role":"perception","actions":["ocr","vision","yolo","opencv"]},
    {"id":"veterano","role":"builder","actions":["code","patch","test","refactor"]},
    {"id":"recovery","role":"resilience","actions":["snapshot","backup","rollback","restore"]},
    {"id":"market","role":"economic_research","actions":["research","opportunity","analytics"]},
    {"id":"chaos","role":"adversarial_testing","actions":["mutation","fault_injection","replay"]},
    {"id":"director","role":"orchestration","actions":["plan","delegate","verify"]},
    {"id":"experience","role":"learning","actions":["register","reflect","generalize"]}
  ]
}
JSON
ok "Agentes canónicos registrados"

# ------------------------------------------------------------------------------
# 05. POLICY
# ------------------------------------------------------------------------------
say "04 / Instalando política de seguridad y autorización"

cat > "$ROOT/config/POLICY.md" <<'MD'
# LEGION OMEGA — POLICY

1. UNKNOWN = STOP.
2. Evidencia antes de confirmación.
3. Capacidad != verificación.
4. Transporte != autorización.
5. No fusionar antes de clasificar.
6. Originales preservados hasta validación.
7. Toda mutación recibe mutation_id.
8. Antes/después: hash cuando sea posible.
9. Acciones remotas, ADB input, permisos, borrado y cambios destructivos:
   requieren autorización explícita.
10. Primero sandbox/propuesta; después promoción.
11. Toda acción relevante produce evento en ledger.
12. Un proveedor de IA nunca es autoridad por sí mismo.
13. Rollback debe existir antes de una mutación de riesgo.
14. La IA puede proponer; la política determina si puede ejecutar.
MD

cat > "$ROOT/config/CALIBRE_50.md" <<'MD'
# CALIBRE 50

OBSERVAR
INVENTARIAR
RESPALDAR
PREPARAR
AUTORIZAR
EJECUTAR
VERIFICAR
RECUPERAR
REGISTRAR
APRENDER
MD
ok "Política instalada"

# ------------------------------------------------------------------------------
# 06. MEMORY + EXPERIENCE
# ------------------------------------------------------------------------------
say "05 / Instalando memoria y aprendizaje"

cat > "$ROOT/experience/engine.py" <<'PY'
import json, os, sqlite3, time
from pathlib import Path

ROOT=Path(os.environ.get("LEGION_ROOT",Path.home()/"LEGION_OMEGA"))
DB=ROOT/"ledger"/"legion.sqlite3"

def learn(mission, observation, action, verification, consequence, lesson,
          reusable_capability=""):
    event=(time.strftime("%Y-%m-%dT%H:%M:%S%z"),mission,observation,action,
           verification,consequence,lesson,reusable_capability)
    if DB.exists():
        c=sqlite3.connect(DB)
        c.execute("""INSERT INTO experiences
        (ts,mission,observation,action,verification,consequence,lesson,
         reusable_capability) VALUES (?,?,?,?,?,?,?,?)""",event)
        c.commit(); c.close()
    return {"lesson":lesson,"reusable_capability":reusable_capability}
PY

cat > "$ROOT/memory/MEMORY_MODEL.md" <<'MD'
# LEGION MEMORY

EPISODIC       = qué ocurrió.
SEMANTIC       = qué significa.
PROCEDURAL     = cómo repetirlo.
PROVENANCE     = de dónde salió.
VERIFICATION   = qué evidencia lo demuestra.
CONSEQUENCE    = qué produjo.
LEARNING       = qué debe cambiar.
REUSABLE       = qué capacidad puede sobrevivir al caso original.

Regla:
experiencia verificable -> capacidad reutilizable
MD
ok "Experience Engine + modelo de memoria creados"

# ------------------------------------------------------------------------------
# 07. TOOL DISCOVERY
# ------------------------------------------------------------------------------
say "06 / Ejecutando descubrimiento"

if [[ -n "$PY" ]]; then
  LEGION_ROOT="$ROOT" "$PY" "$ROOT/core/legion_core.py" || true
fi

if command -v ollama >/dev/null 2>&1; then
  ollama list > "$ROOT/nodes/ollama_models.txt" 2>&1 || true
fi

if command -v adb >/dev/null 2>&1; then
  adb devices -l > "$ROOT/nodes/adb_devices.txt" 2>&1 || true
fi

if command -v docker >/dev/null 2>&1; then
  docker ps --format '{{.Names}}\t{{.Image}}\t{{.Status}}' \
    > "$ROOT/nodes/docker.txt" 2>&1 || true
fi

ok "Descubrimiento ejecutado"

# ------------------------------------------------------------------------------
# 08. UNIVERSAL COMMANDER
# ------------------------------------------------------------------------------
say "07 / Creando comandante"

cat > "$ROOT/bin/legion" <<'PY'
#!/usr/bin/env python3
import os, sys, json, subprocess
from pathlib import Path

ROOT=Path(os.environ.get("LEGION_ROOT",Path.home()/"LEGION_OMEGA"))

def run(cmd):
    print("PROPUESTA:", " ".join(cmd))
    print("LEGION: ejecución bloqueada por defecto.")
    print("Para ejecutar una acción real debe pasar por política/autorización.")

def main():
    if len(sys.argv)==1:
        print("""LEGION OMEGA
  status       estado del organismo
  discover     descubrir herramientas
  inventory    inventariar workspace
  experience  registrar/aprender
  providers    proveedores IA
  agents       agentes
  policy       política CALIBRE 50
  propose      crear propuesta
""")
        return
    if sys.argv[1]=="status":
        p=ROOT/"core"/"legion_core.py"
        subprocess.run([sys.executable,str(p)])
    elif sys.argv[1]=="discover":
        subprocess.run([sys.executable,str(ROOT/"core"/"legion_core.py")])
    elif sys.argv[1]=="policy":
        print((ROOT/"config"/"POLICY.md").read_text())
    elif sys.argv[1]=="providers":
        print((ROOT/"providers"/"registry.json").read_text())
    elif sys.argv[1]=="agents":
        print((ROOT/"agents"/"registry.json").read_text())
    else:
        print("Comando reconocido como propuesta; falta política específica:",sys.argv[1])

if __name__=="__main__": main()
PY
chmod +x "$ROOT/bin/legion"

# ------------------------------------------------------------------------------
# 09. HEALTH
# ------------------------------------------------------------------------------
cat > "$ROOT/bin/legion-health" <<'SH'
#!/usr/bin/env bash
set -u
ROOT="${LEGION_ROOT:-$HOME/LEGION_OMEGA}"
printf '\nLEGION OMEGA HEALTH\n'
for f in \
  core/legion_core.py \
  providers/registry.json \
  agents/registry.json \
  config/POLICY.md \
  config/CALIBRE_50.md \
  experience/engine.py \
  bin/legion
do
  [[ -e "$ROOT/$f" ]] && printf '  ✓ %s\n' "$f" || printf '  ✗ %s\n' "$f"
done
printf '\nROOT=%s\n' "$ROOT"
SH
chmod +x "$ROOT/bin/legion-health"

# ------------------------------------------------------------------------------
# 10. REPORT
# ------------------------------------------------------------------------------
say "08 / Verificación"

"$ROOT/bin/legion-health"

cat > "$ROOT/README.md" <<EOF
# LEGION OMEGA — CISC Universal AI

Version: $VERSION
Created: $(date -Is)

## Qué es

Un organismo de IA-orquestación que reúne:
- agentes especializados
- proveedores de IA locales/externos
- memoria
- experiencia
- ledger
- visión
- nodos
- herramientas
- sandbox
- CALIBRE 50
- recuperación
- aprendizaje

## Qué NO afirma

Este bootstrap no afirma que Gemini, Grok, ADB, Ollama, YOLO,
Whisper, Docker, GitHub u otros servicios estén conectados.
La instalación descubre las capacidades realmente presentes.

## Arquitectura

OBSERVE -> THINK -> PROPOSE -> AUTHORIZE -> ACT -> VERIFY -> LEARN

## Primeros comandos

  export LEGION_ROOT="$ROOT"
  "$ROOT/bin/legion" status
  "$ROOT/bin/legion" discover
  "$ROOT/bin/legion" providers
  "$ROOT/bin/legion" agents
  "$ROOT/bin/legion-health"

## Regla de oro

UNKNOWN = STOP.
Proveedor != autoridad.
Capacidad != verificación.
Originales primero.
Evidencia siempre.
EOF

if [[ -n "$PY" ]]; then
  LEGION_ROOT="$ROOT" "$PY" -m py_compile \
    "$ROOT/core/legion_core.py" "$ROOT/experience/engine.py"
  ok "Python: compilación OK"
fi

printf '\n'
printf '██████████████████████████████████████████████████████████████████\n'
printf ' LEGION OMEGA %s — BOOTSTRAP COMPLETADO\n' "$VERSION"
printf ' ROOT: %s\n' "$ROOT"
printf ' LOG : %s\n' "$LOG"
printf '██████████████████████████████████████████████████████████████████\n'
printf '\nSIGUIENTE PASO:\n'
printf '  export LEGION_ROOT="%s"\n' "$ROOT"
printf '  "%s/bin/legion" status\n' "$ROOT"
printf '\n'
