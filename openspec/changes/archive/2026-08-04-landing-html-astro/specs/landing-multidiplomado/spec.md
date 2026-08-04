# landing-multidiplomado Specification

## Purpose

The landing page MUST present a multi-diplomado static experience replacing the single-product landing. It MUST replicate the reference HTML (`knowledge/landing/landing_page_puedes_ser_m_s/code.html`) showing exactly two diplomados — Coaching y Liderazgo and Comunicación y Oratoria — and MUST NOT present Diplomado en Coaching Cristiano anywhere. All images and fonts MUST remain Google-hosted so the page renders identically to the reference.

## Requirements

### Requirement: Sticky Navigation Bar

The page MUST render a sticky top navigation (`position: sticky; top: 0; z-index >= 50`) containing the PUEDES SER MÁS logo (Google-hosted image), links to anchor targets `#diplomados`, `#testimonios`, `#certificacion`, `#contacto`, and a CTA "INSCRÍBETE HOY" that MUST link to `#registro`.

- GIVEN the page is loaded and scrolled
- WHEN the page is scrolled past the top of the viewport
- THEN the navigation bar MUST remain fixed at the top of the viewport
- AND it MUST display the logo, four anchor links, and the "INSCRÍBETE HOY" CTA

- GIVEN a desktop viewport
- WHEN the four anchor links are clicked
- THEN each link MUST navigate to its corresponding in-page anchor target (`#diplomados`, `#testimonios`, `#certificacion`, `#contacto`)

### Requirement: Hero

The page MUST render a hero section spanning at least 80% viewport height with a background image (Google-hosted, `object-cover`, reduced opacity) overlaid by a dark gradient. The hero MUST display a Bebas Neue headline `¡ROMPE TUS LÍMITES Y <span>DESATANCA TU POTENCIAL!</span>` where the span uses the Energy Red color, a subtitle line, and a CTA `¡DA EL PRIMER PASO AHORA!` linking to `#registro`.

- GIVEN the page is rendered
- WHEN inspecting the hero section
- THEN the exact headline `¡ROMPE TUS LÍMITES Y DESATANCA TU POTENCIAL!` MUST be present in uppercase with a red (`#D32F2F`) span on "DESATANCA TU POTENCIAL!", plus a subtitle and a red CTA linking to `#registro`.

### Requirement: Exactly Two Diplomado Cards

The page MUST render a "TRANSFORMA TU VIDA: ELIGE TU CAMINO" section (`#diplomados`) containing EXACTLY two diplomado cards in a responsive grid (1 column mobile, multiple columns desktop). Each card MUST have a Progress Blue (`#005db7`) border, `#121212` surface, a Google-hosted header image, a chip tag, a title, a description, a bullet list of features, and an Energy Red (`#D32F2F`) outline CTA linking to `#registro`.

The two cards MUST present, in this order:

1. Diplomado en Coaching y Liderazgo — chip "Liderazgo", features Autodominio, Gestión emocional, Metas claras, Equipos de alto rendimiento, CTA "QUIERO LIDERAR".
2. Diplomado en Comunicación y Oratoria — chip "Comunicación", features Lenguaje corporal, Miedo escénico, Discursos memorables, CTA "QUIERO HABLAR CON IMPACTO".

- GIVEN the `#diplomados` section is rendered
- WHEN counting the diplomado cards
- THEN exactly 2 cards MUST be present, showcasing Coaching y Liderazgo and Comunicación y Oratoria with their respective chips, features, and CTAs.

- GIVEN a mobile viewport
- WHEN the `#diplomados` grid is rendered
- THEN the two cards MUST stack in a single column with the specified Progress Blue border and `#121212` surface.

### Requirement: No Diplomado en Coaching Cristiano

The page MUST NOT contain the string "Coaching Cristiano" nor any Coaching Cristiano card (previously card 3) anywhere in the DOM, copy, images, or select options.

- GIVEN the fully rendered page DOM
- WHEN searching for "Coaching Cristiano"
- THEN zero occurrences MUST be found in the rendered markup.

### Requirement: Lead Form Section (`#registro`)

The page MUST render a lead/signup section with anchor id `#registro` containing a headline `¡SUPÉRATE SIEMPRE! REGÍSTRATE HOY` (with "REGÍSTRATE HOY" in Energy Red), a supporting paragraph, and the admission form rendered via the `admission-form` capability.

- GIVEN the `#registro` section is rendered
- WHEN inspecting its content
- THEN it MUST contain the headline with the red span, a supporting paragraph, and the admission form component.

### Requirement: Footer

The page MUST render a footer with the PUEDES SER MÁS logo (Google-hosted, grayscale, lowered opacity), the mark line `PUEDES SER MÁS es más que una marca:` ending with a red `es un movimiento`, and links for Política de Privacidad, Términos de Servicio, and Cookies, plus a copyright notice.

- GIVEN the page is rendered
- WHEN inspecting the footer
- THEN it MUST contain the logo, the movement tagline with the red span, the three policy links, and the copyright line.

### Requirement: Visual Parity with Reference

The page MUST reuse the exact Google-hosted image URLs and Google Fonts (Bebas Neue + Montserrat) from the reference HTML so that rendering matches the reference on mobile and desktop.

- GIVEN the page renders in a browser against a local dev server
- WHEN comparing block-by-block with the reference HTML
- THEN images load from Google-hosted URLs and layout/colors match the reference for the two-diplomado variant.
