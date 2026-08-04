# Proposal: Landing HTML -> Astro (2 diplomados)

## Intent

Replace the current single-product landing (Diplomado Coach Emprendedor) with a multi-diplomado landing that replicates the reference design at `knowledge/landing/landing_page_puedes_ser_m_s/code.html`, showing exactly two diplomados (Coaching y Liderazgo + Comunicación y Oratoria). Remove all traces of Diplomado en Coaching Cristiano. Keep the React `AdmissionForm` wired to Turso/Drizzle, adapt its fields to the HTML form, and reuse the Google-hosted images so the page renders identical to the reference.

## Scope

### In Scope

- Rebuild `src/pages/index.astro` block layout to mirror the HTML structure: sticky nav, hero, Diplomados cards grid, lead form section (`#registro`), footer.
- Create/replace static blocks to render the two diplomado cards with Google-hosted images, Progress Blue card borders, and Energy Red CTAs.
- Adapt `AdmissionForm` + Step islands to the HTML form fields: Nombre Completo, Correo Electrónico, WhatsApp, and a `select` "Elige tu camino" with the two diplomados (no multi-step, no profession/motivation).
- Update `src/lib/validators/admission.ts` and `src/pages/api/admission.ts` accordingly; keep honeypot, rate limit, duplicate-email check, and Turso/Drizzle persistence.
- Update `src/db/schema.ts` (replace `profession`/`motivation` with `diplomado`/`path`; drop `cohort` or repurpose).
- Update `@theme` tokens in `src/styles/global.css` to match the reference palette (Energy Red `#D32F2F`, Progress Blue `#005db7`, surface `#121212`).
- Update page meta (title/description) and nav anchors in `BaseLayout`/blocks.
- Remove Coaching Cristiano everywhere: cards, hero subtitle copy, form select option, any references.

### Out of Scope

- Testimonios, Certificación, and other HTML anchors not present in the reference.
- Self-hosting Google-hosted images or fonts (stays on Google CDN).
- New admission cohorts or marketing content beyond the reference copy.

## Capabilities

- **New:** `landing-multidiplomado` — multi-diplomado static landing (nav, hero, cards, footer).
- **Modified:** `admission-form` — field set, steps, validation, schema, API, DB columns.
- **Modified:** `design-tokens` (global.css) — CTA/accent/surface tokens realigned to reference palette.

## Approach

1. Align `@theme` tokens in `global.css` with the reference palette.
2. Port each HTML section into Astro static blocks, keeping Google image URLs verbatim.
3. Collapse `AdmissionForm` to a single step mirroring the HTML fields and select options.
4. Update Zod schema, Turso schema, and API; run migration for the changed columns.
5. Update `index.astro` and `BaseLayout` meta; verify `pnpm build` and the dev server.

## Affected Areas

| Area                                                | Impact  | Description                                 |
| --------------------------------------------------- | ------- | ------------------------------------------- |
| `src/pages/index.astro`                             | Rewrite | New block composition + meta                |
| `src/components/blocks/*.astro`                     | Rework  | Nav/hero/cards/form/footer mirroring HTML   |
| `src/components/islands/AdmissionForm.tsx` + Step\* | Rewrite | Single-step form, two-option select         |
| `src/lib/validators/admission.ts`                   | Modify  | Fields replaced, `diplomado` enum           |
| `src/pages/api/admission.ts`                        | Modify  | Insert adapted columns                      |
| `src/db/schema.ts`                                  | Modify  | Drop profession/motivation/cohort, add path |
| `src/styles/global.css`                             | Modify  | Tokens: #D32F2F, #005db7, #121212           |
| `src/layouts/BaseLayout.astro`                      | Minor   | Title/description/anchors                   |

## Risks

| Risk                                               | Likelihood | Mitigation                                             |
| -------------------------------------------------- | ---------- | ------------------------------------------------------ |
| Google-hosted image URLs break/external dependency | Medium     | Keep URLs verbatim; no local fallback needed per scope |
| DB migration breaks existing admissions            | Low        | Drop only unused columns; keep `name/email/phone`      |
| Token change alters existing design                | Low        | Review diffs of all blocks against tokens              |
| Reference has 3 cards; scope says 2                | Low        | Explicitly delete card 3 (Coaching Cristiano)          |

## Rollback Plan

- Git revert the landing-html-astro commits (all changes isolated to this change).
- No destructive data migration: column drops are reversible via additive re-add if needed.

## Dependencies

- `@astrojs/vercel` + Turso/Drizzle runtime (already configured).
- Google Fonts + Google-hosted images (external, already used by reference).

## Success Criteria

- [ ] Page renders two diplomados only; no "Coaching Cristiano" anywhere in DOM.
- [ ] Visual output matches reference HTML (images, colors, layout) on mobile and desktop.
- [ ] Form has exactly Nombre Completo, Correo, WhatsApp, and "Elige tu camino" select with 2 options.
- [ ] Submission persists to Turso via Drizzle with adapted schema; honeypot/rate-limit intact.
- [ ] `pnpm build` passes; `pnpm lint`/Prettier clean via Husky.
- [ ] Meta title/description and anchors updated.
