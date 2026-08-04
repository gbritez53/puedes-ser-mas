# Design: Landing Redesign 7 Bloques

> Documento técnico del change `landing-redesign-7-bloques`. Decisions y enfoque de implementación para el apply.

## D1. Arquitectura de componentes

### D1.1 Composición final de la home

```
src/pages/index.astro
├── NavigationBlock        (sticky, logo izq + POSTULAR AHORA der)
├── main
│   ├── HeroBlock          (rewrite copy + línea diagonal + isotipo bg)
│   ├── FilosofiaBlock     (NUEVO)
│   ├── DiplomadosGrid     (rewrite con datos nuevos)
│   ├── AdmisionProcesoBlock (NUEVO, id="admision")
│   ├── AutoridadBlock     (NUEVO)
│   ├── InversionBlock     (NUEVO)
│   └── AdmissionBlock     (copy + form nuevo)
└── FooterBlock            (solo hover hex fix)
```

### D1.2 Patrón de datos

- Decisión: los bloques NUEVOS (Filosofia, AdmisionProceso, Autoridad, Inversion) MAY llevan su contenido hardcodeado (consistente con el patrón actual de la home), EXCEPTO:
  - `AutoridadBlock` SHOULD consumir `src/content/authority.ts` (actualizado con bio nueva + equipo) para centralizar nombres.
  - `DiplomadosGrid` SHOULD consumir `src/content/diplomados.ts` actualizado (para no duplicar y porque las páginas detalle ya lo usan).
- `DiplomadoCard.astro` se extiende con props: `enfoque: string[]`, `promesa: string`, `fechaInicio: string`, `plazas: string`, manteniendo `chip, title, description, cta, href, imageUrl`.

### D1.3 Detalle (sin cambios estructurales)

- `DetailHeroBlock`, `DetailSkillsBlock`: NO se modifican.
- `DetailPricingBlock`: se actualizan solo los datos que llegan por props (`pricing` desde `diplomados.ts`). El tipo `DiplomadoPricing` se extiende con el esquema de dos planes si es necesario; si no, el pricing block MAY seguir mostrando un monto principal pero con el valor nuevo ($397) y el detalle del plan financiado en el checklist.

## D2. Tokens y utilities (global.css)

- Retokenizar en `@theme`: `cta #C41718`, `cta-hover #a01313`, `accent #1F3C87`, `accent-soft #7ba4e8`. Se mantienen `bg #000000`, `text #ffffff`, surfaces y line.
- En `@layer components`:
  - `.glass-card` → glassmorphism real: `background: color-mix(in srgb, var(--color-surface) 85%, transparent); backdrop-filter: blur(8px); border: 1px solid color-mix(in srgb, var(--color-accent) 30%, transparent);` hover: borde accent + glow accent.
  - `.btn-lift` → CTA 3D: `box-shadow: 0 4px 0 color-mix(in srgb, var(--color-cta) 55%, black); transition: transform .2s var(--ease-out), box-shadow .2s var(--ease-out);` hover: `transform: translateY(-2px); box-shadow: 0 6px 0 ...`.
  - `.text-gradient-cta` → usar `var(--color-cta)`.
- Barrido de hex hardcodeados: DiplomadoCard glow, AdmissionForm shadow, Nav/Footer hover `#ffb3ac`.

## D3. Hero (implementación)

- Mantener estructura `<section>` existente; reemplazar copy.
- Línea diagonal roja: pseudo-elemento `::after` en el section con `position:absolute`, `transform: rotate(-2deg)`, `height: 4px`, `background: var(--color-cta)`, `bottom: 24px`, ancho 120%. Simple, sin SVG.
- Isotipo de fondo: `<img src="/assets/isotype.png" alt="" class="absolute opacity-10" />` flotando (animación CSS sutil `animation: float 6s ease-in-out infinite`) + borde rojo/destello azul con filtros CSS (`drop-shadow`).
- CTA con `.btn-lift`.

## D4. Formulario + backend

- `AdmissionForm.tsx`: reemplazar campos. Estado del form: `{ name, phone, desafioPrincipal, porQueSerSeleccionado, honeypot }`. Select con las 3 opciones del brief; textarea para el motivo. CTA `EVALUAR MI PERFIL DE ADMISIÓN`.
- `admission.ts` (validator zod): quitar email y diplomado; agregar `desafioPrincipal` enum + `porQueSerSeleccionado` min 10.
- `schema.ts`: `email` pasa a `.text()` (nullable); nuevas columnas `desafio_principal` (text notNull) y `por_que_ser_seleccionado` (text notNull). Columna `diplomado` mantiene notNull; se deriva en el handler: `{ mentalidad: 'liderazgo', comunicacion: 'comunicacion', ambos: 'ambos' }`.
- `api/admission.ts`: quitar chequeo duplicado de email; insertar con columnas nuevas; `diplomado` derivado. Mantener rate-limit + honeypot + 422/201.
- Migración Drizzle: `pnpm db:generate` (additive), luego `pnpm db:migrate`. Debe permitir `ambos` como valor — si Drizzle genera enum de texto plano, basta con que el validator acepte 'ambos'.

## D5. Precios sincronizados

- `src/content/diplomados.ts`: pricing pasa de `amount: '997'` a estructura nueva. Propuesta de tipo:
  ```ts
  pricing: {
    single: { label: 'Matrícula Preferencial', amount: '397', currency: 'USD', note: 'Pago único' },
    financed: { reservation: '35', monthly: '65', installments: 6, note: '6 cuotas mensuales' },
    conditions: 'Cuotas del 1 al 10 de cada mes. 10% de recargo fuera de plazo.',
    headline: 'Inversión Seleccionada',
    ctaLabel: 'COMENZAR TRANSFORMACIÓN',
    ctaHref: '/#registro'
  }
  ```
- `DetailPricingBlock` recibe el objeto y muestra: monto único $397 + detalle financiado ($35 + 6×$65) + condiciones. Ajuste de props (no estructural).

## D6. Inversión: conversión ARS/COP

- Botones de conversión: interacción cliente pura con `client:load` en un island ligero o CSS-only con `<details>`. Decisión: usar `<details>`/`<summary>` (sin JS) mostrando valores fijos estimados:
  - $397 USD ≈ $380.000 ARS / ≈ $1.700.000 COP (valores estimados a agosto 2026, nota: "estimado").
- Si se prefiere dinámico, el island requeriría API externa de FX — fuera de alcance. Se usa estático con etiqueta "valores estimados".

## D7. Consideraciones de rendimiento (Core Web Vitals)

- Isotipo de fondo: `loading="lazy"` no aplica en hero (LCP); usar `decoding="async"` + `fetchpriority="high"` en el logo, `lazy` para el resto de imágenes.
- No agregar JS innecesario: los bloques nuevos son estáticos (Astro); solo `AdmissionForm` es island (`client:visible`).
- Sin nuevas dependencias.

## D8. Riesgos de implementación

1. **Drizzle enum**: si la columna `diplomado` tiene check constraint SQL, agregar 'ambos' requiere alter; verificar migración generada.
2. **`DetailPricingBlock`**: cambiar el shape del pricing rompe su template → aplicar cambios de props juntos en el mismo batch.
3. **Anclas**: `#registro` debe seguir existiendo; nav CTA apunta a `#admision` o `#registro` — consistencia en toda la página.
4. **`claudio-portrait.webp`**: si existe se usa; si no, placeholder con iniciales (no romper layout).

## D9. Orden de implementación (batches)

1. **Batch A — Tokens + utilidades**: global.css (retokenización, glass, lift, gradient) + barrido de hex en Nav/Footer/DiplomadoCard/AdmissionForm.
2. **Batch B — Bloques nuevos**: FilosofiaBlock, AdmisionProcesoBlock, AutoridadBlock, InversionBlock (con data de authority.ts actualizada).
3. **Batch C — Bloques existentes**: HeroBlock, DiplomadosGrid + DiplomadoCard + diplomados.ts (títulos/fechas/precios), AdmissionBlock copy.
4. **Batch D — Formulario + backend**: AdmissionForm.tsx, admission.ts validator, schema.ts + migración, api/admission.ts, [slug].astro si el tipo pricing cambia.
5. **Batch E — Composición + meta + anclas**: index.astro, NavigationBlock, FooterBlock, meta tags.
6. **Batch F — Specs maestras**: amendar openspec/specs (landing, design-tokens, admission-form).
