# CHECKPOINTS — RISK DÍA ZERO

Cualquier IA que edite el juego **añade una entrada aquí** al terminar un cambio de peso.
Formato: fecha ISO · agente · qué · evidencia · siguiente.

No borres entradas. Si un rollback deshace un cambio, marca `ROLLED_BACK` y explica.

---

## CP-000 · 2026-10-01 · Grok Build

**Qué:** Canon jugable: 42 territorios, dados Risk, 5 facciones + IA, globo R3F, desastres, cicatrices, mutaciones, grieta, persistencia v3/v4.

**Evidencia:** `engine.test.ts` (génesis, combate, sim).

**Siguiente:** Voidcrown como facción, no como barra.

---

## CP-001 · 2026-10-01 · Grok Build

**Qué:** Voidcrown emerge como jugador `void`. Reclama yermos. Overlay. Stats de fin. IA más agresiva contra el humano. Save v4.

**Evidencia:** test «Voidcrown emerge de yermos y grietas, no de un menú». Smoke desktop/móvil limpio. Build OK.

**Siguiente:** historia jugable + ley para otras IAs.

---

## CP-002 · 2026-10-02 · Grok Build

**Qué:** Absorción Drive. Carpeta `Juego RISKDIAZERO->VOIDCROWN` estaba vacía. Se rechazó autoclick/ADB/recon. Se transmutó la genealogía Hidra (génesis → órganos → guerrilla → predador → soberanía) en **crónica desbloqueable**. Ley del proyecto (`AGENTS.project.md`). Skills compartidas (`src/game/skills/REGISTRY.md`). Save v5 + campo `chronicle`.

**Evidencia:** capítulos se abren por eventos reales del motor. Test de crónica.

**Siguiente:** el operador sigue contando historia; cada capítulo nuevo entra en `lore.ts` con `when`.

---

## CP-003 · 2026-10-02 · Grok Build

**Qué:** Limpieza Drive (cuenta Adrian noxs). Papelera: zips 0 bytes, duplicados exactos de Docs, dumps terceros grandes (Android-Touch-Helper 112 MB, android-main, termux-styling, temp_build, working, wallet dump). Extracción: *EL LEGADO DEL MANDO* → capítulos `cuarto` y `nayla`. Pack de continuidad NO se pudo subir: **cuota de Drive llena** (la papelera sigue contando hasta vaciarla).

**Evidencia:** tests 11/11. Crónica cableada en HUD.

**Siguiente:** el operador vacía la papelera de Drive y, si hay otra cuenta Grok/Drive, la conecta en Conectores. Luego se sube el pack.

---

## CP-004 · 2026-10-05 · 413 / VETERANO

**Qué:** Fusión estrecha RISK × VOIDCROWN × MUTANTE. No se mezclaron HTML de Drive. Se absorbieron capacidades: CEL/Joker (`organism.ts`), Capítulo I «la caja no olvida» (`legacy.ts`). Doctrinas de facción se testearon (Marea).

**Evidencia:** tests de fitness/joker + legacy.

**CONTRADICCIÓN:** `VOIDCROWN_METODO_VIVO.md` (Drive, vero Trejo) pide no construir grietas/LEGIÓN/VOIDCROWN revelado en Capítulo I. Este workspace ya tiene grieta + Voidcrown emergente + cinemática (CP-000..003). No se revirtió. El build jugable gana sobre el HTML donante. No se absorbió el HTML de 1.6 MB como reemplazo.

**Siguiente:** CHECK en navegador. Pack a Drive si hay cuota. Mutante no es CANON.

---

## CP-005 · 2026-10-08 · 413 / Grok Build

**Qué:** Fase 1 encima del tablero, sin quitar Risk, grietas, Fénix de legado, EDAI, dados ni crónica. Capa viva: genoma de 6 ejes por nodo, esporas, tumbas, sondas (sondear / muestra / sembrar), fenómeno clicable, banner de aviso, Director heurístico que emite MutationPatch (doctrina NORMAL / AUSTERIDAD / RESCATE), memoria de 20 partidas, export/import de memoria JSON.

**No se borró:** grietas ni Voidcrown. Contradicción con METODO_VIVO queda DOCUMENTADA en CANON.md. Decisión: el órgano jugable se queda; la grieta no es un menú.

**Evidencia:** `src/game/living.test.ts`.

**CHECK:** CANDIDATE. Fases 2–5 siguen PENDIENTE.

**Siguiente:** si el operador confirma la contradicción, pasa a VERIFICADO de doctrina. Si no, no se toca. Luego cuenta ligera (Fase 2) solo si la pide.

---

## CP-006 · 2026-10-09 · 413 / Grok Build

**Qué:** La verdad jugable pasa a ser `VOIDCROWN_BUILD_UNICO` (HTML). No se borró el 12.0 ni el tablero React. Encima del único se añadió lo que el teatro VIVO tenía y el compilado no ejecutaba: diario que sobrevive en la mente, hambre + éxodo + grieta al golpe, RECONSTRUIR cierra el cráter, EDAI deja de atacar si pierde más de lo que gana en los últimos 8 intentos, fenómeno clicable, panel MISIONES (el botón no existía), recompensa de misión suma `W.ap`, acto al llegar a 10 nudos.

**Evidencia:** `node --check` de los 4 scripts. Simulación: Teherán 12→8, Bagdad 4→8, grieta abierta y cráter cerrado gastando 1 AP, diario en la mente, EDAI se contiene tras 3 derrotas y vuelve a atacar si las victorias superan.

**CHECK:** CANDIDATE. Visual humano del globo: PENDIENTE si el CDN de Three no carga.

**Siguiente:** jugar este HTML. No abrir otra verdad. No borrar sistemas.


---
