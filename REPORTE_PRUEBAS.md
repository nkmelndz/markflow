# Reporte de ejecución y resultados de pruebas

## Datos generales de ejecución

- Fecha de ejecución: **2026-04-21**
- Framework: **Vitest**
- Comando ejecutado:

```bash
npm run test -- src/modules/editor/hooks/rateLimitUtils.test.ts src/app/api/generate/route.test.ts
```

---

## Caso de uso 1: Generación asistida por IA (`POST /api/generate`)

### Ejecución

- Archivo ejecutado: `src/app/api/generate/route.test.ts`
- Total de pruebas del caso: **3**

### Reporte de prueba unitaria

- Prueba: `valida correctamente la instrucción`
- Validación:
  - `hasValidInstruction('Genera un resumen')` => `true`
  - `hasValidInstruction('   ')` => `false`
  - `hasValidInstruction(undefined)` => `false`
- Resultado: **Aprobada (1/1)**

### Reporte de pruebas de integración

1. Prueba: `retorna 400 cuando instruction no está presente`
   - Resultado esperado: estado `400` y `{ error: 'Instruction is required' }`
   - Resultado obtenido: **Aprobada**
2. Prueba: `retorna mensaje controlado cuando no existe GEMINI_API_KEY`
   - Resultado esperado: estado `200` y mensaje controlado de configuración faltante
   - Resultado obtenido: **Aprobada**

- Resultado integración del caso: **Aprobadas (2/2)**
- Resultado total del caso: **Aprobadas (3/3)**

---

## Caso de uso 2: Control de límite diario de solicitudes IA

### Ejecución

- Archivo ejecutado: `src/modules/editor/hooks/rateLimitUtils.test.ts`
- Total de pruebas del caso: **3**

### Reporte de pruebas unitarias

1. Prueba: `calcula solicitudes restantes y permisos correctamente`
   - Verifica cálculo de remanente y bloqueo al alcanzar el máximo diario.
   - Resultado obtenido: **Aprobada**
2. Prueba: `reinicia conteo cuando la fecha almacenada no coincide`
   - Verifica reinicio de conteo al cambiar la fecha.
   - Resultado obtenido: **Aprobada**

- Resultado unitario del caso: **Aprobadas (2/2)**

### Reporte de prueba de integración

- Prueba: `simula flujo de lectura + incremento + cálculo de restantes`
- Verifica flujo completo: lectura de estado, incremento y cálculo de solicitudes restantes.
- Resultado obtenido: **Aprobada (1/1)**

- Resultado total del caso: **Aprobadas (3/3)**

---

## Pruebas manuales por caso de uso

### Caso de uso 1: Generación asistida por IA (`POST /api/generate`)

#### Ejecución manual

- Entorno: aplicación levantada con `npm run dev` en `http://localhost:3000`
- Flujo ejecutado:
  1. Abrir panel de IA.
  2. Enviar instrucción con contenido cargado.
  3. Repetir prueba sin `GEMINI_API_KEY` en `.env.local`.

#### Reporte manual de prueba unitaria

- Validación manual de entrada (`instruction`):
  - Entrada válida con texto útil: **Aprobada**
  - Entrada vacía/espacios: **Aprobada** (se rechaza)
- Resultado unitario manual del caso: **Aprobadas (2/2)**

#### Reporte manual de prueba de integración

- Flujo API/UI completo con instrucción y contexto: **Aprobada**
- Flujo controlado sin `GEMINI_API_KEY` con mensaje esperado: **Aprobada**
- Resultado integración manual del caso: **Aprobadas (2/2)**
- Resultado total manual del caso: **Aprobadas (4/4)**

---

### Caso de uso 2: Control de límite diario de solicitudes IA

#### Ejecución manual

- Entorno: aplicación levantada con `npm run dev` en `http://localhost:3000`
- Flujo ejecutado:
  1. Realizar solicitudes IA consecutivas.
  2. Verificar decremento del contador por solicitud.
  3. Alcanzar límite y comprobar bloqueo.
  4. Simular cambio de día con `localStorage` (`markflow_ai_usage`) y validar reinicio.

#### Reporte manual de prueba unitaria

- Validación visual del contador por operación individual: **Aprobada**
- Validación manual de estado al llegar al límite diario: **Aprobada**
- Resultado unitario manual del caso: **Aprobadas (2/2)**

#### Reporte manual de prueba de integración

- Flujo completo de consumo hasta bloqueo: **Aprobada**
- Flujo de reinicio por cambio de día y nuevo permiso de uso: **Aprobada**
- Resultado integración manual del caso: **Aprobadas (2/2)**
- Resultado total manual del caso: **Aprobadas (4/4)**

---

## Resumen consolidado

- Casos de uso validados (automáticas): **2**
- Total de pruebas automáticas ejecutadas: **6**
- Pruebas automáticas aprobadas: **6**
- Casos de uso validados (manuales): **2**
- Total de verificaciones manuales ejecutadas: **8**
- Verificaciones manuales aprobadas: **8**
- Pruebas fallidas: **0**
- Estado final: **Exitoso**
