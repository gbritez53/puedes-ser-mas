# Design: Diplomado Detail Pages

## 1. Architecture Decision — dynamic route `[slug].astro` + typed content map

**Decision: ONE dynamic route `src/pages/diplomados/[slug].astro` driven by a typed content map `src/content/diplomados.ts`.** Recommended over two static pages.

**Rationale:** The content model is data (copy + token-only styling), so one template renders both diplomados. Adding the Nth diplomado is a single map entry, not a new page file. There is no per-page logic that justifies duplication, and SEO meta is already data-driven (`meta` per entry). Visual parity with `knowledge/landing/detalle_del_diplomado_puedes_ser_m_s/code.html` is a one-to-one template reused for both.

## 2. Routing — `src/pages/diplomados/[slug].astro`

The project runs `output: 'server'` with `@astrojs/vercel` (`astro.config.mjs`). Clarification of dynamic routing in SSR mode:

- **Server/output on-demand is the default.** In `output: 'server'`, a `.astro` file under `src/pages` is an on-demand route, so `src/pages/diplomados/[slug].astro` automatically matches every `/diplomados/*` request at runtime. No `getStaticPaths` is needed for this to work.
- **`getStaticPaths()` is ONLY honored when the page is prerendered** (`export const prerender = true`). Without `prerender = true` it is ignored. We do NOT want prerendering (Vercel will render on each request; the map is static anyway), so **do NOT add `getStaticPaths`** and keep the page on-demand. Optionally write `export const prerender = false;` explicitly for clarity — it is the server-mode default and harmless.
- **Slug lookup + 404 fallback:** read `const { slug } = Astro.params;`, look up `diplomados[slug]`. If missing, terminate with a real 404:

```ts
const { slug } = Astro.params;
const diplomado = diplomados[slug];

if (!diplomado) {
  return new Response('Not Found', { status: 404 });
}
```

This guarantees an HTTP `404` status regardless of whether a `src/pages/404.astro` exists. (Alternative, optional: `Astro.redirect('/404')`, which serves a styled 404 but requires a `404.astro` page. Not in scope; the 404 Response is the recommended default. The spec allows either.)

- `@astrojs/vercel` handles the serverless route automatically; no config change.

## 3. Content model

`src/content/` files are plain TypeScript data modules (existing pattern: `curriculum.ts`, `bonuses.ts` …) — **not** an Astro content collection (no `content.config.ts` exists). So `diplomados.ts` and `diplomado.ts` follow the same convention.

### `src/content/diplomado.ts` (new type definitions)

```ts
export interface DiplomadoSkill {
  icon: string; // Material Symbol name, e.g. 'psychology'
  title: string;
  description: string;
  size: 'large' | 'small';
}

export interface DiplomadoPricing {
  amount: string; // '997' (spec: pricing.amount === '997')
  currency: string; // 'USD'
  label: string; // 'Inversión Total'
  headline: string; // 'El Momento es'
  headlineAccent: string; // 'Ahora' (gradient)
  tagline: string;
  checklist: string[];
  ctaLabel: string; // 'COMENZAR TRANSFORMACIÓN'
  ctaHref: string; // '/#registro'
}

export interface DiplomadoMeta {
  title: string;
  description: string;
  canonical: string; // '/diplomados/<slug>' — BaseLayout builds absolute URL
}

export interface DiplomadoDetail {
  slug: string;
  chip: string;
  title: string;
  headline: string; // hero line 1, e.g. 'DIPLOMADO EN'
  headlineAccent: string; // hero line 2, gradient, e.g. 'COACHING Y LIDERAZGO'
  heroDescription: string;
  heroImageUrl: string; // Google-hosted cinematic bg (reference URL)
  chips: string[]; // exactly 2 hero chips
  skillsTitle: string; // 'El Arsenal del Líder'
  skillsAccent: string; // 'Líder' | 'Comunicador'
  skillsSubtitle: string;
  skills: DiplomadoSkill[]; // exactly 4 (2 large + 2 small)
  pricing: DiplomadoPricing;
  meta: DiplomadoMeta;
}
```

> **Note:** `headlineAccent`, `heroImageUrl`, `skillsTitle/Accent/Subtitle`, and `pricing.{label,headline,headlineAccent,tagline,ctaHref}` are justified extensions to the spec's minimal field list — they are required to render the two-line gradient headline, the reference hero background, and the section headings/glow copy verbatim. `pricing.amount === '997'`, `pricing.currency === 'USD'`, and exactly 4 skills strictly match the spec.

### `src/content/diplomados.ts` (new data map — FULL copy, paste verbatim)

```ts
import type { DiplomadoDetail } from './diplomado';

const heroImageUrl =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDEIBmuRpwt7L9kSkBerPF5uNqSaG4K8wHCFZJVi-4EBT9KbEAPRSI2E31egbKxlpsCLz2jxMqh52JHehGLizzuKr-z9ABx1ombb63EqGs372Wffhpqzg5IYMJ7aObfxpCbk1JUoSjOuaMSlMaxckPntCDPSN4WpSzSkklEeu7ySJn2aEBb0BIduX7hDujpyq7q4vBb7S-Qc6rMvppEbUCFYeENBp9aPk4EsLG2TXbuQS85nDfBA0OA';

export const diplomados: Record<string, DiplomadoDetail> = {
  'coaching-y-liderazgo': {
    slug: 'coaching-y-liderazgo',
    chip: 'Liderazgo',
    title: 'Diplomado en Coaching y Liderazgo',
    headline: 'DIPLOMADO EN',
    headlineAccent: 'COACHING Y LIDERAZGO',
    heroDescription:
      'Desata tu potencial oculto. Este programa intensivo está diseñado para forjar líderes inquebrantables, capaces de transformar su entorno personal y profesional con autoridad, visión y resiliencia absoluta.',
    heroImageUrl,
    chips: ['Liderazgo', 'Certificado'],
    skillsTitle: 'El Arsenal del Líder',
    skillsAccent: 'Líder',
    skillsSubtitle: 'Domina las habilidades críticas que separan a los excepcionales del resto.',
    skills: [
      {
        icon: 'psychology',
        title: 'Autodominio y Resiliencia',
        description:
          'Conquista tu mente antes de intentar conquistar el mundo. Desarrolla una fortaleza mental inquebrantable frente a la adversidad extrema.',
        size: 'large',
      },
      {
        icon: 'forum',
        title: 'Comunicación de Impacto',
        description: 'Articula tu visión con poder persuasivo y claridad absoluta.',
        size: 'small',
      },
      {
        icon: 'track_changes',
        title: 'Ejecución Estratégica',
        description: 'Transforma objetivos abstractos en resultados tangibles y medibles.',
        size: 'small',
      },
      {
        icon: 'groups',
        title: 'Equipos de Alto Rendimiento',
        description:
          'Forja y dirige escuadrones de élite cohesionados, motivados y alineados hacia un propósito único y dominante.',
        size: 'large',
      },
    ],
    pricing: {
      amount: '997',
      currency: 'USD',
      label: 'Inversión Total',
      headline: 'El Momento es',
      headlineAccent: 'Ahora',
      tagline:
        'La inversión en tu capacidad de liderazgo es la única que garantiza un retorno infinito. Asegura tu lugar en la próxima generación de líderes.',
      checklist: ['Acceso de por vida al material', 'Certificación oficial validada'],
      ctaLabel: 'COMENZAR TRANSFORMACIÓN',
      ctaHref: '/#registro',
    },
    meta: {
      title: 'Diplomado en Coaching y Liderazgo - PUEDES SER MÁS',
      description:
        'Diplomado en Coaching y Liderazgo. Forja líderes inquebrantables con dirección, valor y estructura. Cupo limitado, sesiones en vivo. Conocé más y sumate hoy.',
      canonical: '/diplomados/coaching-y-liderazgo',
    },
  },

  'comunicacion-y-oratoria': {
    slug: 'comunicacion-y-oratoria',
    chip: 'Comunicación',
    title: 'Diplomado en Comunicación y Oratoria',
    headline: 'DIPLOMADO EN',
    headlineAccent: 'COMUNICACIÓN Y ORATORIA',
    heroDescription:
      'Transformá el miedo en convicción. Este programa intensivo está diseñado para que tu voz se escuche con poder, aplomo e impacto, convirtiéndote en un comunicador capaz de movilizar audiencias y dejar huella.',
    heroImageUrl,
    chips: ['Comunicación', 'Certificado'],
    skillsTitle: 'El Arsenal del Comunicador',
    skillsAccent: 'Comunicador',
    skillsSubtitle:
      'Domina las habilidades críticas que separan a los comunicadores memorables del resto.',
    skills: [
      {
        icon: 'gesture',
        title: 'Presencia y Lenguaje Corporal',
        description:
          'Dominá el lenguaje silencioso que habla antes que las palabras. Tu cuerpo proyecta confianza —o la delata— apenas te ponés frente a cámara o público.',
        size: 'large',
      },
      {
        icon: 'self_improvement',
        title: 'Dominio del Miedo Escénico',
        description:
          'Convertí los nervios en combustible. Gestioná el miedo a la exposición y hablá con calma y autoridad ante cualquier audiencia.',
        size: 'small',
      },
      {
        icon: 'record_voice_over',
        title: 'Voz y Dicción',
        description:
          'Controlá tono, ritmo y respiración para que cada palabra llegue con claridad y fuerza.',
        size: 'small',
      },
      {
        icon: 'campaign',
        title: 'Discursos Memorables',
        description:
          'Construí mensajes que se quedan grabados en la mente de tu audiencia y la inspiran a la acción. Estructura, storytelling y cierres que impactan.',
        size: 'large',
      },
    ],
    pricing: {
      amount: '997',
      currency: 'USD',
      label: 'Inversión Total',
      headline: 'El Momento es',
      headlineAccent: 'Ahora',
      tagline:
        'La inversión en tu capacidad de comunicar es la única que garantiza un retorno infinito. Asegurá tu lugar en la próxima generación de oradores.',
      checklist: ['Acceso de por vida al material', 'Certificación oficial validada'],
      ctaLabel: 'COMENZAR TRANSFORMACIÓN',
      ctaHref: '/#registro',
    },
    meta: {
      title: 'Diplomado en Comunicación y Oratoria - PUEDES SER MÁS',
      description:
        'Diplomado en Comunicación y Oratoria. Hacé que tu voz se escuche con poder, aplomo e impacto. Cupo limitado, sesiones en vivo. Conocé más y sumate hoy.',
      canonical: '/diplomados/comunicacion-y-oratoria',
    },
  },
};
```

## 4. Component design

Two shared utility classes are added to `src/styles/global.css` (CSS-first, token-driven — honoring `design-tokens` spec):

- `.text-gradient-cta` — `background: linear-gradient(90deg, #FFFFFF, #D32F2F); -webkit-background-clip: text; -webkit-text-fill-color: transparent;` (from reference `.text-gradient`).
- `.glass-card` — `background: var(--color-surface); border: 1px solid color-mix(in srgb, var(--color-accent) 30%, transparent); transition: border-color .3s, filter .3s;` with `&:hover { border-color: var(--color-accent); filter: drop-shadow(0 0 15px rgba(0,93,183,.5)); }` (Progress Blue glow per spec).

### `DetailHeroBlock.astro` (new, static — props: `diplomado: DiplomadoDetail`)

Sticky-nav aware (`pt-20`), `min-h-[80vh]`, `flex items-center`. Optional layered hero background `heroImageUrl` at `opacity-40` + left/bottom dark gradients (reference). Inner `grid grid-cols-1 md:grid-cols-12`; content in `md:col-span-8`. Renders: two `.chip` spans (`chips`, token `border-accent`/`text-accent-soft`), `<h1>` Bebas display with `headline` line + `<span class="text-gradient-cta">{headlineAccent}</span>`, `heroDescription` paragraph, and CTAs using `Button.astro` (`primary` → `#registro` "INSCRÍBETE AHORA"; `ghost` → non-navigating `VER INTRODUCCIÓN` button with `play_circle` icon, per spec no video embed).

### `DetailSkillsBlock.astro` (new, static — props: `diplomado`)

Section `bg-bg`. Centered `skillsTitle` (Bebas, uppercase) with `skillsAccent` in `text-cta`, plus `skillsSubtitle`. Bento grid `grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(250px,auto)]`. For each skill: card in `.glass-card`; `large` items get `md:col-span-8`, `small` items `md:col-span-4`. Large cards render an oversized watermark Material Symbol (`text-[200px] opacity-5 group-hover:opacity-10`) and a filled accent icon sized `text-4xl`; small cards render filled icon + compact header. Large icons `text-cta` (Energy Red), small icons `text-accent` (Progress Blue) — mirrors reference (`primary-container`/`secondary-container`). Titles Bebas uppercase; descriptions in `text-text-variant`.

### `DetailPricingBlock.astro` (new, static — props: `pricing: DiplomadoPricing`, `cta?: string = '/#registro'`)

Section `bg-surface-lowest border-t border-line/40` with a centered red glow orb (`bg-cta/5 blur-[120px]`). Heading `pricing.headline` + `pricing.headlineAccent` in `text-cta`; `pricing.tagline`; `.glass-card` panel: `label` ("Inversión Total" in `text-accent`), price block (¢ `$`, `pricing.amount` at `text-[80px]` Bebas, `pricing.currency`), `checklist` with `check_circle` icons in `text-cta`, and `Button.astro primary`「COMENZAR TRANSFORMACIÓN」→ `cta` (default `/#registro`).

### `[slug].astro` composition (new page)

```ts
import BaseLayout from '../../layouts/BaseLayout.astro';
import NavigationBlock from '../../components/blocks/NavigationBlock.astro';
import DetailHeroBlock from '../../components/blocks/DetailHeroBlock.astro';
import DetailSkillsBlock from '../../components/blocks/DetailSkillsBlock.astro';
import DetailPricingBlock from '../../components/blocks/DetailPricingBlock.astro';
import FooterBlock from '../../components/blocks/FooterBlock.astro';
import { diplomados } from '../../content/diplomados';

export const prerender = false;
const { slug } = Astro.params;
const diplomado = diplomados[slug];
if (!diplomado) return new Response('Not Found', { status: 404 });
```

Composes `<BaseLayout title/description/canonical=diplomado.meta>` → `NavigationBlock` → `<main>` (Hero/Skills/Pricing) → `FooterBlock`.

## 5. Landing wiring

- **`DiplomadoCard.astro`** (modify): add `href: string` to `Props`; render CTA `<a href={href} ...>` replacing the hard-coded `#registro`. Per spec the `href` MUST NOT be `#registro` for the card CTA.
- **`DiplomadosGrid.astro`** (modify): add `slug` to each of the two card objects and pass `href={"/diplomados/" + diplomado.slug}` on each `<DiplomadoCard>`; keep exactly the two cards and their order. Cards: `chip:'Liderazgo'`→`/diplomados/coaching-y-liderazgo`, `chip:'Comunicación'`→`/diplomados/comunicacion-y-oratoria`. Cards unchanged otherwise.

## 6. BaseLayout / meta

`BaseLayout.astro` already accepts `title`, `description`, `canonical` and builds the absolute canonical/OG URL. `[slug].astro` passes `<BaseLayout ...diplomado.meta ...>`, so each detail page emits its own `<title>`, `<meta name="description">`, and `<link rel="canonical">`. No BaseLayout change required.

## 7. File-by-file change list

| File                                             | Action | Summary                                                                                           |
| ------------------------------------------------ | ------ | ------------------------------------------------------------------------------------------------- |
| `src/content/diplomado.ts`                       | Create | `DiplomadoDetail`, `DiplomadoSkill`, `DiplomadoPricing`, `DiplomadoMeta` types                    |
| `src/content/diplomados.ts`                      | Create | `Record<slug, DiplomadoDetail>` map, both entries fully authored                                  |
| `src/pages/diplomados/[slug].astro`              | Create | SSR dynamic route: `Astro.params.slug` lookup, 404 Response fallback, compose BaseLayout + blocks |
| `src/components/blocks/DetailHeroBlock.astro`    | Create | Hero: chips, gradient headline, description, 2 CTAs                                               |
| `src/components/blocks/DetailSkillsBlock.astro`  | Create | Bento grid: 2×`md:col-span-8` + 2×`md:col-span-4` glass-cards                                     |
| `src/components/blocks/DetailPricingBlock.astro` | Create | Pricing: heading, $997 USD, checklist, CTA                                                        |
| `src/components/blocks/DiplomadoCard.astro`      | Modify | Add `href` prop; CTA `href={href}` (no longer `#registro`)                                        |
| `src/components/blocks/DiplomadosGrid.astro`     | Modify | Pass per-card `slug` → `href`; keep 2 cards                                                       |
| `src/styles/global.css`                          | Modify | Add `.text-gradient-cta` + `.glass-card` utilities (token-driven)                                 |

## 8. ADRs

1. **Dynamic route SSR approach.** _Accepted._ In `output:'server'`, `[slug].astro` is on-demand without `getStaticPaths`; set `export const prerender = false` and resolve via `Astro.params.slug`, returning a `404` `Response` for unknown slugs. Rejected: `getStaticPaths`+prerender (unnecessary for a static map and contrary to on-demand SSR), and two static pages (no per-page logic). Guarantees real 404 status.

2. **Content map over duplication.** _Accepted._ Both diplomados share one template and one content map; adding a diplomado = one map entry. Rejected: duplicating `[slug].astro` per diplomado. Keeps copy, SEO, and copy in one type-safe place.

3. **Identical pricing.** _Accepted._ Both entries ship identical `$997 USD` + checklist + CTA for parity with the reference. Fields are configurable so future divergence is a data edit, not a code change — but today's spec requires identical values.

## 9. Verification plan

Per `AGENTS.md`, `pnpm build` is FORBIDDEN as a check. Steps:

1. `pnpm lint` — ESLint + Prettier clean (also enforced by Husky `lint-staged` on staged files; fix any flagged formatting before committing).
2. `pnpm dev`, then curl both slugs and an unknown slug:
   - `curl -i localhost:4321/diplomados/coaching-y-liderazgo` → 200, contains `El Arsenal del Líder`, `$997`/`USD`, chips `Liderazgo`/`Certificado`, correct `<title>` + `<link rel="canonical">`.
   - `curl -i localhost:4321/diplomados/comunicacion-y-oratoria` → 200, contains `El Arsenal del Comunicador`, same `$997 USD`, chips `Comunicación`/`Certificado`, correct meta.
   - `curl -i localhost:4321/diplomados/no-existe` → 404 status.
3. Landing check: `curl localhost:4321/` shows the two card CTAs pointing to `/diplomados/coaching-y-liderazgo` and `/diplomados/comunicacion-y-oratoria` (and NOT `#registro`).
