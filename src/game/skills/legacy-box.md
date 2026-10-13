# legacy-box

WHAT: Al terminar una partida, una cicatriz queda sellada. La siguiente partida humana la hereda.

WHY: Canon Drive *VOIDCROWN_METODO_VIVO* / narración viva — Capítulo I: el tablero se guarda pero el mundo no olvida. El Viejo narró esto. Se construye esto, no el resto.

HOW:
- `sealLegacy` en game over (antes de borrar el save).
- `newGame({ inherit: true })` desde el menú.
- Simulación, replay y tests usan `inherit: false` para no contaminar seeds.

TEST: `engine.test.ts` «la caja hereda una cicatriz a la siguiente partida»

UNKNOWN: No hay persistencia cross-device. localStorage de esta sesión solamente.
