PROBLEMA: exit 2 se interpretó como instalación fallida.
CAUSA: `veterano` sin argumentos devolvía 2 = uso inválido, no fallo de install.
CORRECCIÓN: No declarar ERROR de instalación solo por código de salida. Identificar la operación.
PRUEBA: No se ejecutó el binario `veterano` en este entorno — UNKNOWN si el binario existe aquí.
RESULTADO: Experiencia registrada. Código de salida ≠ diagnóstico.
REGLA REUTILIZABLE: CÓDIGO DE SALIDA ≠ DIAGNÓSTICO.
