# Tasks: Diplomado Detail Pages

## Phase A: Content Model + Design Tokens

- [x] 1.1 Create `src/content/diplomado.ts` — interfaces `DiplomadoSkill` (`icon`,`title`,`description`,`size:'large'|'small'`), `DiplomadoPricing` (`amount`,`currency`,`label`,`headline`,`headlineAccent`,`tagline`,`checklist[]`,`ctaLabel`,`ctaHref`), `DiplomadoMeta` (`title`,`description`,`canonical`), `DiplomadoDetail` (`slug`,`chip`,`title`,`headline`,`headlineAccent`,`heroDescription`,`heroImageUrl`,`chips[]`,`skillsTitle`,`skillsAccent`,`skillsSubtitle`,`skills[]`,`pricing`,`meta`).
- [x] 1.2 Create `src/content/diplomados.ts` — `export const diplomados: Record<string, DiplomadoDetail>` with BOTH full entries (`coaching-y-liderazgo`, `comunicacion-y-oratoria`), pasting the exact copy from design.md §3 (incl. shared `heroImageUrl`).
- [x] 1.3 Modify `src/styles/global.css` — add `.text-gradient-cta` (white→#D32F2F `background-clip:text`/transparent fill) and `.glass-card` (`var(--color-surface)` bg, `color-mix(in srgb, var(--color-accent) 30%, transparent)` border, `:hover` Progress-Blue glow via `--color-accent`), token-driven.

## Phase B: Detail Blocks (shared chrome)

- [x] 2.1 Create `src/components/blocks/DetailHeroBlock.astro` — `Props: { diplomado: DiplomadoDetail }`; `pt-20 min-h-[80vh] flex items-center`, optional layered `heroImageUrl` bg at `opacity-40` + dark gradients; `md:col-span-8` content: 2 `.chip` spans, Bebas `<h1>` (`headline` + `<span class="text-gradient-cta">headlineAccent</span>`), `heroDescription`, `Button.astro` primary→`/#registro` "INSCRÍBETE AHORA" + ghost `play_circle` "VER INTRODUCCIÓN" button.
- [x] 2.2 Create `src/components/blocks/DetailSkillsBlock.astro` — `Props: { diplomado }`; `bg-bg` bento section, centered Bebas `skillsTitle` (accent in `text-cta`) + `skillsSubtitle`, `grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(250px,auto)]`, `.glass-card` items with `large`→`md:col-span-8` / `small`→`md:col-span-4`, oversized watermark icon (`text-[200px] opacity-5 group-hover:opacity-10`) + filled icon (`text-4xl`, `text-cta` large / `text-accent` small), Bebas titles, `text-text-variant` descriptions.
- [x] 2.3 Create `src/components/blocks/DetailPricingBlock.astro` — `Props: { pricing: DiplomadoPricing; cta?: string = '/#registro' }`; `bg-surface-lowest border-t border-line/40` + red glow orb (`bg-cta/5 blur-[120px]`), heading `headline` + `headlineAccent` in `text-cta`, `tagline`, `.glass-card` panel: `label` (`text-accent`), `$` + `amount` (`text-[80px]` Bebas) + `currency`, `checklist` with `check_circle` (`text-cta`), `Button.astro` primary `ctaLabel`→`cta` ("COMENZAR TRANSFORMACIÓN" → `/#registro`).

## Phase C: Route + Landing Wiring

- [x] 3.1 Create `src/pages/diplomados/[slug].astro` — `export const prerender = false`; resolve `Astro.params.slug` → `diplomados[slug]`, `return new Response('Not Found', { status: 404 })` when missing; compose `BaseLayout` (`...diplomado.meta`) + `NavigationBlock` + `<main>` (DetailHeroBlock/DetailSkillsBlock/DetailPricingBlock) + `FooterBlock`. No `getStaticPaths`.
- [x] 3.2 Modify `src/components/blocks/DiplomadoCard.astro` — add `href: string` to `Props`/destructure; render card CTA `<a href={href} ...>` replacing hard-coded `#registro`.
- [x] 3.3 Modify `src/components/blocks/DiplomadosGrid.astro` — add `slug` to each card object and pass `href={"/diplomados/" + diplomado.slug}` to each `<DiplomadoCard>`; keep exactly 2 cards in order (Liderazgo→`coaching-y-liderazgo`, Comunicación→`comunicacion-y-oratoria`).

## Phase D: Verification (no `pnpm build`)

- [x] 4.1 Run `pnpm lint` — ESLint + Prettier clean; fix any Husky `lint-staged` flags before committing.
- [x] 4.2 Run `pnpm dev`; `curl -i` both slugs — `localhost:4321/diplomados/coaching-y-liderazgo` → 200 containing `El Arsenal del Líder`, `$997`/`USD`, chips `Liderazgo`/`Certificado`, correct `<title>` + `<link rel="canonical">`; `localhost:4321/diplomados/comunicacion-y-oratoria` → 200 containing `El Arsenal del Comunicador`, `$997 USD`, chips `Comunicación`/`Certificado`, correct meta.
- [x] 4.3 `curl -i localhost:4321/diplomados/no-existe` → 404 status; `curl localhost:4321/` shows both card CTAs pointing to `/diplomados/coaching-y-liderazgo` and `/diplomados/comunicacion-y-oratoria` (NOT `#registro`).
