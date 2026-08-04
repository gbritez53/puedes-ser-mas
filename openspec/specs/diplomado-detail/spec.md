# diplomado-detail Specification

## Purpose

The system MUST provide a dedicated, SEO-friendly detail page for each diplomado, matching the multi-diplomado experience. Each page MUST be served from a dynamic route, reuse shared chrome (`BaseLayout`, `NavigationBlock`, `FooterBlock`), and present hero, bento skills, and pricing sections driven by a typed content map. Content SHALL exist for exactly two diplomados: Coaching y Liderazgo and Comunicación y Oratoria. Detail pricing MUST match the home investment scheme (Matrícula Preferencial $397 USD / Plan Financiado $35 + 6×$65).

## Requirements

### Requirement: Dynamic Detail Route and Slug Resolution

The system MUST expose dynamic route `src/pages/diplomados/[slug].astro`. It MUST resolve slugs `coaching-y-liderazgo` and `comunicacion-y-oratoria` from the typed content map and render the corresponding detail page.

- GIVEN the route `/diplomados/coaching-y-liderazgo`
- WHEN requested
- THEN the page MUST render the Coaching y Liderazgo detail content
- AND the page MUST use HTTP 200

- GIVEN the route `/diplomados/comunicacion-y-oratoria`
- WHEN requested
- THEN the page MUST render the Comunicación y Oratoria detail content

- GIVEN an unknown slug, e.g. `/diplomados/no-existe`
- WHEN requested
- THEN the system MUST return a 404 (via `Astro.redirect` to `/404` or not-found fallback)

### Requirement: Typed Content Map

The system MUST define a `src/content/diplomados.ts` map and a `src/content/diplomado.ts` type. Each diplomado entry MUST include: `slug`, `chip`, `title`, `headline`, `headlineAccent`, `heroDescription`, `chips[]`, `skillsTitle`, `skills[]` (4 items `{ icon, title, description, size: 'large' | 'small' }`), `pricing { amount, currency, label, headline, headlineAccent, tagline, checklist[], ctaLabel, ctaHref, singleAmount, reservationAmount, monthlyAmount, installments, paymentConditions }`, `meta { title, description, canonical }`, plus the grid fields `enfoque[]`, `promesa`, `fechaInicio`, `plazas`. Both entries MUST declare identical pricing: `singleAmount` $397, `reservationAmount` $35, `monthlyAmount` $65, `installments` 6, `currency` USD, and MUST declare four bento skills.

- GIVEN the content map is loaded
- WHEN querying for `coaching-y-liderazgo` and `comunicacion-y-oratoria`
- THEN both entries MUST exist with the required fields and exactly 4 skills each
- AND both entries MUST have `pricing.singleAmount === '397'`, `pricing.reservationAmount === '35'`, `pricing.monthlyAmount === '65'`, `pricing.installments === 6`, and `pricing.currency === 'USD'`

### Requirement: Shared Chrome

Each detail page MUST be composed inside `BaseLayout` and MUST include `NavigationBlock` and `FooterBlock` (sticky nav, footer) exactly as the landing does.

- GIVEN either detail page is rendered
- WHEN inspecting the document structure
- THEN it MUST contain the sticky navigation header and the footer

### Requirement: Per-Diplomado Meta

Each detail page MUST pass `meta.title`, `meta.description`, and `meta.canonical` to `BaseLayout`, which MUST emit them as `<title>`, `<meta name="description">`, and `<link rel="canonical">`.

- GIVEN the `/diplomados/coaching-y-liderazgo` page
- WHEN inspecting its `<head>`
- THEN `title`, `description`, and `canonical` MUST match that diplomado's `meta` values

### Requirement: Detail Hero

The hero MUST be sticky-nav aware, span at least 80% viewport height, and render two chips (e.g. `Liderazgo` and `Certificado` for Coaching; `Comunicación` and `Certificado` for Comunicación), a `DIPLOMADO DE X` headline in Bebas Neue where the accent line uses the white→`#C41718` `text-gradient-cta` utility, a supporting paragraph, a primary CTA `¡INSCRÍBETE AHORA!` linked to `/#registro`, and a secondary `VER INTRODUCCIÓN` button (no video embed MAY be present).

- GIVEN the Coaching hero is rendered
- WHEN inspecting the headline and CTAs
- THEN the chips MUST be `Liderazgo`/`Certificado`, the headline MUST be `DIPLOMADO DE COACHING PARA LA SUPERACIÓN PERSONAL` with the accent line text-gradient
- AND the primary CTA MUST link to `/#registro` while `VER INTRODUCCIÓN` MUST render as a non-navigating button

### Requirement: Bento Skills Grid

The page MUST render a bento grid titled `El Arsenal del Líder` (Coaching) or `El Arsenal del Comunicador` (Comunicación) showing exactly 4 glass-card items on a 12-column grid, where the two `large` items span `md:col-span-8` and the two `small` items span `md:col-span-4`. Each item MUST show a Material Symbol icon, title, and description, with a glass-card style and a hover border glow using the Progress Blue (`#1F3C87`) token.

- GIVEN the `El Arsenal del Líder` grid
- WHEN counting items
- THEN exactly 4 items MUST render, with 2 at `md:col-span-8` and 2 at `md:col-span-4`
- AND each MUST display an icon, title, and description inside a glass-card that glows Progress Blue on hover

### Requirement: Pricing

The pricing section MUST be titled `Inversión Seleccionada`, display Matrícula Preferencial $397 USD as the single-amount headline, a checklist (including `Acceso de por vida al material`, `Certificación oficial validada`, and `Mentor Coach personalizado`), a Plan Financiado callout (`Reservá tu vacante con $35 USD y pagá el resto en 6 cuotas mensuales de $65 USD` with the payment conditions text), and a CTA `COMENZAR TRANSFORMACIÓN` linked to `/#registro`. Pricing MUST be identical across both diplomados and MUST NOT display `$997`.

- GIVEN the pricing section on either detail page
- WHEN inspecting its content
- THEN it MUST show the heading, `$397` USD single amount, the Plan Financiado callout with $35 + 6×$65, the checklist items, and the CTA linking to `/#registro`
- AND the amounts MUST be identical on both pages
- AND the section MUST NOT contain the string `997`
