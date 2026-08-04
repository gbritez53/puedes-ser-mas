# Delta for landing-multidiplomado

## MODIFIED Requirements

### Requirement: Exactly Two Diplomado Cards

The page MUST render a "TRANSFORMA TU VIDA: ELIGE TU CAMINO" section (`#diplomados`) containing EXACTLY two diplomado cards in a responsive grid (1 column mobile, multiple columns desktop). Each card MUST have a Progress Blue (`#005db7`) border, `#121212` surface, a Google-hosted header image, a chip tag, a title, a description, a bullet list of features, and an Energy Red (`#D32F2F`) outline CTA that MUST link to its respective `/diplomados/<slug>` detail page.
(Previously: each card CTA linked to `#registro`.)

The two cards MUST present, in this order:

1. Diplomado en Coaching y Liderazgo — chip "Liderazgo", features Autodominio, Gestión emocional, Metas claras, Equipos de alto rendimiento, CTA "QUIERO LIDERAR" linking to `/diplomados/coaching-y-liderazgo`.
2. Diplomado en Comunicación y Oratoria — chip "Comunicación", features Lenguaje corporal, Miedo escénico, Discursos memorables, CTA "QUIERO HABLAR CON IMPACTO" linking to `/diplomados/comunicacion-y-oratoria`.

- GIVEN the `#diplomados` section is rendered
- WHEN counting the diplomado cards
- THEN exactly 2 cards MUST be present, showcasing Coaching y Liderazgo and Comunicación y Oratoria with their respective chips, features, and CTAs.

- GIVEN a mobile viewport
- WHEN the `#diplomados` grid is rendered
- THEN the two cards MUST stack in a single column with the specified Progress Blue border and `#121212` surface.

### Requirement: Card CTA Routes to Detail Page

The CTA anchor on each `DiplomadoCard` MUST not point to `#registro`. It MUST point to the `/diplomados/<slug>` URL corresponding to the rendered card.
(Previously: the card CTA linked to the `#registro` anchor on the same page.)

- GIVEN the card for a given diplomado is rendered
- WHEN inspecting its CTA `href`
- THEN the `href` MUST be `/diplomados/<slug>` for that diplomado (e.g. `/diplomados/coaching-y-liderazgo`)
- AND it MUST NOT be `#registro`

## ADDED Requirements

### Requirement: DiplomadoCard CTA Prop

`DiplomadoCard.astro` MUST accept an `href` prop (or equivalent `slug`) and render it as the CTA anchor's `href`. `DiplomadosGrid.astro` MUST pass the per-card `slug`/`href`.

- GIVEN a `DiplomadoCard` rendered with an `href`
- WHEN inspecting its CTA anchor
- THEN the `href` attribute MUST equal the provided value
- AND navigating to it MUST open the card's `/diplomados/<slug>` detail page
