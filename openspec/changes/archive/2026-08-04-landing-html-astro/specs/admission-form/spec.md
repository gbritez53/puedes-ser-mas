# Delta for admission-form

## Context

The admission form previously collected multi-step data (personal, professional, motivation) for a single product with a `cohort`. This change adapts it to a single-step form matching the reference HTML: Nombre Completo, Correo Electrónico, WhatsApp, and a `select` "Elige tu camino" with exactly two options. The `cohort`/`profession`/`motivation` fields are replaced by a diplomado/path field. Persistence, honeypot, rate-limit, and duplicate-email protections remain intact.

## MODIFIED Requirements

### Requirement: Single-Step Form with Two-Option Select

The admission form MUST render as a SINGLE step containing exactly four control groups: "Nombre Completo" (text input), "Correo Electrónico" (email input), "WhatsApp" (tel input), and a `select` labeled "Elige tu camino". The select MUST contain a disabled placeholder "Selecciona un diplomado..." and EXACTLY two selectable options: "Coaching y Liderazgo" and "Comunicación y Oratoria". It MUST NOT render the previous multi-step UI (personal→professional→motivation→confirmation) nor any progress indicator.

The form MUST NOT render any option or field for "Coaching Cristiano".

(Previously: four-step wizard with separate personal, professional, and motivation steps plus a fixed cohort; no single-step select.)

- GIVEN the admission form is rendered
- WHEN inspecting its controls
- THEN it MUST render a single form with fields Nombre Completo, Correo Electrónico, WhatsApp, and an "Elige tu camino" select whose selectable options are exactly "Coaching y Liderazgo" and "Comunicación y Oratoria".

- GIVEN the "Elige tu camino" select
- WHEN enumerating its options
- THEN it MUST NOT contain any "Coaching Cristiano" option.

### Requirement: Client-Side Fluid Validation

The form MUST validate each field against the Zod schema before submission: name (min 2 chars), email (valid format), WhatsApp/phone (min 8 chars, max 32), and a required `diplomado`/path selection. On invalid input the field MUST show an inline error and the form MUST NOT submit.

(Previously: step-scoped validation for name/email/phone on the personal step, then profession, then motivation.)

- GIVEN a user submits with an empty "Elige tu camino" selection
- WHEN the submit is attempted
- THEN an inline error MUST be shown for the select and no request MUST be sent to `/api/admission`.

### Requirement: Submission via POST to /api/admission

The form MUST submit via a POST request with `Content-Type: application/json` to `/api/admission`. A successful response MUST render a success/confirmation state; HTTP 429 MUST render a rate-limit message; HTTP 422 MUST render the first Zod issue message; network/other failures MUST render an error state with retry.

(Previously: the same fetch contract but the payload carried profession/motivation/cohort.)

- GIVEN a valid form submission
- WHEN the user submits
- THEN a POST to `/api/admission` MUST be sent with body fields `name`, `email`, `phone`, `diplomado`, and `honeypot`.

- GIVEN the API responds 429
- WHEN the response is handled
- THEN a rate-limit message MUST be shown and the user MUST be able to retry.

### Requirement: Honeypot Protection

The form MUST render a hidden honeypot input (invisible, `tabIndex=-1`, `aria-hidden`). Its value MUST be transmitted as `honeypot` and MUST be empty for legitimate submissions.

(Previously: identical honeypot behavior.)

- GIVEN an automated bot fills the hidden honeypot field
- WHEN the user submits
- THEN the server MUST silently accept the request (HTTP 200) without persisting any row.

### Requirement: Server Validation and Persistence

The `/api/admission` endpoint MUST validate the submitted body against the updated `admissionSchema`, enforce rate limiting per IP, reject duplicate emails (400 "Este email ya fue registrado."), and persist a row to the Turso `admissions` table via Drizzle with columns `name`, `email`, `phone`, `diplomado`, `ip_hash`, and `user_agent`, returning 201 with the new row id.

(Previously: schema required profession, motivation, and cohort and persisted those columns.)

- GIVEN a POST with valid body `{ name, email, phone, diplomado: 'liderazgo', honeypot: '' }`
- WHEN the request passes rate-limit and duplicate checks
- THEN a row MUST be inserted into `admissions` with the `diplomado` value and the endpoint MUST return 201 with the inserted id.

- GIVEN a POST with an email already present in `admissions`
- WHEN the endpoint processes it
- THEN it MUST return 400 with message "Este email ya fue registrado." and MUST NOT insert a row.

- GIVEN a client IP that has exceeded the per-hour limit
- WHEN the endpoint receives a new request
- THEN it MUST return 429.

- GIVEN a POST body with an invalid/empty `diplomado` or malformed email
- WHEN the endpoint validates it
- THEN it MUST return 422 with Zod issues and MUST NOT insert a row.

### Requirement: Database Schema Update

The `admissions` table schema MUST replace `profession`, `motivation`, and `cohort` with a single `diplomado`/path column while keeping `name`, `email`, `phone`, `ip_hash`, `user_agent`, `created_at`, and the unique `email` index. The migration against an existing deployment with live data SHOULD be additive (add the new `diplomado` column) to avoid destructive data loss; any drop of `profession`/`motivation`/`cohort` MUST be reversible. The `index.astro`/API insert MUST write the new column and MUST NOT reference the removed columns.

(Previously: the table had non-null `profession`, `motivation`, and `cohort` columns populated on insert.)

- GIVEN an existing `admissions` table containing rows with `profession`/`motivation`/`cohort`
- WHEN the schema migration is applied
- THEN the `name`, `email`, and `phone` values for existing rows MUST be preserved and a new `diplomado` column MUST be available for new writes.

### Requirement: Lint + Dev-Server Verification

The change MUST pass `pnpm lint` (and Prettier/ESLint via Husky on commit) and MUST render correctly on the local dev server. The project forbids `pnpm build` as a verification step, so no build-required check applies.

- GIVEN the code changes are complete
- WHEN `pnpm lint` runs
- THEN it MUST pass with no errors.
