# Spec: Design Tokens (Delta — Retokenización a paleta de marca)

> Delta spec para el change `landing-redesign-7-bloques`. Retokeniza los colores de acción a los valores del Manual de Identidad. Palabras clave RFC 2119: MUST / SHOULD / MAY.

## T1. Tokens de color (`src/styles/global.css` `@theme`)

### T1.1 Valores obligatorios

- MUST setear:
  - `--color-bg: #000000` (Fondo Dominante — Negro Absoluto).
  - `--color-cta: #C41718` (Rojo Energía — acción/impacto).
  - `--color-cta-hover: #a01313` (hover derivado del Rojo Energía).
  - `--color-accent: #1F3C87` (Azul Progreso — confianza/liderazgo).
  - `--color-accent-soft: #7ba4e8` (variante clara derivada del Azul Progreso).
  - `--color-text: #ffffff` (Blanco Puro).

### T1.2 Valores de soporte

- SHOULD mantener `--color-surface: #121212`, `--color-surface-lowest: #0e0e0e`, `--color-line: #353534` para tarjetas y bordes.
- MAY agregar `--color-surface-glass: rgba(255, 255, 255, 0.04)` para glassmorphism.

### T1.3 Tipografía

- MUST mantener `--font-heading: 'Bebas Neue', 'Impact', sans-serif` y `--font-body: 'Montserrat', system-ui, sans-serif`.
- El brief menciona Gotham Bold como alternativa de marca; SHOULD documentarse como equivalente visual, sin agregar la fuente (no está disponible como asset).

## T2. Utilities (`@layer components`)

### T2.1 Glassmorphism

- MUST actualizar `.glass-card` a un estilo glassmorphism: fondo semitransparente con `backdrop-blur`, borde sutil `color-mix(in srgb, var(--color-accent) 30%, transparent)`, hover con borde accent completo.
- SHOULD usar `background: color-mix(in srgb, var(--color-surface) 85%, transparent)` + `backdrop-filter: blur(8px)`.

### T2.2 Lift 3D para CTA

- MUST agregar una utility (ej. `.btn-lift`) que aplique: `transition: transform 0.2s var(--ease-out), box-shadow 0.2s var(--ease-out)`; `box-shadow: 0 4px 0 color-mix(in srgb, var(--color-cta) 60%, black)`; hover `transform: translateY(-2px)` + shadow más alta.
- MUST usarla en los CTAs principales (hero, nav, formulario) según los specs de landing y admission-form.

### T2.3 Degradado de texto

- MUST corregir `.text-gradient-cta` (global.css:86) para usar los tokens: `linear-gradient(90deg, #ffffff, var(--color-cta))` en lugar del literal `#d32f2f`.

## T3. Barrido de hex hardcodeados

- MUST reemplazar los literales que no siguen la paleta nueva:
  - `src/components/blocks/DiplomadoCard.astro:68-69` — glow/border `rgba(211,47,47,...)` → usar `var(--color-cta)` / Rojo Energía.
  - `src/components/islands/AdmissionForm.tsx:248` — shadow `rgba(211,47,47,...)` → `var(--color-cta)`.
  - `src/components/blocks/NavigationBlock.astro:23` y `src/components/blocks/FooterBlock.astro:33` — hover `text-[#ffb3ac]` → token o color derivado del CTA.
- SHOULD barrer cualquier otro literal `#d32f2f`, `#b02626`, `#005db7`, `#7bd1f8` que aparezca en componentes (dejando intactos los comentarios en shaders si son cosméticos).

## T4. Espec maestra

- MUST actualizar `openspec/specs/design-tokens/spec.md` para reflejar los nuevos valores activos (`#C41718`, `#1F3C87`) y eliminar la instrucción de barrer estos valores (ahora son los canónicos).

## Casos de prueba

### TPT1. Tokens aplicados

- Given global.css con la retokenización, When se inspeccionan los tokens, Then `--color-cta` = `#C41718` y `--color-accent` = `#1F3C87`.

### TPT2. Sin literales viejos

- Given el código de componentes, When se buscan `#d32f2f`, `#005db7`, `rgba(211,47,47`, `#ffb3ac`, Then no aparecen en componentes de UI (excepto comentarios cosméticos en shaders).

### TPT3. Lift 3D

- Given un CTA con `.btn-lift`, When se hace hover, Then se eleva (translateY) con sombra mayor.
