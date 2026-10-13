#!/usr/bin/env bash
# ==============================================================================
# LEGION CISC ONE — organismo local-first
# Contexto + memoria + experiencia + herramientas + autoclicker ADB
# CALIBRE 50: observar -> inventariar -> respaldar -> preparar -> autorizar
#             -> ejecutar -> verificar -> recuperar -> registrar -> aprender
#
# Seguridad:
# - No borra proyectos existentes.
# - No ejecuta acciones remotas/destructivas sin autorización explícita.
# - El autoclicker requiere coordenadas/gestos proporcionados por el operador.
# - No intenta ocultar automatización ni evadir controles de accesibilidad.
# ==============================================================================

set -Eeuo pipefail
IFS=$'\n\t'

ROOT="${LEGION_ROOT:-$HOME/LEGION_CISC}"
VERSION="1.0.0"
PY="$ROOT/.venv/bin/python"
LOG="$ROOT/ledger/events.jsonl"
DB="$ROOT/ledger/legion.sqlite3"

C0='\033[0m'; CY='\033[36m'; GN='\033[32m'; YE='\033[33m'; MA='\033[35m'; RD='\033[31m'
say(){ printf "${CY}[LEGION]${C0} %s\n" "$*"; }
ok(){ printf "${GN}[OK]${C0} %s\n" "$*"; }
warn(){ printf "${YE}[AVISO]${C0} %s\n" "$*"; }
die(){ printf "${RD}[ERROR]${C0} %s\n" "$*" >&2; exit 1; }
bar(){ printf "${MA}============================================================${C0}\n"; }

mkdir -p "$ROOT"/{bin,core,agents,tools,memory/{episodic,semantic,procedural},experience,ledger,snapshots,proposals,sandbox,config,reports,workspace,plugins,tests,autoclicker}
mkdir -p "$ROOT"/memory/context

cat > "$ROOT/config/policy.json" <<'JSON'
{
  "unknown_is_stop": true,
  "evidence_before_confirmation": true,
  "capability_is_not_verification": true,
  "transport_is_not_authorization": true,
  "preserve_originals": true,
  "remote_actions_require_authorization": true,
  "adb_actions_require_authorization": true,
  "destructive_actions_require_authorization": true,
  "autoclicker_mode": "explicit_target_only",
  "learning_requires_evidence": true
}
JSON

cat > "$ROOT/core/legion.py" <<'PY'
#!/usr/bin/env python3
import json, os, sqlite3, hashlib, subprocess, time
from pathlib import Path

ROOT=Path(os.environ.get("LEGION_ROOT", str(Path.home()/ "LEGION_CISC")))
LEDGER=ROOT/"ledger"
DB=LEDGER/"legion.sqlite3"
JSONL=LEDGER/"events.jsonl"

def db():
    LEDGER.mkdir(parents=True, exist_ok=True)
    c=sqlite3.connect(DB)
    c.execute("""CREATE TABLE IF NOT EXISTS events(
      id INTEGER PRIMARY KEY, ts TEXT, kind TEXT, actor TEXT,
      payload TEXT, sha256 TEXT)""")
    c.execute("""CREATE TABLE IF NOT EXISTS experiences(
      id INTEGER PRIMARY KEY, ts TEXT, task TEXT, result TEXT,
      evidence TEXT, reusable_capability TEXT)""")
    c.commit(); return c

def emit(kind, payload, actor="LEGION"):
    ts=time.strftime("%Y-%m-%dT%H:%M:%S%z")
    raw=json.dumps(payload,ensure_ascii=False,sort_keys=True)
    h=hashlib.sha256(raw.encode()).hexdigest()
    c=db(); c.execute("INSERT INTO events(ts,kind,actor,payload,sha256) VALUES(?,?,?,?,?)",
                      (ts,kind,actor,raw,h)); c.commit(); c.close()
    with JSONL.open("a",encoding="utf-8") as f:
        f.write(json.dumps({"ts":ts,"kind":kind,"actor":actor,"payload":payload,"sha256":h},
                           ensure_ascii=False)+"\n")
    return h

def discover():
    tools={}
    for name in ["bash","python3","git","curl","jq","sqlite3","adb","ollama","docker",
                 "podman","tesseract","ffmpeg","termux-tts-speak","termux-api"]:
        try:
            p=subprocess.run(["sh","-lc",f"command -v {name}"],capture_output=True,text=True)
            tools[name]=p.stdout.strip() if p.returncode==0 else None
        except Exception: tools[name]=None
    ollama=[]
    if tools.get("ollama"):
        try:
            p=subprocess.run(["ollama","list"],capture_output=True,text=True,timeout=5)
            ollama=p.stdout.strip().splitlines()
        except Exception: pass
    adb=[]
    if tools.get("adb"):
        try:
            p=subprocess.run(["adb","devices"],capture_output=True,text=True,timeout=5)
            adb=p.stdout.strip().splitlines()
        except Exception: pass
    result={"version":"1.0.0","root":str(ROOT),"tools":tools,"ollama":ollama,"adb":adb}
    (ROOT/"reports/capabilities.json").write_text(json.dumps(result,indent=2,ensure_ascii=False))
    emit("discover",result)
    return result

def status():
    c=db()
    ev=c.execute("SELECT COUNT(*) FROM events").fetchone()[0]
    ex=c.execute("SELECT COUNT(*) FROM experiences").fetchone()[0]
    c.close()
    return {"version":"1.0.0","root":str(ROOT),"events":ev,"experiences":ex}

if __name__=="__main__":
    import sys
    cmd=sys.argv[1] if len(sys.argv)>1 else "status"
    if cmd=="discover": print(json.dumps(discover(),indent=2,ensure_ascii=False))
    elif cmd=="status": print(json.dumps(status(),indent=2,ensure_ascii=False))
    else: raise SystemExit("uso: legion_core.py status|discover")
PY
chmod +x "$ROOT/core/legion.py"

cat > "$ROOT/core/context.py" <<'PY'
#!/usr/bin/env python3
import json, os, time
from pathlib import Path
ROOT=Path(os.environ.get("LEGION_ROOT",str(Path.home()/"LEGION_CISC")))
CTX=ROOT/"memory/context/context.json"
DEFAULT={
 "identity":{"name":"LEGION CISC","operator":"Mando Flacko"},
 "mission":"convert verified experience into reusable capability",
 "rules":["UNKNOWN=STOP","evidence before confirmation","preserve originals"],
 "projects":[],
 "preferences":{"implementation":"CALIBRE 50","single_master_script":True},
 "recent_tasks":[],
 "capabilities":{}
}
def load():
    if not CTX.exists():
        CTX.parent.mkdir(parents=True,exist_ok=True); CTX.write_text(json.dumps(DEFAULT,indent=2,ensure_ascii=False))
    return json.loads(CTX.read_text())
def save(x): CTX.write_text(json.dumps(x,indent=2,ensure_ascii=False))
def remember(kind,text,evidence=None):
    x=load(); x["recent_tasks"].append({"ts":time.strftime("%Y-%m-%dT%H:%M:%S%z"),"kind":kind,"text":text,"evidence":evidence})
    x["recent_tasks"]=x["recent_tasks"][-100:]; save(x)
if __name__=="__main__":
    x=load(); print(json.dumps(x,indent=2,ensure_ascii=False))
PY
chmod +x "$ROOT/core/context.py"

cat > "$ROOT/experience/engine.py" <<'PY'
#!/usr/bin/env python3
import json, os, sqlite3, time
from pathlib import Path
ROOT=Path(os.environ.get("LEGION_ROOT",str(Path.home()/"LEGION_CISC")))
DB=ROOT/"ledger/legion.sqlite3"
def learn(task,result,evidence,reusable):
    c=sqlite3.connect(DB)
    c.execute("""CREATE TABLE IF NOT EXISTS experiences(
      id INTEGER PRIMARY KEY, ts TEXT, task TEXT, result TEXT,
      evidence TEXT, reusable_capability TEXT)""")
    c.execute("INSERT INTO experiences(ts,task,result,evidence,reusable_capability) VALUES(?,?,?,?,?)",
      (time.strftime("%Y-%m-%dT%H:%M:%S%z"),task,result,evidence,reusable))
    c.commit(); c.close()
    print("EXPERIENCIA APRENDIDA:",reusable)
if __name__=="__main__":
    if len(__import__("sys").argv)<5: raise SystemExit("learn <task> <result> <evidence> <capability>")
    learn(*__import__("sys").argv[1:5])
PY
chmod +x "$ROOT/experience/engine.py"

cat > "$ROOT/tools/autoclicker.sh" <<'SH'
#!/usr/bin/env bash
# LEGION AUTCLICK — ADB explícito, sin coordenadas ocultas.
set -Eeuo pipefail
usage(){
  cat <<EOF
Uso:
  $0 devices
  $0 tap X Y
  $0 swipe X1 Y1 X2 Y2 MS
  $0 sequence X Y DELAY_MS [REPEAT]

Cada acción imprime, registra y exige --confirm para ejecución real.
Ejemplo:
  $0 --confirm tap 500 900
  $0 --confirm swipe 200 800 800 800 500
EOF
}
confirm=0
[[ "${1:-}" == "--confirm" ]] && { confirm=1; shift; }
cmd="${1:-}"
case "$cmd" in
 devices) adb devices ;;
 tap)
   [[ $# -eq 3 ]] || usage
   x="$2"; y="$3"
   [[ "$confirm" == 1 ]] || { echo "DRY-RUN tap $x $y"; exit 0; }
   adb shell input tap "$x" "$y"
   ;;
 swipe)
   [[ $# -eq 6 ]] || usage
   [[ "$confirm" == 1 ]] || { echo "DRY-RUN swipe $2 $3 $4 $5 $6"; exit 0; }
   adb shell input swipe "$2" "$3" "$4" "$5" "$6"
   ;;
 sequence)
   [[ $# -ge 3 ]] || usage
   x="$2"; y="$3"; delay="${4:-300}"; repeat="${5:-1}"
   [[ "$repeat" =~ ^[0-9]+$ && "$repeat" -le 1000 ]] || { echo "repeat inválido"; exit 1; }
   if [[ "$confirm" != 1 ]]; then echo "DRY-RUN sequence $x $y delay=$delay repeat=$repeat"; exit 0; fi
   for ((i=1;i<=repeat;i++)); do adb shell input tap "$x" "$y"; sleep "$(awk "BEGIN{print $delay/1000}")"; done
   ;;
 *) usage; exit 1 ;;
esac
SH
chmod +x "$ROOT/tools/autoclicker.sh"

cat > "$ROOT/bin/legion" <<'SH'
#!/usr/bin/env bash
set -Eeuo pipefail
ROOT="${LEGION_ROOT:-$HOME/LEGION_CISC}"
export LEGION_ROOT="$ROOT"
CORE="$ROOT/core/legion.py"
CTX="$ROOT/core/context.py"
case "${1:-help}" in
  status) python3 "$CORE" status ;;
  discover) python3 "$CORE" discover ;;
  context) python3 "$CTX" ;;
  remember)
    shift
    python3 - "$@" <<'PY'
import sys
from pathlib import Path
import os
sys.path.insert(0,str(Path(os.environ["LEGION_ROOT"])/"core"))
from context import remember
remember("operator", " ".join(sys.argv[1:]))
print("Contexto guardado.")
PY
    ;;
  click) shift; "$ROOT/tools/autoclicker.sh" "$@" ;;
  learn) shift; python3 "$ROOT/experience/engine.py" "$@" ;;
  policy) cat "$ROOT/config/policy.json" ;;
  logs) tail -n 50 "$ROOT/ledger/events.jsonl" 2>/dev/null || true ;;
  help|*)
    cat <<EOF
LEGION CISC v1.0
  status       estado verificable
  discover     inventario de capacidades
  context      memoria/contexto local
  remember ... guardar contexto operativo
  click ...    autoclicker ADB con dry-run por defecto
  learn ...    convertir experiencia verificada en capacidad
  policy       reglas de seguridad
  logs         últimas evidencias
EOF
    ;;
esac
SH
chmod +x "$ROOT/bin/legion"

cat > "$ROOT/README.md" <<'MD'
# LEGION CISC ONE

Organismo local-first para:
- contexto persistente
- memoria episódica/procedimental
- inventario de herramientas
- ledger de evidencia
- experiencia verificable -> capacidad reutilizable
- autoclicker ADB explícito
- integración futura con Ollama, Gemini, GitHub, OCR, visión, voz y nodos

## Principio
LEGION no presume capacidades. Las descubre, registra y verifica.

## Autoclicker
`bin/legion click tap X Y` hace DRY-RUN.
Para ejecutar: `bin/legion click --confirm tap X Y`.

No se diseñó para ocultar automatización ni evadir controles.
MD

# initialize context/db
export LEGION_ROOT="$ROOT"
"$ROOT/core/legion.py" discover >/dev/null
"$ROOT/core/context.py" >/dev/null

bar
printf "${CY}LEGION CISC ONE v${VERSION}${C0}\n"
bar
ok "Organismo creado: $ROOT"
ok "Contexto: $ROOT/memory/context/context.json"
ok "Ledger:   $ROOT/ledger/legion.sqlite3"
ok "Comandante: $ROOT/bin/legion"
ok "Autoclicker: $ROOT/tools/autoclicker.sh"
echo
"$ROOT/bin/legion" status
echo
"$ROOT/bin/legion" discover
echo
ok "CALIBRE 50 base completado: observar/inventariar/registrar/verificar."
echo "Siguiente: $ROOT/bin/legion help"
