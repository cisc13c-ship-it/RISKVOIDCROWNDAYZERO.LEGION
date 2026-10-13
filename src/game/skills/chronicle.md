# Skill — chronicle

## WHAT

La historia del Risk se revela al jugar, no al leer un menú.

## WHY

El operador cuenta. El juego convierte. El jugador descubre.

## HOW

Capítulos en `lore.ts` con `id`, `title`, `body`, `when(state)`.
`unlockChronicle(state)` recorre capítulos y abre los que cumplan.
La UI (`chronicle.tsx`) solo lista los **abiertos**.

No pegar lore en el HUD de combate. Un botón de crónica basta.

## TEST

`engine.test.ts` — génesis abre `genesis`; forzar grieta/void abre sus capítulos.

## UNKNOWN

Capítulos futuros los dicta el operador. No inventar biografías de facciones que él no haya contado.
