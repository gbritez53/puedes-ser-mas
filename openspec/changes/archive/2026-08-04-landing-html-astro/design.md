# Technical Design: landing-html-astro (Landing HTML → Astro, 2 diplomados)

## 1. Architecture Decision (replace vs reuse blocks)

**Decision: NARROW REUSE + FULL REWRITE of the page composition.** The existing multi-block landing
(8 sections) does not match the reference HTML's structure, so the page is **recomposed** from the
block catalog while individual blocks are **rewritten** to mirror the reference. We do NOT attempt a
1:1 section remap of old blocks because the reference has different sections (nav, hero, 2-card grid,
lead form, footer) with different copy and images.

Concretely:

- **Reused as-is (no changes):** the `AdmissionForm` fetch contract (POST `/api/admission`, honeypot,
  429/422/500 handling), `rate-limit.ts`, `db/client.ts`, `Container.astro`, `Button.astro`,
  `SectionTitle.astro`. The form island is rewritten but keeps the same API contract.
- **Rewritten (new content):** `HeroBlock`, `FooterBlock`, `AdmissionBlock`.
- **New blocks:** `NavigationBlock.astro` (sticky nav) and `DiplomadosGrid.astro` (the 2-card grid).
- **Dropped (removed from composition):** `PainAgitatorBlock`, `RevelationBlock`, `CurriculumBlock`,
  `ExclusiveFilterBlock`, `AuthorityBlock`, `OfferStackBlock`, plus the curriculum islands
  `StepPersonal`, `StepProfessional`, `StepMotivation`, `StepConfirmation`, `ClassItem`,
  `CurriculumAccordion`, `ModulePanel` (the multi-step wizard dies).

**Why reuse over full replacement:** The reference relies on Tailwind's runtime CDN
(`cdn.tailwindcss.com`), which is prohibited (CSS-first only, no legacy JS config). We translate the
reference's Material/MDC extended color palette into Tailwind v4 `@theme` tokens and hand-write the
equivalent markup as Astro blocks + a React island. The persistence layer (Turso/Drizzle/Zod) already
exists and is production-tested; we adapt it additively rather than rebuild it.

## 2. Component Mapping

Reference HTML section → Astro file → action.

| Reference HTML element         | Astro file                                                                | Action                |
| ------------------------------ | ------------------------------------------------------------------------- | --------------------- |
| `TopNavBar` (sticky nav)       | `src/components/blocks/NavigationBlock.astro`                             | create                |
| Hero section                   | `src/components/blocks/HeroBlock.astro`                                   | rewrite               |
| `#diplomados` grid (cards 1+2) | `src/components/blocks/DiplomadosGrid.astro`                              | create                |
| `#diplomados` single card      | `src/components/blocks/DiplomadoCard.astro`                               | create (shared)       |
| `#registro` form section       | `src/components/blocks/AdmissionBlock.astro`                              | rewrite               |
| Admission form (React island)  | `src/components/islands/AdmissionForm.tsx`                                | rewrite (single-step) |
| Footer                         | `src/components/blocks/FooterBlock.astro`                                 | rewrite               |
| Page composition               | `src/pages/index.astro`                                                   | rewrite               |
| Layout / meta / fonts          | `src/layouts/BaseLayout.astro`                                            | modify                |
| Styles / tokens                | `src/styles/global.css`                                                   | modify                |
| — (no HTML equivalent)         | `src/components/ui/Container.astro`, `Button.astro`, `SectionTitle.astro` | reuse                 |

**Deleted:** `PainAgitatorBlock.astro`, `RevelationBlock.astro`, `CurriculumBlock.astro`,
`ExclusiveFilterBlock.astro`, `AuthorityBlock.astro`, `OfferStackBlock.astro`, and all Step/Class/
Module islands under `src/components/islands/`.

`DiplomadoCard.astro` is a **static** component (no React) receiving props
(`chip`, `title`, `description`, `features: string[]`, `cta`, `imageUrl`) and is rendered twice by
`DiplomadosGrid.astro`. It carries the Progress Blue border (token `--color-accent`), `--color-surface`
card background, Google-hosted header image, chip, feature list with red `check_circle` icons, and the
Energy Red outline CTA.

`DiplomadosGrid.astro` renders the section wrapper with the "TRANSFORMA TU VIDA: ELIGE TU CAMINO"
heading, the red divider, and a responsive `grid grid-cols-1 md:grid-cols-2 gap-6`. The reference used
3 columns because of the removed Christian card; we use **2** to center exactly two cards.

## 3. Design Tokens Plan (`@theme` in `src/styles/global.css`)

Tailwind v4 CSS-first — tokens defined via `@theme`, no `tailwind.config.js`.

### Color tokens

| Token                    | value     | Source (reference)                  | Use                          |
| ------------------------ | --------- | ----------------------------------- | ---------------------------- |
| `--color-bg`             | `#000000` | `body { background-color:#000000 }` | page background              |
| `--color-surface`        | `#121212` | card `bg-[#121212]`                 | cards, form panel            |
| `--color-surface-lowest` | `#0e0e0e` | `surface-container-lowest`          | `#registro` band / footer bg |
| `--color-cta`            | `#D32F2F` | `primary-container`, `.btn-primary` | CTA bg, accents, red spans   |
| `--color-cta-hover`      | `#b02626` | derived darken of `#D32F2F`         | CTA hover                    |
| `--color-accent`         | `#005db7` | `secondary-container`               | card border, chip highlight  |
| `--color-accent-soft`    | `#7bd1f8` | `tertiary`                          | chip text, link hover        |
| `--color-text`           | `#ffffff` | `body{color:#FFFFFF}`               | headings / primary text      |
| `--color-text-muted`     | `#e5e2e1` | `on-surface` / `on-background`      | body copy                    |
| `--color-text-variant`   | `#e4beba` | `on-surface-variant`                | muted / footer links         |
| `--color-line`           | `#353534` | `outline-variant`                   | borders, dividers            |

Old tokens changed: `--color-cta` `#c41718`→`#D32F2F`; `--color-cta-hover` `#a01313`→`#b02626`;
`--color-accent` `#1f3c87`→`#005db7`; `--color-surface` `#0a0a0a`→`#121212`;
`--color-text-muted` `#b8b8b8`→`#e5e2e1`. Added: `--color-surface-lowest`, `--color-accent-soft`,
`--color-text-variant`.

All blocks referencing the old tokens (`var(--color-cta)`, `var(--color-accent)`) are updated; any
hard-coded `#C41718` / `#1F3C87` still present is swept to the new tokens.

### Typography tokens

| Token            | value                                 | Use                                    |
| ---------------- | ------------------------------------- | -------------------------------------- |
| `--font-heading` | `'Bebas Neue', 'Impact', sans-serif`  | h1/h2, headline, buttons `headline-md` |
| `--font-body`    | `'Montserrat', system-ui, sans-serif` | body, subtitles, labels                |

Text-size tokens: `--text-hero: clamp(3.5rem, 8vw, 4.5rem)` (reference `display-xl` 72px); keep
`--text-section`, `--text-body`, `--space-block`, `--ease-out`; update `--radius-card` to `0.5rem`
(reference `rounded-xl`) as needed.

### Material Symbols (Google Fonts CDN)

The reference uses `material-symbols-outlined` for the hero arrow (`arrow_forward`) and card
checkmarks (`check_circle`). We add the Material Symbols stylesheet to `BaseLayout` and keep the
`material-symbols-outlined` class in the blocks that need icons. Usage stays lightweight and matches
the reference.

## 4. Admission Form Architecture (single-step)

### Form (React island)

`AdmissionForm.tsx` is rewritten from a 4-step wizard to a **single-step** form. State collapses to a
single `values` object plus `status` (`idle | submitting | success | error`) and `serverError`; the
step machine, progress indicator, and per-step validators are removed. Step islands
(`StepPersonal/StepProfessional/StepMotivation/StepConfirmation`) are deleted; the success/error
confirmation UI is rendered inline in the island.

Fields (exactly four, mirroring the reference):

- `name` — "Nombre Completo", text input.
- `email` — "Correo Electrónico", email input.
- `phone` — "WhatsApp", tel input.
- `diplomado` — select "Elige tu camino", with disabled placeholder
  `"Selecciona un diplomado..."` and exactly two options: `"liderazgo"` → "Coaching y Liderazgo" and
  `"comunicacion"` → "Comunicación y Oratoria". **No** "Coaching Cristiano" option, no `fe` value.

The hidden honeypot input is preserved (invisible, `tabIndex=-1`, `aria-hidden`, transmitted as
`honeypot`). `validateStep` is replaced by a whole-form validation that parses:
`{ name, email, phone, diplomado, honeypot }` against the schema and shows inline errors under each
field (the select shows an error when empty and does not submit).

Submit builds the payload and POSTs JSON to `/api/admission`; success renders a confirmation state;
429 → rate-limit message with retry; 422 → first Zod issue message; other/network errors → error state
with retry.

### Zod schema (`src/lib/validators/admission.ts`)

`profession`, `motivation`, `cohort` are removed; `diplomado` is added:

```ts
export const admissionSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(120),
  email: z.string().email('El email no es válido').max(160),
  phone: z.string().min(8, 'El teléfono debe tener al menos 8 caracteres').max(32),
  diplomado: z.enum(['liderazgo', 'comunicacion'], {
    message: 'Seleccioná un diplomado válido',
  }),
  honeypot: z.string().max(0).optional(), // filled = bot
});
```

`AdmissionInput` and `AdmissionFieldErrors` keep their roles.

### API (`src/pages/api/admission.ts`)

The handler logic is unchanged (rate-limit → parse → validate → honeypot silent-reject →
duplicate-email → insert). The insert `.values(...)` block changes from
`profession/motivation/cohort` to `diplomado: parsed.data.diplomado`. Status handling for
429 / 422 / 400 duplicate / 201 success is preserved verbatim.

### Database (`src/db/schema.ts`)

`admissions` table: drop `profession`, `motivation`, `cohort`; add `diplomado`:

```ts
export const admissions = sqliteTable('admissions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone').notNull(),
  diplomado: text('diplomado').notNull(),
  ipHash: text('ip_hash'),
  userAgent: text('user_agent'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});
```

### Migration strategy

The drizzle-kit generated SQL migration adds the additive `diplomado` column so existing rows are
preserved (`name/email/phone` intact). Apply with:

```
pnpm drizzle-kit generate
pnpm drizzle-kit push
```

The drop of `profession/motivation/cohort` is documented as reversible (additive re-add if a rollback
is ever needed); per the rollback plan no destructive data migration is forced on live rows.

## 5. Data & Images (Google URLs verbatim)

All images stay Google-hosted (scope: do not self-host). URLs taken verbatim from the reference:

| Asset                            | URL (verbatim)                                                                                                                                                                                                                                                                                               | Used in                                           |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------- |
| Logo (nav + footer)              | `https://lh3.googleusercontent.com/aida-public/AB6AXuAbtU_j4-SfTTprsz0tbcXXbSzeeRp8E1bhzeufBq-cx62Ijgxj68DuxmropqVaThVGZgVwMVWmbzXYUTv7ZYvnSIKsjnHnyM8yDSEy_og7HYV4OQuEohGVR-uKDTCWsYCsfpo_KPPYwMwKKCaHkoQq4kOyphK6ZQisTM-aBl7bnsUwMlzNp1sRt1JPmT_nyJxaMHtwVl9xX0yPUNcp1xMT73oXNWGCOo2E0fX0UKgU2FOs1BV2ScZA` | `NavigationBlock`, `FooterBlock`                  |
| Hero background                  | `https://lh3.googleusercontent.com/aida-public/AB6AXuBhC4yVxkm_Zq3pBZWhaiUb6mpphk-gb4_hpgolEua4va0MGuc6rpygSW8B9-yTd1E9GZfQr96kgZEqc6xSnW5Eap3Hh1NF5HCzzwPEY8_W5edwaGIFDx9X6mJstI-sj0ycaVebH7ECZQ40LLEBzZYBdq4Doaxr6ePLK3iAbWw6pkfCYqkZxdLPFBcG5uj6Trlo8z4cXZ6SCMdq0ymSgKf7H6vLf6STthfTI1PZbJk65cNMNsCpxj7Y` | `HeroBlock` (object-cover, opacity-40 + gradient) |
| Card 1 — Coaching y Liderazgo    | `https://lh3.googleusercontent.com/aida-public/AB6AXuCqj0gK45PlfDDcvaVwgkqlAiHvAw4zfBEQJfO_C52zKM0i51dsURktZNz_LHr_P5euy9EvI1NHf-qTPXf7TuKbnCe5gqaNQ0cw8r3_n0lwBVEBv9nvWL4feFUKiabvTUY9aTDi_7ZxO0dBAJN8f_N5yDF7XEgZEVF1CFv6xGZbEPNrwexuAjIjFipaTMkz91BVPUBivZvkszSMlmuQA0zNtvCbDc155BFP6Q5oEItA9oJXEyNLjxUH` | `DiplomadoCard` (card 1)                          |
| Card 2 — Comunicación y Oratoria | `https://lh3.googleusercontent.com/aida-public/AB6AXuCyeBUeQqRkrWbYLJMle4kUuVYV3UFuTB7INSMsVnZKehMwC_RmAbKv7L9CQuleg5Sg357SWv_PQAhnXaNRIT2dPkiHtBkEEIaFzk4kctfoP_6V-MgMxjnolI2Z875DXsoo0aMFESSR6FrFLOf9ZyRNJTZc4B5XHVmuawXx7zDJvFbNay763g3OheRZD-o8GQDL2ziwerlsimOLQfdzsbp1AsdXkJEeslGjaaFPulXSkLws-XqIUgBh` | `DiplomadoCard` (card 2)                          |

**Card 3 (Coaching Cristiano) image is intentionally NOT used and its image file entry is dropped.**

Fonts come from Google Fonts (Bebas Neue + Montserrat, plus Material Symbols) via `BaseLayout` —
unchanged hosting model.

## 6. Content / Copy (exact Spanish copy from HTML)

### Sticky nav (`NavigationBlock`)

- Logo alt: `PUEDES SER MÁS Logo`.
- Links (uppercase, `#diplomados`, `#testimonios`, `#certificacion`, `#contacto`):
  `Diplomados`, `Testimonios`, `Certificación`, `Contacto`.
- CTA: `INSCRÍBETE HOY` → `#registro`.

### Hero (`HeroBlock`)

- Headline (uppercase, Bebas Neue, white; span in `#D32F2F`):
  `¡ROMPE TUS LÍMITES Y <span>DESATANCA TU POTENCIAL!</span>`
- Subtitle: `Descubre los 3 diplomados de transformación personal y profesional diseñados para
llevarte al siguiente nivel de liderazgo, fe y comunicación.`
  - **Copy decision:** per the exact-two scope ("no Coaching Cristiano anywhere"), the subtitle is
    adjusted to two diplomados and drops the `fe` reference:
    `Descubre los 2 diplomados de transformación personal y profesional diseñados para llevarte al
siguiente nivel de liderazgo y comunicación.`
- CTA: `¡DA EL PRIMER PASO AHORA!` + `arrow_forward` icon → `#registro`.

### Diplomados section (`DiplomadosGrid` + `DiplomadoCard`)

- Section heading: `TRANSFORMA TU VIDA: ELIGE TU CAMINO` with `w-24 h-1 bg-[#D32F2F]` divider.

Card 1 — **Coaching y Liderazgo** (`DiplomadoCard`):

- Chip: `Liderazgo`; title: `Diplomado en Coaching y Liderazgo`.
- Description: `Aprende a dirigirte a ti mismo para liderar a otros hacia el éxito.`
- Features: `Autodominio`, `Gestión emocional`, `Metas claras`, `Equipos de alto rendimiento`.
- CTA: `QUIERO LIDERAR` → `#registro`.

Card 2 — **Comunicación y Oratoria** (`DiplomadoCard`):

- Chip: `Comunicación`; title: `Diplomado en Comunicación y Oratoria`.
- Description: `Haz que tu voz se escuche con poder, aplomo e impacto.`
- Features: `Lenguaje corporal`, `Miedo escénico`, `Discursos memorables`.
- CTA: `QUIERO HABLAR CON IMPACTO` → `#registro`.

No Coaching Cristiano card or copy.

### Lead form section (`AdmissionBlock`, id `#registro`)

- Headline (display, red span): `¡SUPÉRATE SIEMPRE!` / `<span>REGÍSTRATE HOY</span>`.
- Paragraph: `Completa tus datos para recibir la información detallada de nuestros diplomados y
comenzar tu transformación.`
- Form panel (surface `#121212`, red blur orb): the four fields from section 4 and the submit button
  `¡QUIERO SER MÁS!`.

### Footer (`FooterBlock`)

- Logo, grayscale (`grayscale opacity-80`).
- Movement line (red span): `PUEDES SER MÁS es más que una marca: <span>es un movimiento.</span>`
- Links: `Política de Privacidad`, `Términos de Servicio`, `Cookies`.
- Copyright: `© {year} PUEDES SER MÁS. Todos los derechos reservados.`

## 7. BaseLayout / page meta updates

### `src/layouts/BaseLayout.astro` (modify)

- Add the Material Symbols Google Fonts stylesheet and preconnect (keep Bebas + Montserrat):
  `<link rel="stylesheet"
href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap">`.
- Update default fallback title/description to the multi-diplomado copy.
- Favicon stays `/assets/isotype.png` (unchanged; reference has no favicon link — minimal and safe).

### `src/pages/index.astro` (rewrite)

- Import `BaseLayout`, `NavigationBlock`, `HeroBlock`, `DiplomadosGrid`, `AdmissionBlock`,
  `FooterBlock` (drop the removed imports).
- Compose: `<NavigationBlock />` → `<main>` with `<HeroBlock />`, `<DiplomadosGrid />`,
  `<AdmissionBlock />` → `<FooterBlock />`.
- Meta props:
  - `title`: `PUEDES SER MÁS — Diplomados de Transformación Personal y Profesional`
  - `description`: short multi-diplomado copy (e.g. `Diplomados en Coaching y Liderazgo y en
Comunicación y Oratoria. Transformá tu vida: registrate hoy.`)
  - `ogImage` stays `/assets/logo.png`.

Anchor targets guaranteed present: `#diplomados` (grid), `#registro` (form). `#testimonios`,
`#certificacion`, `#contacto` anchors exist only as nav links (out of scope to build the sections),
matching the reference's pure anchor-only nav behavior.

## 8. File-by-file change list

| File                                                                                                                                                                               | Action  | Notes                                                                                                                                                    |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/styles/global.css`                                                                                                                                                            | modify  | `@theme` tokens → `#D32F2F`, `#005db7`, `#121212`, `#e5e2e1`, `#353534`, `#0e0e0e`, `#7bd1f8`, `#e4beba`; radius update; add Material Symbols usage note |
| `src/layouts/BaseLayout.astro`                                                                                                                                                     | modify  | Material Symbols stylesheet; fallback title/description                                                                                                  |
| `src/pages/index.astro`                                                                                                                                                            | rewrite | New composition (nav/hero/grid/form/footer) + meta                                                                                                       |
| `src/components/blocks/NavigationBlock.astro`                                                                                                                                      | create  | Sticky nav, logo, 4 anchors, CTA → `#registro`                                                                                                           |
| `src/components/blocks/HeroBlock.astro`                                                                                                                                            | rewrite | Hero bg img + gradient, headline, subtitle, CTA                                                                                                          |
| `src/components/blocks/DiplomadosGrid.astro`                                                                                                                                       | create  | Section heading + `md:grid-cols-2` grid, renders 2 cards                                                                                                 |
| `src/components/blocks/DiplomadoCard.astro`                                                                                                                                        | create  | Shared static card (props-driven)                                                                                                                        |
| `src/components/blocks/AdmissionBlock.astro`                                                                                                                                       | rewrite | `#registro` headline/paragraph + `<AdmissionForm client:visible />` in surfaced panel                                                                    |
| `src/components/blocks/FooterBlock.astro`                                                                                                                                          | rewrite | Logo, movement line, 3 policy links, copyright                                                                                                           |
| `src/components/islands/AdmissionForm.tsx`                                                                                                                                         | rewrite | Single-step, 4 fields, 2-option select, inline validation + confirmation                                                                                 |
| `src/lib/validators/admission.ts`                                                                                                                                                  | modify  | Drop profession/motivation/cohort; add `diplomado` enum                                                                                                  |
| `src/pages/api/admission.ts`                                                                                                                                                       | modify  | `.values` insert → `diplomado`                                                                                                                           |
| `src/db/schema.ts`                                                                                                                                                                 | modify  | Drop 3 cols; add `diplomado`                                                                                                                             |
| `src/db/migrations/*`                                                                                                                                                              | create  | drizzle-kit generated additive migration                                                                                                                 |
| `PainAgitatorBlock`, `RevelationBlock`, `CurriculumBlock`, `ExclusiveFilterBlock`, `AuthorityBlock`, `OfferStackBlock`, `Step*`, `ClassItem`, `CurriculumAccordion`, `ModulePanel` | delete  | No longer referenced                                                                                                                                     |
| `src/components/ui/Container.astro`, `Button.astro`, `SectionTitle.astro`                                                                                                          | keep    | Reused                                                                                                                                                   |

## 9. ADRs

### ADR-1: Single-step form instead of multi-step wizard

**Status:** Accepted. **Context:** The reference presents a flat, single-block form
(Nombre Completo, Correo, WhatsApp, select) — no wizard, no progress indicator, no profession/
motivation steps. **Decision:** Collapse `AdmissionForm` to a single React island step matching the
reference fields; delete the step islands and validation machine. **Consequences:** Simpler client
code and direct parity with the reference; the replaced `cohort`/`profession`/`motivation` data is no
longer collected.

### ADR-2: Additive DB migration for `diplomado`

**Status:** Accepted. **Context:** The `admissions` table currently stores `profession`, `motivation`,
`cohort` for a single product; the reference collects a `diplomado` path instead. **Decision:** Remove
the three unused columns from the schema and add `diplomado`; migration is additive (new column) so
existing `name/email/phone` rows survive and any column drop is reversible. **Consequences:** Live
submissions are preserved; old columns are dropped from the schema for a clean model, with re-add on
rollback if ever needed.

### ADR-3: Static-block reuse instead of replacing with a full component library

**Status:** Accepted. **Context:** The reference is plain HTML with Tailwind CDN utilities; the app
already has an Astro block catalog. **Decision:** Port each reference section to a thin static Astro
block (or a shared `DiplomadoCard`), driven by `@theme` tokens; icons via Google's Material Symbols
CDN rather than bundling an icon set. **Consequences:** Zero JS for the marketing sections (only the
form hydrates), preserving Core Web Vitals; strictly mirrors the reference's visual output.

## 10. Verification plan

Per `AGENTS.md` the project **forbids `pnpm build`** as a verification step, so verification is:

1. `pnpm lint` — ESLint + Prettier pass with no errors (also enforced by Husky pre-commit +
   `lint-staged` on the staged files; fix any flagged formatting before committing).
2. `pnpm dev` — start the dev server and visually verify against the reference:
   - Sticky nav renders logo, four anchors, `INSCRÍBETE HOY`.
   - Hero shows the Google image, exact headline with red `DESATANCA TU POTENCIAL!` span, subtitle,
     and `¡DA EL PRIMER PASO AHORA!` CTA.
   - `#diplomados` shows exactly two cards with Progress Blue borders, chips, features, and red CTAs;
     no "Coaching Cristiano" anywhere in the DOM.
   - `#registro` shows the four fields; select has placeholders + the two diplomados only; submitting
     persists to Turso via Drizzle; honeypot / 429 / duplicate-email responses behave as specified.
   - Footer shows logo, movement span, three policy links, and copyright.
3. `git log` review (QA-agent) confirms atomic commits match the milestones and the change is fully
   isolated.
4. Run the additive migration with `pnpm drizzle-kit generate && pnpm drizzle-kit push` and confirm
   existing rows are preserved.
