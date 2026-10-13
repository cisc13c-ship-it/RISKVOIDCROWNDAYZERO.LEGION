# SKILLS — registro compartido entre IAs

Si desarrollas una habilidad nueva para este juego: **escríbela aquí y en un `.md` de esta carpeta.**
El siguiente agente debe poder usarla sin que se lo expliques otra vez.

Las skills de plataforma (Grok Build) viven en `.grok/skills/`. No las copies enteras: **apunta y resume el contrato**.

---

## Plataforma (ya existen — úsalas, no reinventes)

| Skill | Contrato | Cuándo |
|---|---|---|
| `building-games` | Loop, dt, 3D +Y-up, juice separado del sim | Cualquier cambio de gameplay / globo |
| `design-ui` | Tokens, anti-slop, overlays, no magenta/emoji | HUD, título, modales |
| `threejs` | R3F + drei, dispose GPU, no foto como mesh | Globo, VFX |
| `og` | `public/og.jpg` 1200×630, `site.json` type `x:game` | Marca / share card |
| `game-asset-core` | Arte 2D verificable | Sprites / desastres |
| `controls` | A=izquierda (vehículos) | No aplica a Risk de mesa; no inventar WASD |
| `multiplayer-p2p` | Solo si se pide co-op | No por defecto |
| `auth` / `neon` | OFF en este proyecto | No encender |

## Skills del organismo (este juego)

| Skill | Archivo | Contrato |
|---|---|---|
| `canon-continuity` | `../CANON.md` | RISK raíz. Voidcrown emerge. No borrar órganos verificados. |
| `checkpoint` | `../CHECKPOINT.md` | Toda mutación de peso deja fila. |
| `chronicle` | `../lore.ts` | Historia = capítulos con `when`. Se gana jugando. |
| `voidcrown-emergence` | `../voidcrown.ts` | Nace de grieta+umbral o 5 yermos. Es facción IA. |
| `mutation-pipeline` | `../mutations.ts` | Candidata → test → adopt/rollback. Nunca idea→canon. |
| `absorb-drive` | este archivo | Indexar Drive. Absorber **juego/historia**. Rechazar clickers, ADB, secretos. |
| `organism-cycle` | `organism.md` | CEL observa, Mutante propone (mutations.ts), Lab simula, Joker contradice, Fitness mide. Nunca Mutante→Canon. |
| `legacy-box` | `legacy-box.md` | Una cicatriz sobrevive al fin de partida. inherit=true solo desde el menú humano. |
| `living-layer` | `living-layer.md` | Biota 6 ejes, sondas, Director por parche, 20 partidas. No recompila. No borra grietas. |

## Cómo registrar una skill nueva

1. Crear `src/game/skills/<id>.md` con: WHAT / WHY / HOW / TEST / UNKNOWN.
2. Añadir fila a esta tabla.
3. Checkpoint en `CHECKPOINT.md`.
4. Si cambia el motor, test en `engine.test.ts`.

Si no lo registras, **no existe para la siguiente IA.**
