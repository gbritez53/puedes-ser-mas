# Delta for design-tokens

## Context

The design tokens defined in `src/styles/global.css` via the Tailwind v4 CSS-first `@theme` directive MUST be realigned to the reference palette. No legacy JavaScript Tailwind config MAY be introduced; styling is configured solely through `@theme` in `global.css`.

## MODIFIED Requirements

### Requirement: Reference-aligned Token Palette

The `@theme` tokens in `src/styles/global.css` MUST define the following core color values: background `#000000`, surface `#121212`, Energy Red CTA `#D32F2F`, Progress Blue `#005db7`, white text `#FFFFFF`, `<text-muted>` `#e5e2e1`, and `<on-surface-variant>` as used by the reference. Existing block copy MUST reference these tokens (e.g. Energy Red for CTAs/accents, Progress Blue for card borders) so the rendered colors match the reference HTML.

(Previously: tokens used Energy Red `#C41718` and Progress Blue `#1F3C87` with a black/white/blue accent scheme.)

- GIVEN the `@theme` block in `global.css`
- WHEN inspecting the color tokens
- THEN `#D32F2F` (Energy Red CTA), `#005db7` (Progress Blue), and `#121212` (surface) MUST be the active values.

- GIVEN a diplomado card rendered on the page
- WHEN inspecting its border color
- THEN the border MUST resolve to the Progress Blue (`#005db7`) token.

- GIVEN a CTA button rendered on the page
- WHEN inspecting its background color
- THEN the background MUST resolve to the Energy Red (`#D32F2F`) token.

### Requirement: Typography Tokens

The `@theme` MUST expose Bebas Neue for large, high-impact headings and Montserrat for body text/subtitles, loaded from Google Fonts as in the reference.

(Previously: typography relied on the same Montserrat/Bebas Neue system but was not explicitly tokenized for headings/body differentiation.)

- GIVEN headings rendered with the headline tokens
- WHEN inspecting their font-family
- THEN they MUST render with Bebas Neue.

- GIVEN body and subtitle text rendered
- WHEN inspecting its font-family
- THEN it MUST render with Montserrat.

### Requirement: CSS-First Configuration Only

The styling configuration MUST remain exclusively in `global.css` via the `@theme` directive; NO legacy JavaScript Tailwind configuration file MAY be added.

(Previously: no JS config existed; this requirement is reaffirmed for the realigned tokens.)

- GIVEN the project styling config
- WHEN searching for a legacy Tailwind JS/TS config file
- THEN none MUST be present and token changes must all live in `global.css`.

### Requirement: Consistency and Refactor Safety

All existing blocks or components that reference the old CTA/accent tokens (`#C41718`, `#1F3C87`) MUST be checked and updated so no mismatched color survives after the retokenization.

- GIVEN the config diff is applied
- WHEN running `pnpm lint`
- THEN it MUST pass clean (project forbids `pnpm build` as a check).
