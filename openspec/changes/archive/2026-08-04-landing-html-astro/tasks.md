# Tasks: Landing HTML → Astro (2 diplomados)

## Phase A: Design Tokens & Layout

- [ ] A.1 Update `@theme` tokens in `src/styles/global.css`: set `--color-cta` `#D32F2F`, `--color-cta-hover` `#b02626`, `--color-accent` `#005db7`, `--color-surface` `#121212`, `--color-text-muted` `#e5e2e1`, `--color-line` `#353534`; add `--color-surface-lowest` `#0e0e0e`, `--color-accent-soft` `#7bd1f8`, `--color-text-variant` `#e4beba`; keep `--color-bg` `#000000` and `--color-text` `#ffffff`.
- [ ] A.2 In same file update `--font-heading`/`--font-body` (Bebas Neue / Montserrat), `--text-hero`, and `--radius-card` to `0.5rem`; sweep any remaining hard-coded `#C41718`/`#1F3C87`.
- [ ] A.3 Modify `src/layouts/BaseLayout.astro`: add Material Symbols Google Fonts stylesheet + preconnect (keep Bebas/Montserrat); update fallback title/description to multi-diplomado copy; keep favicon `/assets/isotype.png`.

## Phase B: Static Blocks (create + rewrite + delete)

- [ ] B.1 Create `src/components/blocks/NavigationBlock.astro`: sticky nav (`sticky top-0 z-50`), Google logo image, anchors `#diplomados`/`#testimonios`/`#certificacion`/`#contacto`, CTA `INSCRÍBETE HOY` → `#registro`.
- [ ] B.2 Rewrite `src/components/blocks/HeroBlock.astro`: Google bg image (`object-cover`, `opacity-40` + gradient), headline `¡ROMPE TUS LÍMITES Y <span>DESATANCA TU POTENCIAL!</span>` (red span), subtitle (2 diplomados, no "fe"), CTA `¡DA EL PRIMER PASO AHORA!` + `arrow_forward` → `#registro`.
- [ ] B.3 Create `src/components/blocks/DiplomadoCard.astro`: static props-driven card (`chip`, `title`, `description`, `features`, `cta`, `imageUrl`) with accent border, `--color-surface`, Google header image, red `check_circle` features, red outline CTA → `#registro`.
- [ ] B.4 Create `src/components/blocks/DiplomadosGrid.astro`: section `#diplomados` heading `TRANSFORMA TU VIDA: ELIGE TU CAMINO` with red divider, `grid grid-cols-1 md:grid-cols-2`, render two `DiplomadoCard`s (Coaching y Liderazgo + Comunicación y Oratoria) with exact copy/features/CTAs and Google image URLs; NO Coaching Cristiano card.
- [ ] B.5 Rewrite `src/components/blocks/AdmissionBlock.astro`: `#registro` headline `¡SUPÉRATE SIEMPRE! <span>REGÍSTRATE HOY</span>` (red span), supporting paragraph, surfaced panel rendering `<AdmissionForm client:visible />`.
- [ ] B.6 Rewrite `src/components/blocks/FooterBlock.astro`: Google logo (grayscale `opacity-80`), `PUEDES SER MÁS es más que una marca: <span>es un movimiento.</span>`, links Política de Privacidad/Términos de Servicio/Cookies, copyright `© {year}`.
- [ ] B.7 Delete `PainAgitatorBlock.astro`, `RevelationBlock.astro`, `CurriculumBlock.astro`, `ExclusiveFilterBlock.astro`, `AuthorityBlock.astro`, `OfferStackBlock.astro` (all under `src/components/blocks/`).

## Phase C: Admission Form, API, Schema & Migration

- [ ] C.1 Rewrite `src/components/islands/AdmissionForm.tsx` to single-step: state `values` + `status`; fields `name`, `email`, `phone`, `diplomado` (select placeholder "Selecciona un diplomado..." + two options `liderazgo`/`comunicacion`); hidden honeypot; whole-form Zod validation with inline errors (empty select blocks submit); POST JSON to `/api/admission`; success/429/422/error states with retry.
- [ ] C.2 Modify `src/lib/validators/admission.ts`: drop `profession`/`motivation`/`cohort`, add `diplomado: z.enum(['liderazgo','comunicacion'])` via `admissionSchema`; keep `AdmissionInput`/`AdmissionFieldErrors`.
- [ ] C.3 Modify `src/db/schema.ts`: remove `profession`/`motivation`/`cohort` columns, add `diplomado: text('diplomado').notNull()`; keep `name`/`email`(unique)/`phone`/`ip_hash`/`user_agent`/`created_at`.
- [ ] C.4 Modify `src/pages/api/admission.ts`: insert `.values(...)` → `diplomado: parsed.data.diplomado`; preserve rate-limit, honeypot silent-reject, duplicate-email 400, 429/422/201 handling unchanged.
- [ ] C.5 Delete Step islands and curriculum islands under `src/components/islands/`: `StepPersonal.tsx`, `StepProfessional.tsx`, `StepMotivation.tsx`, `StepConfirmation.tsx`, `ClassItem.tsx`, `CurriculumAccordion.tsx`, `ModulePanel.tsx`.
- [ ] C.6 DB migration (CADENCE): `pnpm drizzle-kit generate` → `pnpm drizzle-kit push`; verify additive `diplomado` column added and existing `name/email/phone` rows preserved (no destructive drop on live data).

## Phase D: Composition, Cleanup & Verification

- [ ] D.1 Rewrite `src/pages/index.astro`: import + compose `NavigationBlock` → `<main>` `HeroBlock`/`DiplomadosGrid`/`AdmissionBlock` → `FooterBlock`; drop removed block imports; set meta `title` and `description` for two diplomados; `ogImage` `/assets/logo.png`.
- [ ] D.2 Verify no references remain: grep `profession|motivation|cohort|Coaching Cristiano` across `src/` → expect zero; confirm no unused content-data files left (none found).
- [ ] D.3 Run `pnpm lint` (ESLint + Prettier) until clean; fix any flagged files before committing. NO `pnpm build` (forbidden).
- [ ] D.4 Run `pnpm dev` and render against reference: sticky nav anchors + CTA; hero bg/headline(sub)/CTA; exactly two cards with blue borders + red CTAs and no "Coaching Cristiano"; `#registro` with 4 fields, 2-option select; form POST persists to Turso (honeypot/429/duplicate behave); footer logo/movement/links/copyright.
- [ ] D.5 Commit milestones with conventional commit messages (`feat:`/`fix:`/`style:`/`asset:`) as each block closes; confirm `git log` isolates the change.
