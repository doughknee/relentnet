# AGENTS.md — RelentNet

## Project Overview

RelentNet is a monorepo for RelentNet-owned apps, shared packages, templates, and deployment configuration.
The current production app is `apps/marketing`, a client-facing marketing and inquiry site.
The marketing app is an SPA built with React 19, Vite 7, TanStack Router (file-based routing), TanStack Form,
Tailwind CSS 4, and TypeScript in strict mode. No SSR — this is a client-only Vite app.

## Tech Stack

| Layer      | Tool                                          |
| ---------- | --------------------------------------------- |
| Framework  | React 19                                      |
| Build      | Vite 7 (`@vitejs/plugin-react`)               |
| Language   | TypeScript (strict, `verbatimModuleSyntax`)   |
| Routing    | TanStack Router — file-based, auto code-split |
| Forms      | TanStack Form                                 |
| Styling    | Tailwind CSS 4 (`@tailwindcss/vite`)          |
| Icons      | Lucide React                                  |
| Particles  | tsparticles (slim)                            |
| Testing    | Vitest + Testing Library (React, jsdom)       |
| Linting    | ESLint (`@tanstack/eslint-config`)            |
| Formatting | Prettier                                      |

## Commands

```sh
npm run dev         # Start dev server on port 3000
npm run build       # Production build for apps/marketing
npm run preview     # Preview production build
npm run test        # Run all tests (vitest run --passWithNoTests)
npm run lint        # Run ESLint
npm run typecheck   # Run TypeScript check
npm run format      # Run Prettier
npm run check       # Auto-fix: prettier --write . && eslint --fix
```

Root commands proxy to the `@relentnet/marketing` workspace. Use `npm run <script> -w @relentnet/marketing` when you need to run a workspace script directly.

### Running a single test

```sh
npx vitest run path/to/file.test.ts        # Single test file
npx vitest run -t "test name"              # Single test by name
npx vitest --watch path/to/file.test.ts    # Watch mode for one file
```

Note: No `vitest.config.ts` exists — Vitest uses the Vite config directly.

## Project Structure

```
apps/
├── marketing/           # Current public RelentNet site
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── data/        # Static data (legalDocs.ts)
│   │   ├── routes/      # TanStack file-based routes
│   │   ├── site.config.ts
│   │   ├── styles.css
│   │   ├── main.tsx
│   │   ├── routeTree.gen.ts # Auto-generated — DO NOT edit
│   │   └── reportWebVitals.ts
│   ├── public/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── portal/              # Reserved for future client portal
packages/                # Reserved for future shared packages
templates/               # Reserved for future project starters
compose.yaml             # Docker Compose / Coolify entrypoint
```

## Routing

- **File-based routing** via `@tanstack/router-plugin/vite` with `autoCodeSplitting: true`.
- `apps/marketing/src/routeTree.gen.ts` is auto-generated — never edit it manually.
- Each route file exports `Route` created with `createFileRoute('/path')`.
- Route components are defined as named functions (not arrow-function default exports).
- Use `<Link to="/path">` from `@tanstack/react-router` for navigation.
- Dynamic routes use `$param` convention (e.g., `legal/$docId.tsx`).
- Route-level `head()` provides per-page meta tags.

## Formatting & Style

Prettier config (enforced):

- **No semicolons** (`semi: false`)
- **Single quotes** (`singleQuote: true`)
- **Trailing commas** (`trailingComma: 'all'`)

Run `npm run check` before committing to auto-fix formatting and lint issues.

## Code Conventions

### Imports

```ts
// 1. Node built-ins
import { URL, fileURLToPath } from 'node:url'
// 2. Framework / library imports
import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
// 3. Internal (path alias)
import { Button } from '@/components/ui/Button'
import { siteConfig } from '@/site.config'
// 4. Relative imports (only when within the same feature/directory)
import { legalDocs } from '../../data/legalDocs'
// 5. Type-only imports
import type { ISourceOptions } from '@tsparticles/engine'
```

- Use `@/` alias for `src/` — configured in both `tsconfig.json` and `vite.config.ts`.
- Use `import type` for type-only imports (`verbatimModuleSyntax` is enabled).
- Side-effect imports (CSS) go last in the entry file.

### Components

- **Named function exports** for components: `export function Button() {}`.
- Route page components use plain named functions (not exported): `function HomeComponent() {}`.
- One exception: `StarParticles` uses `export default` (arrow function) — prefer named exports for new code.
- UI primitives live in `apps/marketing/src/components/ui/` and extend native HTML element props via interfaces.
- Props interfaces use `interface` (not `type`), extending native HTML attributes where applicable.

### TypeScript

- Strict mode with `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`.
- Target: ES2022, JSX: react-jsx, module resolution: bundler.
- Avoid `any` — use `unknown` and narrow. Inline `as` casts are acceptable for TanStack Form values.
- Use `interface` for object shapes, `type` for unions/intersections.
- `eslint-disable` comments are acceptable with justification (e.g., `@typescript-eslint/no-unnecessary-condition` for runtime safety checks on dynamic params).

### Naming

| Entity              | Convention     | Example                |
| ------------------- | -------------- | ---------------------- |
| Components          | PascalCase     | `Header.tsx`           |
| Route components    | PascalCase fn  | `function Portfolio()` |
| Hooks               | camelCase      | `useForm`              |
| Config / data files | camelCase      | `site.config.ts`       |
| Constants           | camelCase      | `siteConfig`           |
| Interfaces          | PascalCase     | `ButtonProps`          |
| CSS classes         | Tailwind utils | `text-gold`            |
| Boolean state       | `is`/`has`     | `isOpen`, `isSuccess`  |

### Styling

- Tailwind CSS 4 with `@import 'tailwindcss'` in `apps/marketing/src/styles.css`.
- Custom theme tokens defined in `@theme {}` block: `--color-gold`, `--color-gold-dim`.
- Dark theme by default (background `#050505`, text `#e5e5e5`).
- Utility classes inline on elements — no separate CSS modules or styled-components.
- Custom animation classes (`.animate-fade-in-up`) defined in `styles.css`.
- Use `selection:bg-gold selection:text-black` for consistent text selection styling.

### Error Handling

- Forms use try/catch with user-facing error state (`setError('Something went wrong...')`).
- Dynamic route loaders use `throw notFound()` for missing data.
- Components display error messages inline (e.g., `<em className="text-xs text-red-500">`).
- Never swallow errors silently — always surface to the user.

### Site Configuration

All site metadata, contact info, and regional data is centralized in `apps/marketing/src/site.config.ts`.
Always reference `siteConfig` instead of hardcoding values for domain, email, phone, or regions.

## Do NOT

- Edit `apps/marketing/src/routeTree.gen.ts` — it is auto-generated by the router plugin.
- Add SSR or migrate to TanStack Start unless explicitly requested.
- Use default exports for new components (exception: existing `StarParticles`).
- Hardcode site metadata — use `siteConfig` from `src/site.config.ts`.
- Commit without running `npm run check`.
