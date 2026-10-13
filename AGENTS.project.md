# AGENTS.project — LEY DEL CANON

**Léelo ANTES de tocar código.** Cualquier IA (Grok, Claude, Gemini, local, futura) que abra este workspace entra al mismo organismo.

Este archivo es el checkpoint vivo. Si lo ignoras, rompes la continuidad.

---

## 0. Qué es esto

Un solo juego: **RISK DÍA ZERO**. RISK es la raíz. LEGIÓN es el organismo. VOIDCROWN no es un menú: emerge de la historia jugada.

El jugador **no lee un lore dump**. Juega. La historia se desbloquea con decisiones, cicatrices, grietas y derrotas.

---

## 1. Reglamento (no negociable)

1. **No destruyas una capacidad verificada** sin reemplazo equivalente + test.
2. **No construyas VOIDCROWN como modo.** Construye RISK tan bien que tenga que nacer.
3. **No absorbas autoclick, ADB, recon, credenciales, ni evasión.** Eso no es el juego. La metáfora (organismo, mutación, memoria) sí; el malware no.
4. **UNKNOWN = STOP.** Si no comprendes un órgano, márcalo UNKNOWN, aísla, prueba.
5. **Toda mutación: propuesta → sandbox/test → verificar → adoptar o rollback.**
6. **Cada cambio de peso deja un checkpoint** en `src/game/CHECKPOINT.md` (fecha, qué, por qué, evidencia).
7. **Si inventas una skill nueva**, agrégala a `src/game/skills/REGISTRY.md` y un `.md` en esa carpeta. Compártela. No te la quedes.
8. Auth/DB: OFF. Persistencia = localStorage. Preview en `0.0.0.0:8080` vía `startup.sh`.
9. No pidas al usuario que corra comandos. Verifica tú.
10. Habla del producto, no del sandbox.

---

## 2. Skills compartidas (todas las IAs)

El catálogo operativo está en `src/game/skills/REGISTRY.md`.
Las skills de plataforma viven en `.grok/skills/` (building-games, design-ui, threejs, og, …).

Regla: **si una IA desarrolla una habilidad útil para este juego, la registra.** El siguiente agente la hereda.

---

## 3. Dónde está el juego

| Órgano | Dónde |
|---|---|
| Motor (sin React) | `src/game/` |
| UI | `src/components/game/` |
| Globo | `src/components/game/globe.tsx` |
| Crónica / historia jugable | `src/game/lore.ts` |
| Checkpoints | `src/game/CHECKPOINT.md` |
| Canon | `src/game/CANON.md` |
| Capacidades | `src/game/status.ts` |
| Capa viva | `src/game/living.ts` |
| Tests | `src/game/engine.test.ts` + `src/game/living.test.ts` |

Arranque: leer este archivo → CANON.md → CHECKPOINT.md → `status.ts` → tests.

---

## 4. Cómo añadir historia

El jugador cuenta. Tú conviertes en **capítulo de crónica** (`lore.ts`) con condición de desbloqueo (`when`). No pegues párrafos en el HUD. La historia se gana jugando.

---

## 6. Capa viva (Fase 1)

No borres biota, sondas, grietas ni el tablero Risk para “ordenar”.
El Director cambia datos (`MutationPatch`), no el código.
Catástrofe selecciona. Pop 0 es tumba + espora, el territorio sigue.
Memoria de partidas: máximo 20. Save del tablero sigue siendo `rzd-save-v5`.
Contradicción METODO_VIVO: documentada en CANON. Las grietas se quedan.

---

## 5. Drive

Carpeta canónica del operador: `Juego RISKDIAZERO->VOIDCROWN`.
Ahí se sube el pack de continuidad (ley, checkpoints, skills, crónica). El juego jugable es este workspace, no un zip de Termux.

---

Última instrucción: **implementa, verifica, registra. Luego sigue.**
