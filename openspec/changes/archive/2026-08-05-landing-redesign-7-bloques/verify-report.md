# Verify Report: landing-redesign-7-bloques

Fecha: 2026-08-05 · Modo: auto · Backend: openspec

## Resumen

**Status: PASS** con 1 hallazgo menor (CSS muerto de cache dev).

La implementación del redesign de 7 bloques se validó contra las delta specs (`landing-multidiplomado`, `design-tokens`, `admission-form`) con: lint de todos los archivos tocados (0 errores), typecheck TS (0 errores fuera de archivos demo preexistentes), smoke test en dev server (HTTP 200 en home y detalle), y prueba end-to-end del formulario contra Turso (201 + limpieza del registro).

## Checklist por spec

### landing-multidiplomado

| ID      | Verificación                                            | Estado | Evidencia                                                                                                                                             |
| ------- | ------------------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1      | 7 bloques en orden en index.astro                       | PASS   | `index.astro` compone Navigation→Hero→Filosofia→Diplomados→AdmisionProceso→Autoridad→Inversion→Admission→Footer; meta actualizada                     |
| P2      | Anclas válidas                                          | PASS   | ids en DOM: `filosofia`, `diplomados`, `admision`, `inversion`, `registro`                                                                            |
| H1-H5   | Hero nuevo: H1, subtítulo, línea diagonal, CTA, isotipo | PASS   | H1 exacto renderizado, CTA `SOLICITAR ENTREVISTA DE ADMISIÓN` → `#registro`, `.hero-diagonal` rojo, isotipo flotante                                  |
| F1-F3   | FilosofiaBlock: H2, cita James, 3 tarjetas glass        | PASS   | `La persona precede al resultado`, cita con autor, 3 pillar cards con `glass-card`                                                                    |
| D1-D4   | Diplomados: título, 2 tarjetas, datos, CTAs             | PASS   | `CUÁL ES TU SIGUIENTE NIVEL DE TRANSFORMACIÓN?`, 2 cards con enfoque/promesa/fecha/plazas, CTA `VER MAPA DE TRANSFORMACIÓN` → `/diplomados/<slug>`    |
| A1-A3   | AdmisionProcesoBlock: 3 pasos                           | PASS   | `Proceso de Selección y Admisión` (rojo), texto filtro, 3 pasos con `id="admision"`                                                                   |
| AU1-AU3 | AutoridadBlock                                          | PASS   | `Facilitadores de Impacto Internacional`, Claudio (bio 7+ años/+7 países) + 5 fichas equipo renderizadas                                              |
| I1-I4   | InversionBlock + sync precios                           | PASS   | `Inversión Seleccionada`, $397 pago único + ARS/COP estimados, Plan Financiado $35 + 6×$65, condiciones 10% recargo. Detalle pages: $397 y sin `$997` |
| C1-C3   | AdmissionBlock copy nuevo                               | PASS   | `SUPÉRATE SIEMPRE. ROMPE TUS LÍMITES. DA EL PRIMER PASO.`, subtexto excusas, form con `id="registro"`                                                 |
| CP1-CP6 | Casos de prueba                                         | PASS   | Todos verificados en smoke test                                                                                                                       |

### design-tokens

| ID        | Verificación           | Estado | Evidencia                                                                                        |
| --------- | ---------------------- | ------ | ------------------------------------------------------------------------------------------------ |
| T1        | Tokens nuevos          | PASS   | `--color-cta: #c41718`, `--color-accent: #1f3c87`, `--color-accent-soft: #7ba4e8` en CSS servido |
| T2        | Utilities glass + lift | PASS   | `.glass-card` con backdrop-blur, `.btn-lift` con sombra 3D + hover                               |
| T3        | Barrido hex            | PASS   | Ningún elemento DOM usa `#d32f2f`/`#005db7`/`#ffb3ac`/`rgba(211,47,47`                           |
| TPT1-TPT3 | Casos de prueba        | PASS   | Tokens aplicados; sin literales viejos en DOM; lift presente                                     |

### admission-form

| ID        | Verificación        | Estado | Evidencia                                                                                                                     |
| --------- | ------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------- |
| F1        | Campos nuevos + CTA | PASS   | name, phone, select desafío (3 opciones), textarea motivo, honeypot; CTA `EVALUAR MI PERFIL DE ADMISIÓN`                      |
| F2        | API nuevo body      | PASS   | POST válido → 201; payload inválido → 422 con mensajes en español; honeypot rechazado                                         |
| F3        | Migración DB        | PASS   | `desafio_principal` + `por_que_ser_seleccionado` creadas (default ''), `email` nullable, tracking de 3 migraciones registrado |
| F4        | Validator           | PASS   | schema con name/phone/desafioPrincipal/porQueSerSeleccionado/honeypot                                                         |
| FPT1-FPT5 | Casos               | PASS   | Insert E2E: `diplomado: 'ambos'` derivado de `desafio_principal: 'ambos'`, `email: null`                                      |

## Hallazgos

### WARNING → resuelto durante implementación

- **Migración Drizzle falló**: `Cannot add a NOT NULL column with default value NULL` (SQLite no permite columna NOT NULL sin default en tabla con datos). Resuelto agregando `DEFAULT ''` a las columnas nuevas. Las filas históricas quedan con '' — aceptable porque el formulario nuevo siempre envía valores.
- **`__drizzle_migrations` vacía**: las migraciones previas se aplicaron vía push, no migrate. Registradas las 3 migraciones para consistencia futura.

### SUGGESTION (no bloqueante)

- **CSS muerto de cache dev**: el dev server del usuario (4321) comparte `node_modules/.vite` y aún genera utilidades Tailwind viejas (`border-[#005db7]`, `text-[#d32f2f]`, `text-[#ffb3ac]`) que NINGÚN elemento del DOM usa. Cero impacto visual/rendimiento real (no se incluyen en build). Se resuelve reiniciando el server dev (cache se regenera limpio).

## Errores preexistentes fuera de alcance

- `src/components/demo.tsx` y `src/components/multiple-steps/demo.tsx`: archivos demo huérfanos con errores de lint/TS (dependencias no instaladas: framer-motion, lucide-react, sonner). No se importan en ningún lado. No se tocaron.

## Conclusión

Cambio listo para archivar. Los 7 bloques renderizan con el copy exacto del brief, los precios están sincronizados home/detalle ($397 / $35 + 6×$65), el formulario envía los campos nuevos a Turso (201) y la paleta respeta el manual de marca (#C41718 / #1F3C87).
