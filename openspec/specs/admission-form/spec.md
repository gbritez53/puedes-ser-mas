# admission-form Specification

## Purpose

The admission form collects lead evaluation data in a single step matching the designer brief: Nombre Completo, WhatsApp, desafío principal, and motivación para ser seleccionado. The `email` and `diplomado` select fields are removed from the UI; the backend derives `diplomado` from `desafio_principal`. Persistence, honeypot, and rate-limit protections remain intact.

## Requirements

### Requirement: Single-Step Evaluation Form

The admission form MUST render as a SINGLE step containing exactly four control groups: "Nombre completo" (text input), "WhatsApp" (tel input), "¿Cuál es tu desafío principal hoy?" (select), and "¿Por qué consideras que debes ser seleccionado?" (textarea). The select MUST contain a disabled placeholder "Selecciona tu desafío..." and EXACTLY three selectable options: "Mentalidad y Liderazgo", "Comunicación y Exposición", "Ambos".

The form MUST NOT render an email input nor a diplomado/path select, and MUST NOT render any option or field for "Coaching Cristiano". The submit CTA MUST be `EVALUAR MI PERFIL DE ADMISIÓN` (submitting state `EVALUANDO...`).

- GIVEN the admission form is rendered
- WHEN inspecting its controls
- THEN it MUST render a single form with fields Nombre completo, WhatsApp, desafío principal select (3 options), and motivo textarea, plus the CTA `EVALUAR MI PERFIL DE ADMISIÓN`.

### Requirement: Client-Side Fluid Validation

The form MUST validate each field against the Zod schema before submission: name (min 2 chars, max 120), phone/WhatsApp (min 8, max 32), `desafioPrincipal` (enum mentalidad/comunicacion/ambos), and `porQueSerSeleccionado` (min 10, max 1000). On invalid input the field MUST show an inline error and the form MUST NOT submit.

- GIVEN a user submits with an empty desafío principal selection
- WHEN the submit is attempted
- THEN an inline error MUST be shown for the select and no request MUST be sent to `/api/admission`.

### Requirement: Submission via POST to /api/admission

The form MUST submit via a POST request with `Content-Type: application/json` to `/api/admission`. A successful response MUST render a success/confirmation state; HTTP 429 MUST render a rate-limit message; HTTP 422 MUST render the first Zod issue message; network/other failures MUST render an error state with retry.

- GIVEN a valid form submission
- WHEN the user submits
- THEN a POST to `/api/admission` MUST be sent with body fields `name`, `phone`, `desafioPrincipal`, `porQueSerSeleccionado`, and `honeypot`.

- GIVEN the API responds 429
- WHEN the response is handled
- THEN a rate-limit message MUST be shown and the user MUST be able to retry.

### Requirement: Honeypot Protection

The form MUST render a hidden honeypot input (invisible, `tabIndex=-1`, `aria-hidden`). Its value MUST be transmitted as `honeypot` and MUST be empty for legitimate submissions.

- GIVEN an automated bot fills the hidden honeypot field
- WHEN the user submits
- THEN the validation MUST reject the request (422) without persisting any row.

### Requirement: Server Validation and Persistence

The `/api/admission` endpoint MUST validate the submitted body against the updated `admissionSchema`, enforce rate limiting per IP, and persist a row to the Turso `admissions` table via Drizzle with columns `name`, `phone`, `diplomado` (derived), `desafio_principal`, `por_que_ser_seleccionado`, `ip_hash`, and `user_agent`, returning 201 with the new row id. Email duplicate rejection MUST be removed (email is no longer collected). The `diplomado` column MUST be derived: mentalidad→liderazgo, comunicacion→comunicacion, ambos→ambos.

- GIVEN a POST with valid body `{ name, phone, desafioPrincipal: 'ambos', porQueSerSeleccionado: '...', honeypot: '' }`
- WHEN the request passes rate-limit
- THEN a row MUST be inserted into `admissions` with `diplomado: 'ambos'` and the endpoint MUST return 201 with the inserted id.

- GIVEN a client IP that has exceeded the per-hour limit
- WHEN the endpoint receives a new request
- THEN it MUST return 429.

- GIVEN a POST body with an invalid `desafioPrincipal` or too-short motivo
- WHEN the endpoint validates it
- THEN it MUST return 422 with Zod issues and MUST NOT insert a row.

### Requirement: Database Schema

The `admissions` table MUST include columns `name` (NOT NULL), `email` (nullable — no longer collected, preserved for historical rows), `phone` (NOT NULL), `diplomado` (NOT NULL, derived), `desafio_principal` (NOT NULL), `por_que_ser_seleccionado` (NOT NULL), `ip_hash`, `user_agent`, `created_at`. The migration MUST be additive and reversible; new NOT NULL columns MUST carry a default to satisfy SQLite on tables with existing rows.

- GIVEN an existing `admissions` table containing rows
- WHEN the schema migration is applied
- THEN the existing `name`, `phone`, `email` values MUST be preserved and the new columns MUST be available for new writes.

### Requirement: Lint Verification

The change MUST pass `pnpm lint` (and Prettier/ESLint via Husky on commit) and MUST render correctly on the local dev server. The project forbids `pnpm build` as a verification step, so no build-required check applies.

- GIVEN the code changes are complete
- WHEN `pnpm lint` runs
- THEN it MUST pass with no errors.
