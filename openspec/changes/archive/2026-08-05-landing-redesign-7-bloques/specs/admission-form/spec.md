# Spec: Formulario de Admisión (Delta — Nuevos Campos de Evaluación)

> Delta spec para el change `landing-redesign-7-bloques`. Reformula el formulario de admisión: nuevos campos de evaluación, se elimina email y select de diplomado del UI. Palabras clave RFC 2119: MUST / SHOULD / MAY.

## F1. Formulario (`src/components/islands/AdmissionForm.tsx`)

### F1.1 Campos

- MUST mostrar los siguientes campos:
  1. `Nombre completo` — input texto obligatorio.
  2. `WhatsApp` — input teléfono obligatorio.
  3. `¿Cuál es tu desafío principal hoy?` — select obligatorio con 3 opciones:
     - `Mentalidad y Liderazgo`
     - `Comunicación y Exposición`
     - `Ambos`
  4. `¿Por qué consideras que debes ser seleccionado?` — textarea obligatorio.
  5. `honeypot` — campo oculto anti-spam (sin cambiar el comportamiento actual).
- MUST eliminar del UI: el input `email` y el select `Elige tu camino` (diplomado).
- SHOULD mantener la estructura de un solo paso (single-step) existente.
- MUST mostrar el CTA: `EVALUAR MI PERFIL DE ADMISIÓN` (estado submitting: `EVALUANDO...` o equivalente).

### F1.2 Validación cliente

- MUST validar en cliente con zod antes del submit:
  - `name`: min 2, max 120.
  - `phone`: min 8, max 32.
  - `desafioPrincipal`: enum `['mentalidad', 'comunicacion', 'ambos']`.
  - `porQueSerSeleccionado`: min 10, max 1000.
  - `honeypot`: vacío.
- MUST mostrar errores inline por campo (patrón actual).

## F2. API (`src/pages/api/admission.ts`)

### F2.1 Body

- MUST aceptar POST con body `{ name, phone, desafioPrincipal, porQueSerSeleccionado, honeypot }`.
- MUST devolver 201 al insertar correctamente.
- MUST mantener: rate-limit 429 (`checkRateLimit`), 422 en validación zod fallida, honeypot lleno → 200 silencioso.
- MUST eliminar el chequeo de email duplicado (400) dado que email ya no es obligatorio ni se recolecta.
- MUST derivar el valor de la columna `diplomado` a partir de `desafioPrincipal`:
  - `mentalidad` → `liderazgo`
  - `comunicacion` → `comunicacion`
  - `ambos` → `ambos` (nuevo valor permitido en el enum de la columna).

## F3. Base de datos (`src/db/schema.ts` + migración Drizzle)

### F3.1 Columnas nuevas

- MUST agregar a la tabla `admissions`:
  - `desafio_principal` — TEXT NOT NULL (valores: mentalidad/comunicacion/ambos).
  - `por_que_ser_seleccionado` — TEXT NOT NULL.
- MUST crear una migración Drizzle aditiva (nueva columna + alter) usando `pnpm db:generate`; no eliminar columnas existentes.

### F3.2 Email

- MUST cambiar `email` a nullable (`.text().notNull()` → `.text()`).
- SHOULD conservar la columna `email` en el esquema (sin UNIQUE) para no perder datos históricos; la inserción nueva omite email (null).

### F3.3 diplomado

- MUST ampliar los valores aceptados de `diplomado` para incluir `ambos` (además de `liderazgo`, `comunicacion`), o definir en el validator que `ambos` es válido.
- SHOULD mantener la columna como NOT NULL (siempre se deriva del desafío principal).

## F4. Validator (`src/lib/validators/admission.ts`)

- MUST definir `admissionSchema` con: `name`, `phone`, `desafioPrincipal` (enum), `porQueSerSeleccionado` (min 10), `honeypot` (optional, max 0).
- MUST quitar `email` y `diplomado` del schema del body (diplomado se deriva en el handler).

## F5. Espec maestra

- MUST actualizar `openspec/specs/admission-form/spec.md` para reflejar el nuevo shape del formulario y del body de la API.

## Casos de prueba

### FPT1. Envío válido

- Given el formulario con nombre, WhatsApp, desafío principal y motivo válidos, When se envía, Then POST `/api/admission` con `{name, phone, desafioPrincipal, porQueSerSeleccionado, honeypot: ''}` y devuelve 201.

### FPT2. Validación fallida

- Given el formulario sin nombre o sin motivo (menos de 10 chars), When se envía, Then se muestran errores inline y no se hace POST.

### FPT3. Sin email

- Given el formulario nuevo, When se inspecciona, Then no existe input de email ni select de diplomado en el UI.

### FPT4. Honeypot

- Given el honeypot lleno, When se envía, Then la API responde 200 silencioso y no inserta.

### FPT5. Migración

- Given `pnpm db:generate` y `pnpm db:migrate` aplicados, When se inspecciona el esquema, Then `admissions` tiene `desafio_principal`, `por_que_ser_seleccionado` y `email` nullable.
