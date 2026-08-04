# Proposal: Diplomado Detail Pages

## Intent

Add a dedicated detail page per diplomado so that clicking a card on the landing opens a separate, SEO-friendly page instead of scrolling to `#registro`. The visual target is `knowledge/landing/detalle_del_diplomado_puedes_ser_m_s/code.html` (sticky header, hero with chips + gradient headline + 2 CTAs, "El Arsenal del Líder" bento grid with 4 items, "El Momento es Ahora" pricing card, footer) authored for Coaching y Liderazgo. A second detail page for Comunicación y Oratoria requires NEW parallel Spanish copy.

## Scope

### In Scope

- Dynamic route `src/pages/diplomados/[slug].astro` with a typed content map `src/content/diplomados.ts` (slugs `coaching-y-liderazgo`, `comunicacion-y-oratoria`) — scales to N diplomados, avoids page duplication.
- `src/content/diplomado.ts` detail type: slug, chip, title, headline, description, chips, skills (4 bento items: icon + title + description + size), pricing (amount, currency, checklist[], ctas), meta (title, description, canonical).
- New detail blocks: `DetailHeroBlock.astro`, `DetailSkillsBlock.astro` (bento), `DetailPricingBlock.astro`, composed inside `[slug].astro` reusing `BaseLayout` + `NavigationBlock` + `FooterBlock`.
- Primary CTAs link to `/#registro` (AdmissionBlock confirmed `id="registro"`); "VER INTRODUCCIÓN" secondary CTA.
- Landing card CTAs: change `DiplomadoCard` `href` from `#registro` to `/diplomados/<slug>`; pass `slug` per card in `DiplomadosGrid`.
- New Comunicación y Oratoria copy: description, hero chips, bento items (inspired by card features: Lenguaje corporal, Miedo escénico, Discursos memorables), pricing copy; parallel in tone to the Liderazgo reference.
- Per-diplomado meta title/description/canonical via `BaseLayout` props.

### Out of Scope

- Self-hosted images/fonts; tests/testimonials/reviews sections; video embedding for "VER INTRODUCCIÓN" (renders as a button); moving the admission form off the landing; payment integration.

## Capabilities

- **New:** `diplomado-detail` — dynamic detail route + content map + three detail blocks.
- **Modified:** `landing-multidiplomado` — `DiplomadoCard`/`DiplomadosGrid` CTAs link to detail pages (pass `slug`).

## Approach

1. Add `diplomado.ts` type + `src/content/diplomados.ts` map (2 entries; identical pricing fields for parity).
2. Build `DetailHeroBlock`, `DetailSkillsBlock`, `DetailPricingBlock` matching reference sections (chips, text-gradient, glass-card bento with 2 large `md:col-span-8` + 2 small `md:col-span-4`).
3. Create `[slug].astro` composing BaseLayout + shared chrome + detail blocks; lookup by slug, `Astro.redirect`/404 fallback.
4. Author Comunicación copy and set per-diplomado meta/canonical.
5. Update `DiplomadoCard` to accept `href`; wire slugs in `DiplomadosGrid`. Keep pricing identical per reference.

## Affected Areas

| Area                                                    | Impact | Description            |
| ------------------------------------------------------- | ------ | ---------------------- |
| `src/pages/diplomados/[slug].astro`                     | New    | Dynamic detail route   |
| `src/content/diplomado.ts`, `src/content/diplomados.ts` | New    | Detail type + data map |
| `src/components/blocks/DetailHeroBlock.astro`           | New    | Hero w/ chips, CTAs    |
| `src/components/blocks/DetailSkillsBlock.astro`         | New    | Bento skills grid      |
| `src/components/blocks/DetailPricingBlock.astro`        | New    | Pricing + checklist    |
| `src/components/blocks/DiplomadoCard.astro`             | Modify | CTA `href` param       |
| `src/components/blocks/DiplomadosGrid.astro`            | Modify | Per-card slug + href   |

## Risks

| Risk                                             | Likelihood | Mitigation                                                             |
| ------------------------------------------------ | ---------- | ---------------------------------------------------------------------- |
| Divergent pricing per diplomado causes confusion | Low        | Keep pricing fields configurable but both entries identical ($997 USD) |
| Missing Comunicación copy quality                | Medium     | Reuse card features; parallel tone to reference                        |
| Unknown slug request                             | Low        | 404 fallback in `[slug].astro`                                         |

## Rollback Plan

- Git revert this change's commits; card CTAs revert to `#registro`; delete detail route. No DB impact.

## Dependencies

- `knowledge/landing/detalle_del_diplomado_puedes_ser_m_s/code.html` (visual target).
- Existing `BaseLayout`, `NavigationBlock`, `FooterBlock`, design tokens in `global.css`.

## Success Criteria

- [ ] `GET /diplomados/coaching-y-liderazgo` and `/diplomados/comunicacion-y-oratoria` render the reference structure; both text-gradient-broken "Arsenal del Líder"/"Arsenal del Comunicador" bento grids.
- [ ] Unknown slug returns 404.
- [ ] Landing card CTAs navigate to `/diplomados/<slug>`; detail primary CTAs link to `/#registro`.
- [ ] Per-diplomado title/description/canonical set.
- [ ] `pnpm lint`/Prettier clean via Husky.
