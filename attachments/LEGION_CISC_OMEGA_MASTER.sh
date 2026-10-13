#!/usr/bin/env bash
# ==============================================================================
# LEGION CISC OMEGA MASTER
# Un solo organismo: contexto + IA + memoria + percepción + herramientas
# + ADB/autoclick + OCR + voz + experiencia + snapshots + ledger.
#
# CALIBRE 50:
# OBSERVAR -> INVENTARIAR -> RESPALDAR -> PREPARAR -> AUTORIZAR
# -> EJECUTAR -> VERIFICAR -> RECUPERAR -> REGISTRAR -> APRENDER
#
# IMPORTANTE:
# - No elimina ni mueve proyectos existentes durante la absorción.
# - Las acciones ADB se ejecutan sólo con --confirm.
# - La automatización semántica pulsa texto visible detectado por OCR;
#   no intenta ocultarse ni evadir controles.
# - Proveedores externos son órganos, no autoridad.
# ==============================================================================

set -Eeuo pipefail
IFS=$'\n\t'

ROOT="${LEGION_ROOT:-$HOME/LEGION_CISC_OMEGA}"
VERSION="2.0.0"
export LEGION_ROOT="$ROOT"

C0='\033[0m'; CY='\033[36m'; GN='\033[32m'; YE='\033[33m'; MA='\033[35m'; RD='\033[31m'
say(){ printf "${CY}[LEGION]${C0} %s\n" "$*"; }
ok(){ printf "${GN}[OK]${C0} %s\n" "$*"; }
warn(){ printf "${YE}[AVISO]${C0} %s\n" "$*"; }
err(){ printf "${RD}[ERROR]${C0} %s\n" "$*" >&2; }
bar(){ printf "${MA}================================================================${C0}\n"; }

mkdir -p "$ROOT"/{bin,core,agents,providers,tools,nodes,memory/{context,episodic,semantic,procedural},experience,ledger,snapshots,proposals,sandbox,workspace,reports,plugins,tests,autoclicker,absorbed}

# ---------- policy ----------
cat > "$ROOT/config.json" <<'JSON'
{
  "version":"2.0.0",
  "unknown_is_stop":true,
  "evidence_before_confirmation":true,
  "capability_is_not_verification":true,
  "transport_is_not_authorization":true,
  "preserve_originals":true,
  "adb_requires_confirm":true,
  "remote_requires_confirm":true,
  "destructive_requires_confirm":true,
  "learning_requires_evidence":true,
  "semantic_click_requires_ocr":true
}
JSON

# ---------- context ----------
cat > "$ROOT/memory/context/context.json" <<'JSON'
{
  "identity":{"name":"LEGION CISC OMEGA","operator":"Mando Flacko"},
  "mission":"experiencia verificable -> capacidad reutilizable",
  "implementation":"CALIBRE 50",
  "rules":["UNKNOWN=STOP","evidence before confirmation","preserve originals"],
  "projects":[],
  "preferences":{"single_master_script":true},
  "recent_tasks":[]
}
JSON

# ---------- core ----------
cat > "$ROOT/core/legion.py" <<'PY'
#!/usr/bin/env python3
import os,json,sqlite3,hashlib,subprocess,time,shutil
from pathlib import Path

ROOT=Path(os.environ.get("LEGION_ROOT",str(Path.home()/"LEGION_CISC_OMEGA")))
LEDGER=ROOT/"ledger"; DB=LEDGER/"legion.sqlite3"; JSONL=LEDGER/"events.jsonl"

def conn():
    LEDGER.mkdir(parents=True,exist_ok=True)
    c=sqlite3.connect(DB)
    c.execute("""CREATE TABLE IF NOT EXISTS events(
      id INTEGER PRIMARY KEY,ts TEXT,kind TEXT,actor TEXT,payload TEXT,sha256 TEXT)""")
    c.execute("""CREATE TABLE IF NOT EXISTS experiences(
      id INTEGER PRIMARY KEY,ts TEXT,mission TEXT,observation TEXT,action TEXT,
      verification TEXT,consequence TEXT,lesson TEXT,reusable_capability TEXT)""")
    c.execute("""CREATE TABLE IF NOT EXISTS mutations(
      id TEXT PRIMARY KEY,created TEXT,status TEXT,pre_hash TEXT,post_hash TEXT,
      authorized INTEGER,executed INTEGER,verified INTEGER,rollback TEXT)""")
    c.commit(); return c

def emit(kind,payload,actor="LEGION"):
    ts=time.strftime("%Y-%m-%dT%H:%M:%S%z")
    raw=json.dumps(payload,ensure_ascii=False,sort_keys=True)
    h=hashlib.sha256(raw.encode()).hexdigest()
    c=conn(); c.execute("INSERT INTO events(ts,kind,actor,payload,sha256) VALUES(?,?,?,?,?)",
                         (ts,kind,actor,raw,h)); c.commit(); c.close()
    with JSONL.open("a",encoding="utf-8") as f:
        f.write(json.dumps({"ts":ts,"kind":kind,"actor":actor,"payload":payload,"sha256":h},
                           ensure_ascii=False)+"\n")
    return h

def discover():
    names=["bash","python3","git","curl","wget","jq","sqlite3","adb","ollama","docker",
           "podman","tesseract","ffmpeg","termux-tts-speak","termux-speech-to-text",
           "node","npm","aider","gemini"]
    tools={n:shutil.which(n) for n in names}
    result={"version":"2.0.0","root":str(ROOT),"tools":tools}
    if tools["ollama"]:
        try: result["ollama"]=subprocess.run(["ollama","list"],capture_output=True,text=True,timeout=8).stdout
        except Exception: result["ollama"]=""
    if tools["adb"]:
        try: result["adb"]=subprocess.run(["adb","devices","-l"],capture_output=True,text=True,timeout=8).stdout
        except Exception: result["adb"]=""
    (ROOT/"reports/capabilities.json").write_text(json.dumps(result,indent=2,ensure_ascii=False))
    emit("discover",result)
    return result

def status():
    c=conn()
    out={"version":"2.0.0","root":str(ROOT),
         "events":c.execute("SELECT COUNT(*) FROM events").fetchone()[0],
         "experiences":c.execute("SELECT COUNT(*) FROM experiences").fetchone()[0],
         "mutations":c.execute("SELECT COUNT(*) FROM mutations").fetchone()[0]}
    c.close(); return out

if __name__=="__main__":
    import sys
    print(json.dumps(discover() if len(sys.argv)>1 and sys.argv[1]=="discover" else status(),
                     indent=2,ensure_ascii=False))
PY
chmod +x "$ROOT/core/legion.py"

# ---------- memory/experience ----------
cat > "$ROOT/core/memory.py" <<'PY'
import os,json,time
from pathlib import Path
ROOT=Path(os.environ.get("LEGION_ROOT",str(Path.home()/"LEGION_CISC_OMEGA")))
FILE=ROOT/"memory/context/context.json"
def load():
    return json.loads(FILE.read_text()) if FILE.exists() else {}
def remember(text,kind="operator"):
    x=load(); x.setdefault("recent_tasks",[]).append({
      "ts":time.strftime("%Y-%m-%dT%H:%M:%S%z"),"kind":kind,"text":text})
    x["recent_tasks"]=x["recent_tasks"][-100:]
    FILE.write_text(json.dumps(x,indent=2,ensure_ascii=False))
def context(limit=12):
    x=load()
    return json.dumps({"identity":x.get("identity"),"mission":x.get("mission"),
                       "rules":x.get("rules"),"recent_tasks":x.get("recent_tasks",[])[-limit:]},
                      ensure_ascii=False)
PY

cat > "$ROOT/experience/learn.py" <<'PY'
import os,sqlite3,time,sys
from pathlib import Path
ROOT=Path(os.environ.get("LEGION_ROOT",str(Path.home()/"LEGION_CISC_OMEGA")))
DB=ROOT/"ledger/legion.sqlite3"
if len(sys.argv)<7: raise SystemExit("learn mission observation action verification consequence lesson [capability]")
vals=sys.argv[1:]; capability=vals[6] if len(vals)>6 else ""
c=sqlite3.connect(DB)
c.execute("""INSERT INTO experiences(ts,mission,observation,action,verification,consequence,lesson,reusable_capability)
VALUES(?,?,?,?,?,?,?,?)""",(time.strftime("%Y-%m-%dT%H:%M:%S%z"),*vals[:6],capability))
c.commit(); c.close()
print("EXPERIENCIA CONSOLIDADA:",capability or "sin capacidad reutilizable")
PY

# ---------- provider router ----------
cat > "$ROOT/core/ask.py" <<'PY'
#!/usr/bin/env python3
import os,sys,json,subprocess,urllib.request,urllib.error
from pathlib import Path
ROOT=Path(os.environ.get("LEGION_ROOT",str(Path.home()/"LEGION_CISC_OMEGA")))
sys.path.insert(0,str(ROOT/"core"))
from memory import context,remember

q=" ".join(sys.argv[1:]).strip()
if not q: raise SystemExit("uso: legion ask <pregunta>")
ctx=context()
system="""Eres LEGION CISC OMEGA: un orquestador local-first.
Tu misión es convertir experiencia verificable en capacidad reutilizable.
Reglas: UNKNOWN=STOP; evidencia antes de confirmar; capacidad != verificación;
transport != autorización; preserva originales. Puedes proponer acciones,
pero no debes afirmar que una herramienta se ejecutó si no existe evidencia.
Contexto operativo:
"""+ctx

def ollama():
    if not subprocess.run(["sh","-lc","command -v ollama >/dev/null"],capture_output=True).returncode==0:
        return None
    try:
        r=subprocess.run(["ollama","run",os.environ.get("LEGION_MODEL","qwen2:1.5b"),
                          system+"\n\nUsuario: "+q],capture_output=True,text=True,timeout=180)
        if r.returncode==0 and r.stdout.strip(): return ("ollama",r.stdout.strip())
    except Exception: pass
    return None

def gemini():
    key=os.environ.get("GEMINI_API_KEY")
    if not key: return None
    model=os.environ.get("GEMINI_MODEL","gemini-3.6-flash")
    body=json.dumps({"system_instruction":{"parts":[{"text":system}]},
                     "contents":[{"parts":[{"text":q}]}]}).encode()
    req=urllib.request.Request(
      f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
      data=body,headers={"x-goog-api-key":key,"Content-Type":"application/json"})
    try:
        with urllib.request.urlopen(req,timeout=60) as x:
            d=json.loads(x.read().decode())
        text=d["candidates"][0]["content"]["parts"][0]["text"]
        return ("gemini",text)
    except Exception as e: return ("gemini_error",str(e))

ans=ollama() or gemini()
if not ans:
    print("LEGION: no hay proveedor LLM operativo. Instala/activa Ollama o define GEMINI_API_KEY.")
    sys.exit(2)
provider,text=ans
print(f"[{provider.upper()}]\n{text}")
remember(q,"query")
PY
chmod +x "$ROOT/core/ask.py"

# ---------- perception + ADB ----------
cat > "$ROOT/tools/vision.sh" <<'SH'
#!/usr/bin/env bash
set -Eeuo pipefail
ROOT="${LEGION_ROOT:-$HOME/LEGION_CISC_OMEGA}"
OUT="$ROOT/workspace/screen_$(date +%Y%m%d_%H%M%S).png"
case "${1:-}" in
  screenshot)
    command -v adb >/dev/null || { echo "ADB no disponible"; exit 2; }
    adb exec-out screencap -p > "$OUT"
    echo "$OUT"
    ;;
  ocr)
    IMG="${2:-}"
    [ -f "$IMG" ] || { echo "uso: vision.sh ocr imagen.png"; exit 2; }
    command -v tesseract >/dev/null || { echo "Tesseract no disponible"; exit 2; }
    tesseract "$IMG" stdout --psm 6
    ;;
  *)
    echo "uso: vision.sh screenshot | ocr imagen.png"; exit 1;;
esac
SH
chmod +x "$ROOT/tools/vision.sh"

cat > "$ROOT/tools/autoclick.sh" <<'SH'
#!/usr/bin/env bash
set -Eeuo pipefail
ROOT="${LEGION_ROOT:-$HOME/LEGION_CISC_OMEGA}"
CONFIRM=0
[[ "${1:-}" == "--confirm" ]] && { CONFIRM=1; shift; }
dry(){ [ "$CONFIRM" -eq 1 ] || { echo "DRY-RUN: $*"; exit 0; }; }
case "${1:-}" in
 devices) adb devices -l ;;
 tap)
   [ "$#" -eq 3 ] || { echo "tap X Y"; exit 1; }
   [[ "$2" =~ ^[0-9]+$ && "$3" =~ ^[0-9]+$ ]] || exit 1
   dry "adb shell input tap $2 $3"; adb shell input tap "$2" "$3"
   ;;
 swipe)
   [ "$#" -eq 6 ] || { echo "swipe X1 Y1 X2 Y2 MS"; exit 1; }
   dry "adb shell input swipe $2 $3 $4 $5 $6"; adb shell input swipe "$2" "$3" "$4" "$5" "$6"
   ;;
 sequence)
   [ "$#" -ge 4 ] || { echo "sequence X Y DELAY_MS [REPEAT]"; exit 1; }
   x="$2"; y="$3"; d="$4"; n="${5:-1}"
   [[ "$n" =~ ^[0-9]+$ && "$n" -le 1000 ]] || exit 1
   dry "sequence $x $y delay=$d repeat=$n"
   for ((i=0;i<n;i++)); do adb shell input tap "$x" "$y"; sleep "$(awk "BEGIN{print $d/1000}")"; done
   ;;
 tap-text)
   # Busca texto visible por OCR TSV y pulsa el centro de su bounding box.
   text="$2"; img="$ROOT/workspace/semantic_$(date +%s).png"
   adb exec-out screencap -p > "$img"
   command -v tesseract >/dev/null || { echo "Tesseract no disponible"; exit 2; }
   line="$(tesseract "$img" stdout --psm 6 tsv 2>/dev/null | awk -F '\t' -v q="$text" 'NR>1 && tolower($12) ~ tolower(q) {print $7,$8,$10,$11; exit}')"
   [ -n "$line" ] || { echo "Texto no encontrado: $text"; exit 3; }
   read -r x y w h <<<"$line"
   cx=$((x+w/2)); cy=$((y+h/2))
   dry "tap-text '$text' -> $cx,$cy"
   adb shell input tap "$cx" "$cy"
   ;;
 *) echo "devices | tap X Y | swipe X1 Y1 X2 Y2 MS | sequence X Y DELAY [REPEAT] | tap-text TEXTO"; exit 1;;
esac
SH
chmod +x "$ROOT/tools/autoclick.sh"

# ---------- absorption: inventory only ----------
cat > "$ROOT/tools/absorb.sh" <<'SH'
#!/usr/bin/env bash
set -Eeuo pipefail
ROOT="${LEGION_ROOT:-$HOME/LEGION_CISC_OMEGA}"
OUT="$ROOT/absorbed/inventory_$(date +%Y%m%d_%H%M%S).tsv"
mkdir -p "$(dirname "$OUT")"
{
 echo -e "hash\tsize\tpath"
 find "$HOME" -maxdepth 5 -type f \( -name "*.sh" -o -name "*.py" -o -name "*.md" -o -name "*.json" \) 2>/dev/null |
 while IFS= read -r f; do
   case "$f" in "$ROOT"/*) continue;; esac
   h=$(sha256sum "$f" 2>/dev/null | cut -d' ' -f1 || true)
   sz=$(wc -c <"$f" 2>/dev/null || echo 0)
   printf '%s\t%s\t%s\n' "$h" "$sz" "$f"
 done
} > "$OUT"
echo "$OUT"
SH
chmod +x "$ROOT/tools/absorb.sh"

# ---------- CLI ----------
cat > "$ROOT/bin/legion" <<'SH'
#!/usr/bin/env bash
set -Eeuo pipefail
ROOT="${LEGION_ROOT:-$HOME/LEGION_CISC_OMEGA}"; export LEGION_ROOT="$ROOT"
case "${1:-help}" in
 status) python3 "$ROOT/core/legion.py" ;;
 discover) python3 "$ROOT/core/legion.py" discover ;;
 ask) shift; python3 "$ROOT/core/ask.py" "$@" ;;
 context) cat "$ROOT/memory/context/context.json" ;;
 remember) shift; python3 - "$@" <<'PY'
import sys,os
from pathlib import Path
sys.path.insert(0,str(Path(os.environ["LEGION_ROOT"])/"core"))
from memory import remember
remember(" ".join(sys.argv[1:])); print("Contexto guardado.")
PY
 ;;
 click) shift; "$ROOT/tools/autoclick.sh" "$@" ;;
 vision) shift; "$ROOT/tools/vision.sh" "$@" ;;
 absorb) "$ROOT/tools/absorb.sh" ;;
 learn) shift; python3 "$ROOT/experience/learn.py" "$@" ;;
 logs) tail -n 80 "$ROOT/ledger/events.jsonl" 2>/dev/null || true ;;
 policy) cat "$ROOT/config.json" ;;
 *)
 cat <<EOF
LEGION CISC OMEGA $VERSION
  status
  discover
  ask <pregunta>
  context
  remember <texto>
  absorb
  vision screenshot|ocr <png>
  click devices
  click tap X Y
  click swipe X1 Y1 X2 Y2 MS
  click sequence X Y DELAY_MS [REPEAT]
  click tap-text "texto"
  learn <mission> <observation> <action> <verification> <consequence> <lesson> [capability]
  logs
  policy
EOF
 ;;
esac
SH
chmod +x "$ROOT/bin/legion"

# ---------- node manifest ----------
cat > "$ROOT/nodes/node.json" <<JSON
{
 "node_id":"$(hostname)-LEGION",
 "platform":"$(uname -s 2>/dev/null || true)",
 "kernel":"$(uname -r 2>/dev/null || true)",
 "arch":"$(uname -m 2>/dev/null || true)",
 "root":"$ROOT",
 "roles":["cortex","orchestrator","memory","perception","actuator"],
 "remote_execution":"LOCKED_BY_DEFAULT",
 "adb_input":"CONFIRM_REQUIRED"
}
JSON

cat > "$ROOT/README.md" <<'MD'
# LEGION CISC OMEGA MASTER v2

Un solo organismo local-first.

## Núcleo
- Contexto persistente
- Memoria
- Ledger SQLite + JSONL
- Experience Engine
- Inventario de capacidades
- Router LLM
- Percepción ADB/screenshot/OCR
- Autoclicker explícito
- Absorción por inventario/hash sin mover originales

## IA
`legion ask "..."` intenta Ollama local primero.
Si no existe, intenta Gemini mediante `GEMINI_API_KEY`.

## Autoclicker
Dry-run por defecto:
`legion click tap 500 900`

Ejecución autorizada:
`legion click --confirm tap 500 900`

Click semántico por OCR:
`legion click tap-text "Continuar"`

El click semántico sólo funciona si ADB y Tesseract están disponibles y el texto es visible.

## Principio
La IA puede proponer.
La política autoriza.
El ejecutor actúa.
La verificación demuestra.
La experiencia enseña.
MD

# ---------- initialize ----------
bar
say "LEGION CISC OMEGA MASTER v$VERSION"
say "Inicializando organismo..."
python3 "$ROOT/core/legion.py" discover >/dev/null 2>&1 || true
bar
ok "ROOT       $ROOT"
ok "CORE       $ROOT/core"
ok "MEMORIA    $ROOT/memory"
ok "EXPERIENCE $ROOT/experience"
ok "LEDGER     $ROOT/ledger"
ok "TOOLS      $ROOT/tools"
ok "AUTOMATION $ROOT/tools/autoclick.sh"
ok "VISION     $ROOT/tools/vision.sh"
ok "ABSORBER   $ROOT/tools/absorb.sh"
bar
"$ROOT/bin/legion" status
echo
echo "PRUEBAS:"
echo "  $ROOT/bin/legion discover"
echo "  $ROOT/bin/legion ask \"¿qué capacidades tengo?\""
echo "  $ROOT/bin/legion click devices"
echo "  $ROOT/bin/legion click tap-text \"Continuar\""
echo
ok "LEGION OMEGA MASTER instalado. Ningún proyecto existente fue modificado."
