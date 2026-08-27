# AGENTS.md

This file provides guidance to AI agents and contributors working on this
project.

## Project Overview

**Events Cash Register** is a SvelteKit application for managing event cash
register operations. It supports product management (with options), user
management with role-based access, printer management, and session tracking.

This project uses a pnpm monorepo with packages in `packages/`:

- `packages/website/` - The SvelteKit application
- `packages/cups/` - NAPI bindings to libcups 2

Scripts are orchestrated with Turbo. Run scripts across all workspaces with
`turbo run <script>` or use the root-level scripts defined in `package.json`:

## Key Technologies

- **Framework:** SvelteKit 2 with Svelte 5 (using the new runes and compiler
  features)
- **Styling:** Tailwind CSS 4 with bits-ui components
- **Database:** libSQL (SQLite) via Drizzle ORM
- **Validation:** valibot
- **Icons:** phosphor-svelte
- **Package Manager:** pnpm
- **Formatter:** Biome + Prettier (Biome for JS/TS, Prettier for CSS/HTML)
- **Linter:** Biome

## Code Style Guidelines

### TypeScript & Svelte

- Use `lang="ts"` on all `.svelte` files
- Enable strict mode (`"strict": true` in tsconfig)
- Use `verbatimModuleSyntax` and `verbatimModuleSyntax: true`
- Import extensions: always include `.ts` extension for local imports (e.g.,
  `#lib/auth/index.ts`)
- Use the import aliases defined in `package.json`: `#assets/*`,
  `#components/*`, `#lib/*`, `#routes/*`

### Naming Conventions

- **Components:** PascalCase (e.g., `Button.svelte`, `TextInput.svelte`)
- **Files:** `.svelte` for components, `.ts` for modules
- **Private components:** Prefix with `_` (e.g., `_forms.remote.ts`,
  `_schemas.ts`)
- **Variables/functions:** camelCase
- **Constants:** UPPER_SNAKE_CASE (environment variables, config)
- **Types/Interfaces:** PascalCase

### Imports

```typescript
// Use path aliases
import { Button } from "#components/controls/index.ts";
import { Form } from "#components/form/index.ts";
import { requireAdmin } from "#lib/auth/index.remote.ts";
import { randomUUID } from "node:crypto";
```

### Database (Drizzle ORM)

- Tables are defined in `packages/website/src/lib/server/database/tables/`
- Use `sqliteTable` from `drizzle-orm/sqlite-core`
- Use custom type wrappers for IDs (e.g., `$type<UserId>()`)
- Migrations go in `migrations/` directory (there are sql files that define the
  migration and snapshots files of drizzle that you should ignore)>

### Forms & Validation

- Use valibot schemas for validation (e.g., `_schemas.ts`)
- Forms use custom `<Form>` component with valibot integration
- Remote forms go in `_forms.remote.ts` files
- Schema files go in `_schema.ts` or `_schemas.ts` files

### Component Structure

- Each feature area has its own directory under
  `packages/website/src/components/`
- Index files re-export components for cleaner imports
- Private components (internal to a route) go in `_components/` directories

## Environment Variables

See `.env.example` and `packages/website/src/env.ts` for all available
variables.

## CI

All pull requests must pass required checks found in the `.forgejo/workflows`
folder. The checks run the following Turbo tasks: `format:check`, `lint:check`,
`check`, `build`, `test`.
