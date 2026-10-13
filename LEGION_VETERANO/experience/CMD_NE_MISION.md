PROBLEMA: Cada comando generaba un MISSION_ID distinto.
CAUSA: El instalador MVP 0.1 trataba cada invocación como misión nueva.
CORRECCIÓN: `LEGION_VETERANO/state/mission.json` fija un ID por ciclo.
PRUEBA: Este ciclo usa VET-20261005-VOIDCROWN-FUSION-01 en init/inspect/build/test/handoff.
RESULTADO: PENDIENTE DE CHECK — el archivo existe; no hay CLI `veterano` que reejecutar.
REGLA REUTILIZABLE: COMANDO ≠ MISIÓN. Una misión necesita identidad persistente.
