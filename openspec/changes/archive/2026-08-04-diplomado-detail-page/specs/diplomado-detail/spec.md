# diplomado-detail Specification

## Purpose

The system MUST provide a dedicated, SEO-friendly detail page for each diplomado, matching the reference `knowledge/landing/detalle_del_diplomado_puedes_ser_m_s/code.html`. Each page MUST be served from a dynamic route, reuse shared chrome (`BaseLayout`, `NavigationBlock`, `FooterBlock`), and present hero, bento skills, and pricing sections driven by a typed content map. Content SHALL exist for exactly two diplomados: Coaching y Liderazgo and Comunicación y Oratoria.

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

The system MAY define a `src/content/diplomados.ts` map and a `src/content/diplomado.ts` type. When present, each diplomado entry MUST include: `slug`, `chip`, `title`, `headline`, `heroDescription`, `chips[]`, `skills[]` (4 items `{ icon, title, description, size: 'large' | 'small' }`), `pricing { amount, currency, checklist[], ctaLabel }`, and `meta { title, description, canonical }`. Both entries MUST declare identical `pricing.amount` ($997) and `pricing.currency` (USD) and MUST declare four bento skills.

- GIVEN the content map is loaded
- WHEN querying for `coaching-y-liderazgo` and `comunicacion-y-oratoria`
- THEN both entries MUST exist with the required fields and exactly 4 skills each
- AND both entries MUST have `pricing.amount === '997'` and `pricing.currency === 'USD'`

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

The hero MUST be sticky-nav aware, span at least 80% viewport height, and render two chips (e.g. `Liderazgo` and `Certificado` for Coaching; `Comunicación` and `Certificado` for Comunicación), a `DIPLOMADO EN X` headline in Bebas Neue where the `X` line uses a white→`#D32F2F` text-gradient, a supporting paragraph, a primary CTA `INSCRÍBETE AHORA` linked to `/#registro`, and a secondary `VER INTRODUCCIÓN` button (no video embed MAY be present).

- GIVEN the Coaching hero is rendered
- WHEN inspecting the headline and CTAs
- THEN the chips MUST be `Liderazgo`/`Certificado`, the headline MUST be `DIPLOMADO EN COACHING Y LIDERAZGO` with the second line text-gradient
- AND the primary CTA MUST link to `/#registro` while `VER INTRODUCCIÓN` MUST render as a non-navigating button

### Requirement: Bento Skills Grid

The page MUST render a bento grid titled `El Arsenal del Líder` (Coaching) or `El Arsenal del Comunicador` (Comunicación) showing exactly 4 glass-card items on a 12-column grid, where the two `large` items span `md:col-span-8` and the two `small` items span `md:col-span-4`. Each item MUST show a Material Symbol icon, title, and description, with a glass-card style and a hover border glow using the Progress Blue (`#005db7`) token.

- GIVEN the `El Arsenal del Líder` grid
- WHEN counting items
- THEN exactly 4 items MUST render, with 2 at `md:col-span-8` and 2 at `md:col-span-4`
- AND each MUST display an icon, title, and description inside a glass-card that glows Progress Blue on hover

### Requirement: Pricing

The pricing section MUST be titled `El Momento es Ahora`, display `$997 USD`, a checklist (including `Acceso de por vida al material` and `Certificación oficial validada`), and a CTA `COMENZAR TRANSFORMACIÓN` linked to `/#registro`. Pricing MUST be identical across both diplomados.

- GIVEN the pricing section on either detail page
- WHEN inspecting its content
- THEN it MUST show the heading, `$997 USD`, the two checklist items, and the CTA linking to `/#registro`
- AND the amount MUST be identical on both pages
