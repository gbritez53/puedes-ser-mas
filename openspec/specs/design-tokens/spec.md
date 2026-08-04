# design-tokens Specification

## Purpose

The design tokens defined in `src/styles/global.css` via the Tailwind v4 CSS-first `@theme` directive MUST follow the PUEDES SER MÁS Brand Manual palette (Energy Red `#C41718`, Progress Blue `#1F3C87`). No legacy JavaScript Tailwind config MAY be introduced; styling is configured solely through `@theme` in `global.css`.

## Requirements

### Requirement: Brand-Manual Token Palette

The `@theme` tokens in `src/styles/global.css` MUST define the following core color values: background `#000000` (Negro Absoluto), surface `#121212`, Energy Red CTA `#C41718` (Color de Acción e Impacto), Progress Blue `#1F3C87` (Color de Confianza y Liderazgo), white text `#FFFFFF` (Blanco Puro), `<text-muted>` `#e5e2e1`, `<text-variant>` `#e4beba`, and `<accent-soft>` `#7ba4e8`. Existing block copy MUST reference these tokens (e.g. Energy Red for CTAs/accents, Progress Blue for card borders) so the rendered colors match the Brand Manual.

- GIVEN the `@theme` block in `global.css`
- WHEN inspecting the color tokens
- THEN `#C41718` (Energy Red CTA), `#1F3C87` (Progress Blue), and `#121212` (surface) MUST be the active values.

- GIVEN a glass card rendered on the page
- WHEN inspecting its border color
- THEN the border MUST resolve to the Progress Blue (`#1F3C87`) token.

- GIVEN a CTA button rendered on the page
- WHEN inspecting its background color
- THEN the background MUST resolve to the Energy Red (`#C41718`) token.

### Requirement: Typography Tokens

The `@theme` MUST expose Bebas Neue for large, high-impact headings and Montserrat for body text/subtitles, loaded from Google Fonts. Gotham Bold is the Brand Manual alternative for headings; Bebas Neue is the loaded equivalent.

- GIVEN headings rendered with the headline tokens
- WHEN inspecting their font-family
- THEN they MUST render with Bebas Neue.

- GIVEN body and subtitle text rendered
- WHEN inspecting its font-family
- THEN it MUST render with Montserrat.

### Requirement: CSS-First Configuration Only

The styling configuration MUST remain exclusively in `global.css` via the `@theme` directive; NO legacy JavaScript Tailwind configuration file MAY be added.

- GIVEN the project styling config
- WHEN searching for a legacy Tailwind JS/TS config file
- THEN none MUST be present and token changes must all live in `global.css`.

### Requirement: Glassmorphism and Lift Utilities

The `@layer components` MUST expose:

- `.glass-card`: glassmorphism (semi-transparent surface + `backdrop-filter: blur(8px)` + subtle Progress Blue border, hover border + glow).
- `.btn-lift`: 3D lift CTA (solid shadow under the button + `translateY(-2px)` hover using `--ease-out`).
- `.text-gradient-cta`: gradient `#ffffff → var(--color-cta)`.

- GIVEN a card with the `glass-card` class
- WHEN inspecting its computed style
- THEN it MUST have backdrop blur and a Progress Blue-tinted border.

- GIVEN a CTA with the `btn-lift` class
- WHEN inspecting its hover state
- THEN it MUST translate up and deepen its shadow.

### Requirement: Consistency and Refactor Safety

All blocks and components MUST reference tokens; no legacy literals (`#D32F2F`, `#005db7`, `#7bd1f8`, `#ffb3ac`, `rgba(211,47,47,…)`) MAY survive in UI components (cosmetic comments in shaders excluded).

- GIVEN the codebase components
- WHEN searching for legacy color literals
- THEN zero occurrences MUST exist in UI components.
