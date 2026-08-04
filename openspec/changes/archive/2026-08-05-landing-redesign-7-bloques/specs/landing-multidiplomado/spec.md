# Spec: Landing Page Multidiplomado (Delta — 7 Bloques)

> Delta spec para el change `landing-redesign-7-bloques`. Reemplaza la home de 4 bloques por la de 7 bloques definida en el brief del diseñador. Palabras clave RFC 2119: MUST / SHOULD / MAY.

## Composición de la página (`src/pages/index.astro`)

### P1. Orden de bloques

- MUST renderizar los bloques en este orden: `NavigationBlock` → `HeroBlock` → `FilosofiaBlock` → `DiplomadosGrid` → `AdmisionProcesoBlock` → `AutoridadBlock` → `InversionBlock` → `AdmissionBlock` → `FooterBlock`.
- MUST mantener comentado el import y uso de `ParticleFigureBlock` (efecto de partículas desactivado temporalmente, archivo intacto).
- MUST actualizar `title` y `description` del meta:
  - title: `PUEDES SER MÁS — Transformación Personal y Profesional`
  - description: `Diplomados de Coaching para la Superación Personal y Comunicación y Oratoria. Transformá tu vida: solicitá tu entrevista de admisión hoy.`

### P2. Anclas

- MUST mantener `id="diplomados"` en `DiplomadosGrid`.
- MUST asignar `id="admision"` al `AdmisionProcesoBlock`.
- MUST mantener `id="registro"` en `AdmissionBlock`.
- Los CTAs de hero y nav MAY apuntar a `#admision` o `#registro` según el flujo de conversión.

## Bloque 1 — Hero (`HeroBlock.astro`)

### H1. Estructura

- MUST mostrar el H1 exacto: `EL LÍMITE DE TU CRECIMIENTO NUNCA ES TU NEGOCIO, ES TU MENTALIDAD.`
- SHOULD resaltar la segunda parte (`ES TU MENTALIDAD.`) con el color CTA (Rojo Energía `#C41718`).

### H2. Subtítulo

- MUST mostrar el subtítulo: `En Puede Ser Más no entrenamos proyectos; transformamos a la persona que los lidera. Forja un carácter inquebrantable, domina tu mundo emocional y comunica con presencia absoluta.`

### H3. Línea diagonal roja

- MUST incluir una línea diagonal en `#C41718` cruzando el corte inferior del bloque (ruptura y avance).
- SHOULD implementarse con un elemento decorativo (SVG o pseudo-elemento) rotado.

### H4. CTA

- MUST mostrar el botón: `SOLICITAR ENTREVISTA DE ADMISIÓN` con clase CTA (Rojo Energía) y efecto de elevación 3D (lift).
- MUST enlazar a `#registro`.
- SHOULD usar la utility de lift 3D definida en design-tokens.

### H5. Fondo

- MUST usar el isotipo PSM (flecha ascendente) como fondo decorativo en baja opacidad, con bordes en Rojo Energía y destello Azul Progreso.
- Asset disponible: `/assets/isotype.png`.
- SHOULD mantener el fondo negro mate (`#000000`) con degradado sutil.
- SHOULD mantener los estilos existentes de gradiente de hero si no contradicen el brief.

## Bloque 2 — La Filosofía PSM (`FilosofiaBlock.astro`, NUEVO)

### F1. Titular

- MUST mostrar el H2: `La persona precede al resultado`.

### F2. Cita

- MUST mostrar la cita: `El mayor descubrimiento de mi generación es que un ser humano puede cambiar su vida cambiando su actitud mental.` — William James.
- SHOULD presentarse como bloque destacado (cita grande con autor).

### F3. Tarjetas

- MUST renderizar 3 tarjetas con estilo glassmorphism (borde sutil Azul Progreso `#1F3C87`):
  1. `Identidad & Mentalidad` — destrucción de creencias limitantes, eliminación de la zona de confort y reprogramación hacia la grandeza.
  2. `Dominio Emocional` — autorregulación en vivo bajo alta presión, serenidad e inteligencia emocional aplicada.
  3. `Liderazgo Humano & Comunicación` — expresión desde la verdad, superación del miedo al ridículo y capacidad de movilizar vidas.
- Cada tarjeta MUST tener título + descripción; SHOULD tener un ícono.

## Bloque 3 — Selección de Diplomados (`DiplomadosGrid.astro` + `DiplomadoCard.astro`)

### D1. Titular

- MUST mostrar el H2: `¿Cuál es tu siguiente nivel de transformación?`

### D2. Tarjetas

- MUST renderizar exactamente 2 tarjetas paralelas con detalles en Rojo Energía:

**Tarjeta 1 — DIPLOMADO DE COACHING PARA LA SUPERACIÓN PERSONAL**

- Enfoque: Liderazgo Interno, Gestión Emocional y Propósito.
- Promesa: `Forjarás una mentalidad inquebrantable, dominio emocional absoluto y un liderazgo con propósito.`
- Aulas: Exclusivas (Máximo 15 plazas por entrevista).
- Inicio: `Martes 15 de Septiembre 2026`.
- CTA: `VER MAPA DE TRANSFORMACIÓN`.

**Tarjeta 2 — DIPLOMADO EN COMUNICACIÓN Y ORATORIA**

- Enfoque: Presencia Escénica, Storytelling y Dominio Oral.
- Promesa: `Destruirás la timidez, eliminarás las máscaras y dominarás el arte de la presencia escénica.`
- Aulas: Exclusivas (Máximo 15 plazas por entrevista).
- Inicio: `Miércoles 16 de Septiembre 2026`.
- CTA: `VER MAPA DE TRANSFORMACIÓN`.

### D3. Datos

- SHOULD extraer los datos de `src/content/diplomados.ts` (actualizando ese archivo) en lugar de duplicar arrays hardcodeados.
- MUST actualizar los títulos, fechas y precios en `src/content/diplomados.ts` al nuevo esquema (ver spec design-tokens / inversión).
- MUST enlazar los CTAs a `/diplomados/<slug>` (coaching-y-liderazgo / comunicacion-y-oratoria).

### D4. Card

- MUST extender `DiplomadoCard.astro` con props para `enfoque[]`, `promesa`, `fechaInicio`, `plazas` (o campos equivalentes).
- MUST corregir los hex hardcodeados de glow en `DiplomadoCard.astro:68-69` para usar la paleta nueva (Rojo Energía).

## Bloque 4 — Proceso de Admisión de Élite (`AdmisionProcesoBlock.astro`, NUEVO)

### A1. Titular

- MUST mostrar el H2 en Rojo Energía: `Proceso de Selección y Admisión`.

### A2. Texto filtro

- MUST mostrar: `No vendemos cursos masivos. Buscamos personas en constante evolución que rechacen el conformismo y la mediocridad.`

### A3. Pasos

- MUST renderizar el flujo de 3 pasos (con íconos del isotipo en distintas fases de ascenso):
  1. `Postulación` — Completa el formulario de evaluación de perfil.
  2. `Entrevista Privada` — Evaluación 1 a 1 para verificar tu nivel de compromiso.
  3. `Admisión Directa` — Confirmación de vacante y asignación de Matrícula Preferencial.

## Bloque 5 — Autoridad y Cuerpo Docente (`AutoridadBlock.astro`, NUEVO)

### AU1. Titular

- MUST mostrar el H2: `Facilitadores de Impacto Internacional`.

### AU2. Ficha principal

- MUST mostrar la ficha destacada de `Claudio Español`:
  - CEO y Fundador de Puede Ser Más, Director de la Academia de Superación.
  - Coach Ontológico con más de 7 años acompañando a líderes en +7 países de Latinoamérica.
- SHOULD usar `/assets/claudio-portrait.webp` si existe.
- SHOULD actualizar `src/content/authority.ts` con la bio nueva (7+ años, +7 países LatAm) y usarla como fuente de datos.

### AU3. Equipo de soporte

- MUST mostrar fichas profesionales de: `Fernando Kolbo`, `Gastón Molina`, `Malena Holzman`, `Carlos Monnery`, `Daniel Pereira`.
- Fotografías pendientes: SHOULD usar placeholders o iniciales (no romper layout).

## Bloque 6 — Inversión y Planes Preferenciales (`InversionBlock.astro`, NUEVO)

### I1. Titular

- MUST mostrar el H2: `Inversión Seleccionada`.

### I2. Matrícula Preferencial

- MUST mostrar la tarjeta `Matrícula Preferencial (Pago Único)` con precio `$397 USD`.
- MUST incluir botones interactivos para ver conversión estimada a Pesos Argentinos (ARS) y Pesos Colombianos (COP).

### I3. Plan Financiado

- MUST mostrar la tarjeta `Plan Financiado (Aplica para ambos diplomados)`:
  - Reserva de Vacante: Matrícula de `$35 USD` para asegurar lugar.
  - Cuotas: `6 cuotas mensuales de $65 USD`.
- MUST mostrar las condiciones de pago: las cuotas se abonan del 1 al 10 de cada mes; los pagos fuera de este plazo tienen un 10% de recargo.

### I4. Sincronización de precios

- MUST actualizar `src/content/diplomados.ts` para que las páginas de detalle muestren el mismo esquema ($397 / $35 + 6×$65), eliminando el `$997 USD`.
- MUST actualizar el tipo `DiplomadoPricing` en `src/content/diplomado.ts` si el esquema nuevo requiere campos adicionales (pago único, financiado, condiciones).
- `src/pages/diplomados/[slug].astro` MUST seguir funcionando con el tipo actualizado.

## Bloque 7 — Cierre y Formulario (`AdmissionBlock.astro`)

### C1. Frase de cierre

- MUST mostrar el H2: `SUPÉRATE SIEMPRE. ROMPE TUS LÍMITES. DA EL PRIMER PASO.`
- SHOULD usar tipografía heading (Bebas Neue/Gotham Bold según tokens).

### C2. Subtexto

- MUST mostrar: `Si estás listo para dejar de negociar con tus excusas y asumir el liderazgo real de tu vida, tu proceso empieza hoy.`

### C3. Formulario

- MUST renderizar el `AdmissionForm` con los campos del spec `admission-form` (nombre, WhatsApp, desafío principal, por qué ser seleccionado).
- MUST mostrar el CTA: `EVALUAR MI PERFIL DE ADMISIÓN`.

## Casos de prueba

### CP1. Composición

- Given la home, When se carga, Then los 7 bloques aparecen en orden P1 y los ids de ancla (diplomados, admision, registro) existen.

### CP2. Hero

- Given el HeroBlock, When se renderiza, Then muestra el H1, subtítulo, línea diagonal roja, CTA `SOLICITAR ENTREVISTA DE ADMISIÓN` y fondo con isotipo.

### CP3. Diplomados

- Given el DiplomadosGrid, When se renderiza, Then muestra 2 tarjetas con los datos D2 exactos y CTAs que enlazan a `/diplomados/<slug>`.

### CP4. Precios

- Given las páginas detalle, When se navega a `/diplomados/coaching-y-liderazgo`, Then el pricing muestra el esquema nuevo ($397 / $35 + 6×$65) y NO muestra $997.

### CP5. Formulario

- Given el AdmissionBlock, When se envía el formulario, Then POST `/api/admission` con el body del spec admission-form y se muestra estado de éxito.

### CP6. Anclas

- Given la NavigationBlock, When se hace clic en `POSTULAR AHORA`, Then navega a un ancla válida existente en la página.
