# Tasks: Landing Redesign 7 Bloques

> Desglose de implementación del change `landing-redesign-7-bloques`. Agrupado por fases, numeración jerárquica. Cada tarea completable en una sesión.

## Fase A — Tokens y utilidades

- [ ] A1. Retokenizar `src/styles/global.css` `@theme`: `--color-cta: #C41718`, `--color-cta-hover: #a01313`, `--color-accent: #1F3C87`, `--color-accent-soft: #7ba4e8`. Mantener bg #000000, text #ffffff, surfaces, line.
- [ ] A2. Actualizar `.glass-card` a glassmorphism real (backdrop-blur + borde accent + hover glow accent).
- [ ] A3. Agregar utility `.btn-lift` (sombra 3D + translateY hover con `--ease-out`).
- [ ] A4. Corregir `.text-gradient-cta` para usar `var(--color-cta)`.
- [ ] A5. Barrer hex hardcodeados: `DiplomadoCard.astro:68-69` (rgba(211,47,47)), `AdmissionForm.tsx:248` (rgba(211,47,47)), `NavigationBlock.astro:23` (#ffb3ac), `FooterBlock.astro:33` (#ffb3ac).

## Fase B — Bloques nuevos

- [ ] B1. Actualizar `src/content/authority.ts`: bio Claudio (7+ años, +7 países LatAm) + equipo (Fernando Kolbo, Gastón Molina, Malena Holzman, Carlos Monnery, Daniel Pereira).
- [ ] B2. Crear `src/components/blocks/FilosofiaBlock.astro`: H2 'La persona precede al resultado', cita William James, 3 tarjetas glass (Identidad & Mentalidad / Dominio Emocional / Liderazgo Humano & Comunicación).
- [ ] B3. Crear `src/components/blocks/AdmisionProcesoBlock.astro`: H2 rojo 'Proceso de Selección y Admisión', texto filtro, 3 pasos (Postulación / Entrevista Privada / Admisión Directa). `id="admision"`.
- [ ] B4. Crear `src/components/blocks/AutoridadBlock.astro`: H2 'Facilitadores de Impacto Internacional', ficha principal Claudio (con `claudio-portrait.webp` o placeholder) + 5 fichas equipo.
- [ ] B5. Crear `src/components/blocks/InversionBlock.astro`: H2 'Inversión Seleccionada', tarjeta Matrícula Preferencial $397 USD (pago único) con botones ARS/COP (`<details>` estático, valores estimados), tarjeta Plan Financiado $35 + 6×$65, condiciones 1-10 del mes + 10% recargo.

## Fase C — Bloques existentes

- [ ] C1. Rewrite `src/components/blocks/HeroBlock.astro`: H1 nuevo, subtítulo empático, línea diagonal roja, CTA 'SOLICITAR ENTREVISTA DE ADMISIÓN' → #registro con `.btn-lift`, isotipo flotante de fondo (`/assets/isotype.png`).
- [ ] C2. Actualizar `src/content/diplomados.ts`: títulos nuevos (Coaching para la Superación Personal / Comunicación y Oratoria), enfoques, promesas, fechas (Martes 15 Sept 2026 / Miércoles 16 Sept 2026), plazas 15, pricing nuevo ($397 / $35 + 6×$65), meta descripciones.
- [ ] C3. Extender `src/components/blocks/DiplomadoCard.astro` con props `enfoque[]`, `promesa`, `fechaInicio`, `plazas`.
- [ ] C4. Rewrite `src/components/blocks/DiplomadosGrid.astro`: título '¿Cuál es tu siguiente nivel de transformación?', consumir diplomados.ts, CTAs 'VER MAPA DE TRANSFORMACIÓN' → `/diplomados/<slug>`.
- [ ] C5. Actualizar copy de `src/components/blocks/AdmissionBlock.astro`: frase 'SUPÉRATE SIEMPRE. ROMPE TUS LÍMITES. DA EL PRIMER PASO.', subtexto excusas.

## Fase D — Formulario + backend

- [ ] D1. Actualizar `src/components/islands/AdmissionForm.tsx`: campos `name`, `phone`, `desafioPrincipal` (select 3 opciones), `porQueSerSeleccionado` (textarea), honeypot; CTA 'EVALUAR MI PERFIL DE ADMISIÓN'; validación zod cliente.
- [ ] D2. Actualizar `src/lib/validators/admission.ts`: quitar email y diplomado; agregar `desafioPrincipal` enum + `porQueSerSeleccionado` min 10.
- [ ] D3. Actualizar `src/db/schema.ts`: `email` nullable, agregar `desafio_principal` (text notNull) y `por_que_ser_seleccionado` (text notNull).
- [ ] D4. Generar migración Drizzle (`pnpm db:generate`) y aplicarla (`pnpm db:migrate`).
- [ ] D5. Actualizar `src/pages/api/admission.ts`: quitar chequeo duplicado email, insertar columnas nuevas, derivar `diplomado` de `desafioPrincipal` (mentalidad→liderazgo, comunicacion→comunicacion, ambos→ambos).
- [ ] D6. Actualizar tipo `DiplomadoPricing` en `src/content/diplomado.ts` y `DetailPricingBlock.astro` si el shape cambia (sincronizar `src/pages/diplomados/[slug].astro` si es necesario).

## Fase E — Composición + meta + anclas

- [ ] E1. Componer `src/pages/index.astro` con el orden: Navigation → Hero → Filosofia → Diplomados → AdmisionProceso → Autoridad → Inversion → Admission → Footer. Actualizar title/description.
- [ ] E2. Actualizar `src/components/blocks/NavigationBlock.astro`: sticky, logo izq, CTA 'POSTULAR AHORA' → #admision, corregir anclas muertas.
- [ ] E3. Corregir hover hex en `FooterBlock.astro`.

## Fase F — Specs maestras

- [ ] F1. Amendar `openspec/specs/landing-multidiplomado/spec.md` al nuevo layout de 7 bloques.
- [ ] F2. Amendar `openspec/specs/design-tokens/spec.md` a la paleta nueva.
- [ ] F3. Amendar `openspec/specs/admission-form/spec.md` al nuevo shape.
- [ ] F4. Actualizar `src/lib/seo.ts` si referencia fechas/precios viejos (Mayo 2026).
