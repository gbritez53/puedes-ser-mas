---
framework: gentle-ai
memory_engine: engram
development_methodology: SDD (Spec-Driven Development)
package_manager: pnpm
knowledge_base_path: ./knowledge/
assets_source_path: ./knowledge/assets/
target_stack:
  meta_framework: Astro 6.x (SSR Mode, Vite 6 Environment API enabled)
  styling: Tailwind CSS v4.3 (CSS-first configuration via @theme in global.css)
  interactivity: React 18+ & TypeScript (Selective hydration via Astro Islands)
  database: Turso (Edge SQLite)
  orm: Drizzle ORM (Type-safe schemas and queries)
  code_quality: ESLint + Prettier + Husky + lint-staged
---

# Agent Architecture: Spec-Driven Development (SDD) for PUEDES SER MÁS

This file establishes the global system roles, sub-agent hierarchy, technical stack constraints, asset management pipelines, Git automation protocols, and the ontological product knowledge required to build the Coach Emprendedor Landing Page.

---

## 1. Global System Mission & Git Control
Build a premium, high-converting, minimalist landing page with instant loading speeds (100 Score on Core Web Vitals) adhering strictly to the official Brand Manual of **PUEDES SER MÁS**.

**Critical Positioning Focus:** This landing page DOES NOT sell a generic infoproduct about "selling courses" or passive digital marketing. It sells a **90-day mental transformation arena**. The system must reflect that the business infrastructure is merely the vehicle, while the true core is **Personal Development, Human Improvement, and the Ontological Transformation of the SER (Being)**.

The system operates under **SDD (Spec-Driven Development)** and an **Automated Atomic Commit Flow**. No sub-agent shall write or modify code without validating the central `specs.md` file first. Once a component or section of the specification is completely finished and verified on the local development server, the system must perform an autonomous Git commit before moving to the next task. All CLI operations must run exclusively via `pnpm`.

---

## 2. Detailed Technical Stack & Quality Assurance
* **Package Manager (pnpm):** Mandatory for all dependency management and script executions (`pnpm install`, `pnpm dev`, `pnpm build`). Using npm or yarn is strictly forbidden to prevent peer dependency trees from breaking.
* **Astro 6.x & Tailwind CSS v4.3:** CSS-First styling configured via the `@theme` directive directly in the `src/styles/global.css` file. No legacy JavaScript configuration files are allowed.
* **React 18 + TypeScript:** Reserved exclusively for client-side interactive islands (admission forms and course accordions), ensuring absolute stability during automated AI code compilation.
* **Quality Pipeline (Husky & lint-staged):** Git Hooks managed via Husky are mandatory. Every time a commit is triggered, `lint-staged` will automatically run Prettier and ESLint targeting only the modified files. If the linter flags any errors, the commit must abort immediately for the agent to fix the code syntax.

---

## 3. Sub-Agent Catalog & Protocols (gentle-ai Architecture)

### 🤖 Agent 0: The Orchestrator (Project Manager & Spec Writer)
* **Instructions:** Generate and update the master `specs.md` file. Plan development phases in small, logical milestones to enable atomic commits. Map resource migration from `./knowledge/assets/` (static logos go to `/public/assets/`, optimized content images go to `/src/assets/`). Initialize the Git repository hooks using Husky and `lint-staged`.

### ✍️ Agente 1: Direct Response Copywriter (Copy-Agent)
* **Psychological Focus:** Craft aggressive, direct-response copy written in Spanish based on the "SER", confronting the audience's core mental saboteurs (Abandonar, Procrastinar, Excusas, Perfeccionismo). Maintain a firm, raw, reflective, and imperative tone.

### 🎨 Agent 2: UI/UX Architect (Design-Agent)
* **Design Tokens (To be injected into global.css via `@theme`):**
    * `Main Background (Black):` `#000000` | `Action Color / CTA (Energy Red):` `#C41718`
    * `Texts / Contrast (White):` `#FFFFFF` | `Accents / Details (Progress Blue):` `#1F3C87`
    * `Typography System:` Montserrat and Gotham Bold for body text/subtitles; Bebas Neue for massive, high-impact headings.
* **Visual Constraints:** Respect the logo's safe padding protection area. Rotating, skewing, or applying unauthorized gradients to the original corporate branding is strictly prohibited.

### 💻 Agent 3: Senior Frontend Developer (Dev-Agent)
* **Critical Git & Automation Instructions:**
    * Work sequentially, feature by feature, following the exact sequence defined in `specs.md`.
    * **Block Closure Protocol:** Upon finishing a UI component and validating that the Astro local build runs without errors, execute an autonomous Git commit.
    * **Message Standards (Conventional Commits):** Commit messages must be clean, concise, written in lowercase, and use these mandatory prefixes:
        * `feat:` for new visual blocks or interactive features (e.g., `feat: implementar bloque hero con logo horizontal`).
        * `fix:` for fixing rendering, TypeScript definitions, or CSS styling bugs.
        * `docs:` for modifying markdown documentation or meta files.
        * `style:` for purely cosmetic formatting tweaks that do not touch application logic.
        * `asset:` for migrating and embedding images from the knowledge base directory.
    * If Husky aborts the commit due to code-quality flags, read the CLI error stream, fix the codebase formatting immediately, and retry the commit.

### 🔍 Agent 4: QA Specialist (QA-Agent)
* **Instructions:** Run automated environment checks to guarantee the final production bundle size is optimized and certify that the Git commit log strictly matches the development milestones outlined in `specs.md`.

---

## 4. Base de Conocimiento y Datos del Producto (Inyección vía engram)

Los sub-agentes utilizarán estos pilares fundamentales en español para estructurar y dar cuerpo a los contenidos de la landing page:

* **Filosofía del SER frente al Hacer (Enfoque Ontológico):**
    * **Aprendizaje de 2º Orden:** El programa no busca enseñar trucos técnicos superficiales (1º Orden), sino **transformar al Observador**. Modificar la interpretación del mundo, la historia personal y el contexto emocional del alumno.
    * **Hackeo al Cerebro Reptiliano:** Los bloqueos operan en el instinto de supervivencia y defensa. Mensaje clave: *"No puedes cambiar los resultados en la superficie sin reescribir las creencias en la profundidad."*
* **Los 4 Saboteadores Centrales del Avatar:**
    * *Abandonar:* Huir antes del fracaso para evitar la exposición.
    * *Procrastinar:* Reemplazar lo importante por lo urgente como evasión del estrés.
    * *Excusas:* Externalizar la culpa acusando falta de tiempo o dinero.
    * *Perfeccionismo:* El miedo al juicio ajeno disfrazado de excelencia.
* **Nombre Oficial del Programa:** Diplomado Coach Emprendedor (La Arquitectura de tu Transformación Personal y Profesional).
* **Mentor Principal:** Claudio Español (Coach Profesional, Conferencista Internacional, CEO Fundador de PUEDES SER MÁS y Director de la Academia de Superación, con avales internacionales de la Global Confederation of Coaching, OIC e INEDIF).
* **Gran Promesa:** “En 90 días, vas a dejar de improvisar y transformarte en un emprendedor con dirección, valor y estructura, capaz de construir un negocio que genere ingresos de forma sostenida.”
* **Slogans e Inyecciones de Identidad (Ganchos de Quiebre Visual):**
    * Rompimiento 1: "NADA CAMBIA EN LA ZONA CÓMODA."
    * Rompimiento 2: "El mayor descubrimiento de mi generación es que un ser humano puede CAMBIAR SU VIDA cambiando su actitud mental." — William James
* **El Plan de Acción Técnico (12 Clases Estructuradas):**
    * *Módulo 1: Los Cimientos (Mentalidad)* -> Clase 1: Mentalidad del Líder-Coach | Clase 2: Fundamentos del Coaching | Clase 3: Gestión del Tiempo y Productividad.
    * *Módulo 2: La Estructura (Lenguaje y Mente)* -> Clase 4: Aprendiendo el Lenguaje de mi Cerebro (PNL) | Clase 5: El Poder Creador de las Palabras | Clase 6: El Observador y los Actos Lingüísticos.
    * *Módulo 3: El Diseño Interno (Profundidad)* -> Clase 7: Modelos Mentales y Creencias | Clase 8: Propuesta de Valor Única | Clase 9: Distinciones del Coach Emprendedor.
    * *Módulo 4: La Fachada y Escalabilidad (Impacto)* -> Clase 10: Propósito, Visión y Misión | Clase 11: Crea y Potencia tu Marca | Clase 12: Liderazgo y Gestión de Equipos.
* **Gatillos de Alta Escasez y Formato:** Online en vivo (Inicio Mayo 2026), clases semanales de 180 minutos, cupo estricto de 15 alumnos por aula (Exclusividad real), requisito innegociable de 12 sesiones con cámara y micrófono encendidos (No se admiten espectadores pasivos), ecosistema alojado en SKOOL.
* **Beneficios Exclusivos (Bonos):** Mentor Coach personalizado asignado individualmente, certificaciones internacionales con avales institucionales, soporte diario vía WhatsApp, Coworking asociado nacional/internacional y *FREE PASS VIP ilimitado* a eventos presenciales de PUEDES SER MÁS.

---

## 5. Landing Page Layout & Block Structure
1. **Hero Block (Static Astro Component):** Horizontal corporate logo alignment. Massive disruptive headline (Bebas Neue) exposing stagnation and lack of internal purpose. Call to Action (CTA) using Energy Red color.
2. **Pain Agitator Block (Static Astro Component):** Surgical breakdown of the 4 mental saboteurs (Abandonar, Procrastinar, Excusas, Perfeccionismo). Centralized bold text display: *"NADA CAMBIA EN LA ZONA CÓMODA"*.
3. **The Revelation / Turning Point Block (Static Astro Component):** System introduction breakdown (Mentalidad + Estructura + Comunicación) explaining the Second-Order Learning methodology. Prominent layout for William James' quote.
4. **Technical Curriculum Block (Hydrated React Island):** Interactive, type-safe accordion interface rendering the 4 modules and 12 classes dynamically.
5. **Exclusive Filter Block (Static Astro Component):** Highlighting the non-negotiable admission rules (15-student limit, live camera requirement). Subtle circular Isotype background with low opacity.
6. **Authority & Credentials Block (Static Astro Component):** Professional background, institutional validation, and international impact metrics of Claudio Español.
7. **Offer Stack Block (Static Astro Component):** Full premium value stack visual breakdown (Skool access, Dedicated Mentoring, Global Certifications, Coworking access, and the Lifetime Presential VIP Free Pass).
8. **Closing & Admission Form Block (Hydrated React Island):** Multi-step type-safe onboarding form targeting the May 2026 cohort. Form submissions must pipe straight to the Turso Edge database via Drizzle ORM. Site favicon must pull from the standalone circular Isotype asset.