# HANDOFF · VET-20261005-VOIDCROWN-FUSION-01

PROYECTO: RISK DÍA ZERO / VOIDCROWN (workspace Grok Build)
MISIÓN: Absorción controlada RISK × VOIDCROWN × MUTANTE
BUILD: este workspace (`src/game/`, preview 8080)
OBJETIVO: un ciclo estrecho con evidencia, sin fusionar HTML

ESTADO INICIAL: juego Risk + Voidcrown emergente + crónica + cinemática (CP-000..003). Drive (vero Trejo) contenía HTML/MD donantes.

CAMBIOS:
- `src/game/organism.ts` CEL / fitness / Joker
- `src/game/legacy.ts` la caja no olvida
- cableado en `engine.ts` endTurn + newGame inherit
- capítulo `caja` en `lore.ts`
- HUD CEL + toast de crónica (ya existía)
- VETERANO: mission.json persistente + cicatrices MVP

ARCHIVOS TOCADOS: engine.ts, types.ts, save.ts, store.ts, replay.ts, lore.ts, play-screen.tsx, engine.test.ts, status.ts, CHECKPOINT.md, skills/*, LEGION_VETERANO/*

HASH: ver `LEGION_VETERANO/evidence/SHA256_BEFORE_AFTER.txt`

PRUEBAS: `npx tsx --test src/game/engine.test.ts src/game/cinematic.test.ts` → 17/17 pass

ERRORES: SAVE_VERSION se cortó al importar (ERROR, corregido). CHECKPOINT.md se sobreescribió un instante (ERROR, restaurado CP-000..003).

UNKNOWN: `LEGION_OMEGA_v4_MUTANTE.tar.gz` 9KB no inspeccionado por dentro. HTML 1.6MB `VOIDCROWN_BETA_FINAL.html` (2 copias, mismo tamaño) no absorbido como build. Cuota Drive para subir pack: UNKNOWN (falló antes).

CONTRADICCIONES: METODO_VIVO (Cap I sin grietas) vs workspace (grietas + Voidcrown). Build jugable gana. No se revirtió.

BACKUP: originales Drive no tocados. No se borró nada este ciclo.

ESTADO REAL: INTEGRATION=PENDIENTE DE CHECK visual. ABSORPTION de Capítulo I = tests pass. CANON Mutante = PENDIENTE (Mando decide).

NO TOCAR: HTML de Drive, zips Termux, autoclick.

CICATRICES NUEVAS: COMANDO ≠ MISIÓN; CÓDIGO DE SALIDA ≠ DIAGNÓSTICO; no fusiones por nombre.

EXPERIENCIA: absorber capacidades (caja, CEL), no archivos.

SIGUIENTE MISIÓN: CHECK en preview (abrir → cinemática o menú → nueva partida → ver si hereda cicatriz). Subir pack si hay cuota. No absorber el HTML 1.6MB.
