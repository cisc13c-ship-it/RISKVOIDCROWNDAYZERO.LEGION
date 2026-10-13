# living-layer

WHAT
Biota por territorio (6 ejes), sondas, fenómeno clicable, Director por MutationPatch, memoria de 20 partidas.

WHY
Fase 1: el mundo se siente vivo sin recompilar y sin borrar Risk ni las grietas.

HOW
`src/game/living.ts`. `bootLiving` en `newGame`. `selectByCatastrophe` dentro de `strikeTerritory`. `directorTick` al cerrar la ronda. `probeTerritory` / `focusPhenomenon` desde la UI.
Doctrina: NORMAL, AUSTERIDAD (+1 refuerzo humano), RESCATE (−1 daño de desastre en tierra humana).
Tope de retención: 20. Claves `rzd-retention-v1` y `rzd-mind-v1`. No sustituyen el save `rzd-save-v5`.

TEST
`node --experimental-strip-types --test src/game/living.test.ts`

UNKNOWN
Director LLM (Fase 3). Cuenta entre dispositivos (Fase 2). No declarar VERIFICADO el “se siente vivo” sin ojo humano en el globo.
