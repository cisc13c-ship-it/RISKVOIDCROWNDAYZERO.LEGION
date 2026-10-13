# CANON — RISK DÍA ZERO / LEGIÓN

Cualquier IA autorizada puede mejorar este sistema.

Puede reemplazar cualquier componente si demuestra que el reemplazo mejora el resultado.
Puede introducir nuevas tecnologías, rediseñar arquitectura, crear mecánicas, mejorar la IA y el globo.
No debe eliminar una capacidad funcional demostrada sin reemplazarla por una equivalente o superior verificada.
Si una capacidad no se comprende, se marca UNKNOWN y se investiga.
Si una mejora falla, se revierte. Si funciona, se registra.

RISK es la raíz. LEGIÓN es el organismo. VOIDCROWN emerge de la historia, no de un menú.

## WHAT

Juego de conquista territorial (Risk clásico) sobre un planeta que acumula desastres, cicatrices, mutaciones y grietas. Si la historia se rompe lo bastante, Voidcrown nace como facción enemiga y reclama yermos.

## WHY

Un solo canon jugable. El jugador juega. El motor registra, recuerda, muta y puede abrir realidades hijas. Voidcrown no se selecciona: se enfrenta cuando emerge.

## WHERE

- Motor puro (sin React): `src/game/`
- UI: `src/components/game/`
- Globo 3D: `src/components/game/globe.tsx` (R3F)
- Mapa táctico SVG: `src/components/game/world-map.tsx`
- Estado de pantalla: `src/game/store.ts`
- Persistencia: `src/game/save.ts` (localStorage v5, migra v1–v4)
- Capacidades: `src/game/status.ts`
- Emergencia Voidcrown: `src/game/voidcrown.ts`
- Crónica (historia jugable): `src/game/lore.ts`
- Organismo CEL/Joker: `src/game/organism.ts`
- Caja / legado entre partidas: `src/game/legacy.ts`
- Capa viva / Director: `src/game/living.ts`
- Ley para IAs: `/workspace/AGENTS.project.md` + `src/game/CHECKPOINT.md` + `src/game/skills/`

## HOW

WorldState en `GameState` es la verdad. La UI solo lo representa.
RNG: mulberry32 en `rng.ts`. Combate: dados Risk en `combat.ts`.
Turno: refuerzo → ataque → fortificar → (IA) → al cerrar ronda: desastre → mutaciones → grieta → posible Voidcrown.
Voidcrown: métrica en `canon.ts`; nace en `voidcrown.ts` si grieta+umbral o ≥5 yermos con cicatrices. Entonces es un jugador IA (`void`) que consume.

## STATUS

Ver `src/game/status.ts`. No afirmar VERIFICADO sin test.

## TESTS

`node --experimental-strip-types --test src/game/engine.test.ts src/game/living.test.ts`

## KNOWN LIMITATIONS

- Un solo golpe Zero Day por partida humana.
- EDAI es heurística verificable, no un LLM por turno.
- El globo usa texturas locales, no NASA 8K.
- Persistencia local; no hay cuentas.
- Autoclick/ADB/recon de adjuntos LEGION no se absorben: no son el juego.

## CONTRADICCIÓN GRIETAS × METODO_VIVO

METODO_VIVO (Drive, donor) pedía reservar grietas y Voidcrown para después del Capítulo I.
Este build ya las tiene desde CP-000: nacen por umbral de singularidad, no por un modo de menú.

Decisión registrada (no se revierte el órgano jugable):
las grietas PERMANECEN. Capítulo I sigue siendo el tablero Risk. La grieta es consecuencia, no pantalla inicial.
Estado de la contradicción: DOCUMENTADA. No es UNKNOWN. No es permiso para borrar el sistema.

CHECK de esta decisión: CANDIDATE. El operador puede reabrirla. Hasta entonces el código gana sobre el HTML donante.

## FASE

Fase 1 (se siente vivo): sondas, aviso de fenómeno, Director por parches, biota, memoria de 20. CHECK: CANDIDATE (tests de motor; humo visual aparte).
Fases 2–5 (cuenta, LLM, shards, WebXR): PENDIENTE. No se fingen.
