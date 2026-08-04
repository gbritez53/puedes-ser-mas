# landing-multidiplomado Specification

## Purpose

The landing page MUST present a multi-diplomado experience rebuilt around the designer's 7-block brief: Hero, La Filosofía PSM, Selección de Diplomados, Proceso de Admisión de Élite, Autoridad y Cuerpo Docente, Inversión y Planes, and Cierre Épico + Formulario. It MUST NOT present "Diplomado en Coaching Cristiano" anywhere. Homepage copy is the source of truth from the designer brief.

## Requirements

### Requirement: Page Composition and Anchors

The page MUST render blocks in this order: `NavigationBlock` → `HeroBlock` → `FilosofiaBlock` → `DiplomadosGrid` → `AdmisionProcesoBlock` → `AutoridadBlock` → `InversionBlock` → `AdmissionBlock` → `FooterBlock`. Required anchor ids: `#filosofia`, `#diplomados`, `#admision`, `#inversion`, `#registro`.

- GIVEN the homepage is rendered
- WHEN inspecting the block order and anchor ids
- THEN the 7 blocks render in order and the five anchors exist.

### Requirement: Sticky Navigation Bar

The page MUST render a sticky top navigation (`position: sticky; top: 0; z-index >= 50`) containing the PUEDES SER MÁS logo (left) and a CTA `POSTULAR AHORA` (right) that MUST link to `#admision`. Navigation links SHOULD point to live anchors (`#filosofia`, `#diplomados`, `#admision`, `#inversion`).

- GIVEN the page is loaded and scrolled
- WHEN the page is scrolled past the top of the viewport
- THEN the navigation bar MUST remain fixed at the top
- AND it MUST display the logo and the `POSTULAR AHORA` CTA

### Requirement: Hero

The page MUST render a hero section spanning at least 80% viewport height with a floating isotype background (`/assets/isotype.png`, low opacity). The hero MUST display the exact headline `EL LÍMITE DE TU CRECIMIENTO NUNCA ES TU NEGOCIO, ES TU MENTALIDAD.` with the second part in Energy Red, the empathetic subtitle "En Puede Ser Más no entrenamos proyectos; transformamos a la persona que los lidera…", a red diagonal line (`#C41718`) crossing the bottom, and a CTA `SOLICITAR ENTREVISTA DE ADMISIÓN` with 3D lift linking to `#registro`.

- GIVEN the page is rendered
- WHEN inspecting the hero section
- THEN the exact headline, subtitle, diagonal red line, and CTA MUST be present.

### Requirement: La Filosofía PSM Block

The page MUST render a `FilosofiaBlock` with H2 `La persona precede al resultado`, the William James quote ("El mayor descubrimiento de mi generación es que un ser humano puede cambiar su vida cambiando su actitud mental."), and 3 glassmorphism cards with subtle Progress Blue borders: Identidad & Mentalidad, Dominio Emocional, Liderazgo Humano & Comunicación.

- GIVEN the `#filosofia` section is rendered
- WHEN counting the pillar cards
- THEN exactly 3 glass cards MUST be present with the specified titles and descriptions.

### Requirement: Selección de Diplomados

The page MUST render a `#diplomados` section titled `¿Cuál es tu siguiente nivel de transformación?` containing EXACTLY two diplomado cards sourced from `src/content/diplomados.ts`:

1. DIPLOMADO DE COACHING PARA LA SUPERACIÓN PERSONAL — Enfoque: Liderazgo Interno, Gestión Emocional, Propósito; promesa mentalidad inquebrantable; aulas exclusivas máx 15 plazas; inicio Martes 15 de Septiembre 2026; CTA `VER MAPA DE TRANSFORMACIÓN` → `/diplomados/coaching-y-liderazgo`.
2. DIPLOMADO EN COMUNICACIÓN Y ORATORIA — Enfoque: Presencia Escénica, Storytelling, Dominio Oral; promesa destruir timidez; aulas exclusivas máx 15 plazas; inicio Miércoles 16 de Septiembre 2026; CTA `VER MAPA DE TRANSFORMACIÓN` → `/diplomados/comunicacion-y-oratoria`.

Each card MUST show: title, description, enfoque chips, promesa quote, fecha de inicio, plazas, and the red outline CTA.

- GIVEN the `#diplomados` section is rendered
- WHEN counting the diplomado cards
- THEN exactly 2 cards MUST be present with the specified data
- AND each CTA MUST point to its `/diplomados/<slug>` detail page (MUST NOT be `#registro`).

### Requirement: Proceso de Admisión de Élite

The page MUST render an `AdmisionProcesoBlock` with anchor `#admision`, H2 `Proceso de Selección y Admisión` in Energy Red, the filter text "No vendemos cursos masivos. Buscamos personas en constante evolución que rechacen el conformismo y la mediocridad.", and 3 steps: Postulación, Entrevista Privada, Admisión Directa.

- GIVEN the `#admision` section is rendered
- WHEN inspecting its content
- THEN the title, filter text, and 3 steps MUST be present.

### Requirement: Autoridad y Cuerpo Docente

The page MUST render an `AutoridadBlock` titled `Facilitadores de Impacto Internacional`, with a featured card for Claudio Español (CEO y Fundador de PUEDES SER MÁS, Director de la Academia de Superación, Coach Ontológico con más de 7 años en +7 países de Latinoamérica) sourced from `src/content/authority.ts`, and support cards for Fernando Kolbo, Gastón Molina, Malena Holzman, Carlos Monnery, Daniel Pereira.

- GIVEN the authority section is rendered
- WHEN counting faculty cards
- THEN the featured Claudio card plus 5 team cards MUST be present.

### Requirement: Inversión y Planes

The page MUST render an `InversionBlock` titled `Inversión Seleccionada` with:

- Matrícula Preferencial (Pago Único): `$397 USD`, with interactive controls showing estimated ARS and COP conversion.
- Plan Financiado (aplica a ambos diplomados): Reserva de Vacante `$35 USD` + `6 cuotas mensuales de $65 USD`.
- Condiciones: cuotas del 1 al 10 de cada mes; pagos fuera de plazo con 10% de recargo.

Detail pages (`/diplomados/[slug]`) MUST show the same investment scheme (single $397 / financed $35 + 6×$65) and MUST NOT show `$997`.

- GIVEN the `#inversion` section is rendered
- WHEN inspecting its cards
- THEN both plans and the payment conditions MUST be present with the specified values.

- GIVEN a detail page is rendered
- WHEN inspecting the pricing section
- THEN it MUST show the new scheme and zero occurrences of `997`.

### Requirement: Lead Form Section (`#registro`)

The page MUST render a lead section with anchor id `#registro`, closing phrase `SUPÉRATE SIEMPRE. ROMPE TUS LÍMITES. DA EL PRIMER PASO.` (with "ROMPE TUS LÍMITES." in Energy Red), subtext "Si estás listo para dejar de negociar con tus excusas…", and the admission form per the `admission-form` capability.

- GIVEN the `#registro` section is rendered
- WHEN inspecting its content
- THEN it MUST contain the closing phrase, the subtext, and the admission form component.

### Requirement: No Diplomado en Coaching Cristiano

The page MUST NOT contain the string "Coaching Cristiano" anywhere in the DOM, copy, images, or select options.

- GIVEN the fully rendered page DOM
- WHEN searching for "Coaching Cristiano"
- THEN zero occurrences MUST be found.

### Requirement: Footer

The page MUST render a footer with the PUEDES SER MÁS logo (grayscale, lowered opacity), the mark line `PUEDES SER MÁS es más que una marca:` ending with a red `es un movimiento`, links for Política de Privacidad, Términos de Servicio, and Cookies, plus a copyright notice.

- GIVEN the page is rendered
- WHEN inspecting the footer
- THEN it MUST contain the logo, the movement tagline with the red span, the three policy links, and the copyright line.
