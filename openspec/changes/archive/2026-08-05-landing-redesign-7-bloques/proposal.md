# Propuesta: Landing Redesign 7 Bloques

## Contexto

Proyecto **PUEDES SER MÁS** (Astro 6 SSR, Tailwind v4 `@theme`, React 18 islands, Turso + Drizzle, pnpm).

El usuario trajo un brief de diseño del diseñador que reconstruye la home en 7 bloques. El brief es la fuente de verdad del copy, la paleta y la estructura.

**Estado actual:** `index.astro` compone `NavigationBlock → HeroBlock → (ParticleFigureBlock comentado) → DiplomadosGrid → AdmissionBlock → FooterBlock`. Todo el copy de la home está hardcodeado dentro de los componentes; `index.astro` no consume ningún archivo de contenido. Content files huérfanos: `authority.ts` (solo Claudio, bio 15 años), `bonuses.ts`, `curriculum.ts`, `saboteurs.ts`. `diplomados.ts` lo usan las páginas detalle con precios `$997 USD`. Tokens actuales: `cta #d32f2f`, `accent #005db7`.

## Alcance

### In (7 bloques)

1. **HERO** — Nuevo H1 `EL LÍMITE DE TU CRECIMIENTO NUNCA ES TU NEGOCIO, ES TU MENTALIDAD.`, subtítulo empático ("no entrenamos proyectos; transformamos a la persona que los lidera..."), línea diagonal roja `#C41718` cruzando el corte inferior, CTA `SOLICITAR ENTREVISTA DE ADMISIÓN` con efecto de elevación 3D, isotipo flotante de fondo. Header sticky: logo izq + botón `POSTULAR AHORA` der.
2. **NUEVO `FilosofiaBlock.astro`** — H2 `La persona precede al resultado`, cita de William James, 3 tarjetas glassmorphism con bordes sutiles azules: _Identidad & Mentalidad_, _Dominio Emocional_, _Liderazgo Humano & Comunicación_.
3. **`DiplomadosGrid` + `DiplomadoCard`** — Título `¿Cuál es tu siguiente nivel de transformación?`, 2 tarjetas paralelas: _Diplomado de Coaching para la Superación Personal_ (Enfoque: Liderazgo Interno/Gestión Emocional/Propósito; promesa mentalidad inquebrantable) y _Diplomado en Comunicación y Oratoria_ (Enfoque: Presencia Escénica/Storytelling/Dominio Oral; promesa destruir timidez). Ambas: 15 plazas exclusivas, fechas 15/16 Sept 2026, CTA `VER MAPA DE TRANSFORMACIÓN`.
4. **NUEVO `AdmisionProcesoBlock.astro`** — `Proceso de Selección y Admisión` (rojo), texto filtro ("No vendemos cursos masivos..."), 3 pasos: Postulación / Entrevista Privada / Admisión Directa.
5. **NUEVO `AutoridadBlock.astro`** — `Facilitadores de Impacto Internacional`, ficha principal Claudio Español (CEO Fundador, Director Academia de Superación, Coach Ontológico 7+ años, +7 países LatAm), equipo: Fernando Kolbo, Gastón Molina, Malena Holzman, Carlos Monnery, Daniel Pereira.
6. **NUEVO `InversionBlock.astro`** — `Inversión Seleccionada`, Matrícula Preferencial $397 USD pago único (botones ARS/COP), Plan Financiado $35 reserva + 6 cuotas × $65, cuotas 1–10 del mes, 10% recargo fuera de plazo.
7. **`AdmissionBlock` + `AdmissionForm`** — Frase cierre `SUPÉRATE SIEMPRE. ROMPE TUS LÍMITES. DA EL PRIMER PASO.`, subtexto sobre excusas. Form: nombre completo, WhatsApp, desafío principal (select), por qué debes ser seleccionado (textarea), CTA `EVALUAR MI PERFIL DE ADMISIÓN`.

### Out

- Efecto de partículas (queda desactivado, archivo intacto).
- Bloques de detalle de diplomados (`DetailHeroBlock`, `DetailSkillsBlock`) — solo se sincroniza pricing.
- Contenido no mencionado en el brief (saboteurs, curriculum, bonuses) — no se integran.
- Fotografías del equipo (pendiente sumar, según brief).

## Decisiones del orquestador

1. **Paleta:** retokenizar `--color-cta #C41718` (+hover ~`#a01313`), `--color-accent #1F3C87` (+soft variant). Mantener `bg #000000`, `text #FFFFFF`. Barrer hex hardcodeados (`DiplomadoCard.astro:68-69`, `AdmissionForm.tsx:248`, `NavigationBlock.astro:23`, `FooterBlock.astro:33`, `global.css:86`). Agregar utility glassmorphism y lift 3D.
2. **Detalle:** sincronizar precios en `src/content/diplomados.ts` de `$997` al nuevo esquema ($397 / $35 + 6×$65). Actualizar tipo `DiplomadoPricing` si hace falta.
3. **Backend form:** agregar `desafio_principal` (enum mentalidad/comunicacion/ambos) + `por_que_ser_seleccionado` (textarea) a `schema.ts` con migración Drizzle, validator y API. Sacar email y select de diplomado del UI del formulario. Hacer email nullable en DB (quitar chequeo duplicado). Derivar `diplomado` de `desafio_principal` (mentalidad→liderazgo, comunicacion→comunicacion, ambos→ambos agregado al enum).

## Archivos afectados

- `src/styles/global.css` — tokens + utilities (glass, lift 3D)
- `src/components/blocks/NavigationBlock.astro` — sticky + POSTULAR AHORA
- `src/components/blocks/HeroBlock.astro` — rewrite
- `src/components/blocks/FilosofiaBlock.astro` — NEW
- `src/components/blocks/DiplomadosGrid.astro`, `DiplomadoCard.astro` — rewrite
- `src/components/blocks/AdmisionProcesoBlock.astro` — NEW
- `src/components/blocks/AutoridadBlock.astro` — NEW
- `src/components/blocks/InversionBlock.astro` — NEW
- `src/components/blocks/AdmissionBlock.astro` — copy
- `src/components/islands/AdmissionForm.tsx` — campos nuevos
- `src/pages/index.astro` — composición + meta
- `src/pages/api/admission.ts`, `src/db/schema.ts`, `src/lib/validators/admission.ts` + migración Drizzle
- `src/content/diplomados.ts`, `src/content/authority.ts`, `src/content/diplomado.ts`
- `openspec/specs/landing-multidiplomado/spec.md`, `design-tokens/spec.md`, `admission-form/spec.md` — amendar
- `src/pages/diplomados/[slug].astro` — si cambia el tipo pricing

## Riesgos

- Conflicto de paleta con specs openspec activos → se amendarán los specs.
- Migración DB con columna UNIQUE email → se hace nullable (no destructiva).
- Sincronización de precios home vs detalle → decisión 2.
- Content files huérfanos → no se tocan más allá de authority.ts.
- Anclas muertas nav/footer → se corrigen en el redesign.

## Plan de rollback

`git revert` del commit de implementación. La migración Drizzle es aditiva (columna nueva + email nullable) → reversible sin pérdida de datos.

## Criterios de aceptación

- Los 7 bloques renderizados en orden en `index.astro` con el copy exacto del brief.
- Precios consistentes entre home y páginas detalle.
- Formulario envía los campos nuevos a `/api/admission` (201) sin email obligatorio.
- Migración Drizzle aplicada; paleta nueva en tokens; specs openspec amedados.
