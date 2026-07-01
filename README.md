# Events Cash Register

A web-based cash register application for event management, built with
[SvelteKit](https://svelte.dev).

## Features

- Product management
- User management with role-based access
- Secure authentication with session management
- Session tracking and reporting

## Tech Stack

- **Frontend:** Svelte 5, Tailwind CSS 4, bits-ui, phosphor-svelte
- **Backend:** SvelteKit server functions, Node.js adapter
- **Database:** libSQL (SQLite) with Drizzle ORM
- **Validation:** valibot
- **Authentication:** Custom session-based auth with Argon2 password hashing

## Getting Started

Prerequisites:

- Node.js 20+
- pnpm

```bash
pnpm install

# Copy the example environment file and configure it.
cp .env.example .env

# Build the project.
pnpm run -r --aggregate-output build
```

## Project Structure

```
migrations/          # Database migration files
cups/                # NAPI bindings to libcups 2
src/
├── assets/          # Static assets (images, icons)
├── components/      # Reusable Svelte components
├── lib/             # Shared library code
│   ├── auth/        # Authentication logic
│   ├── entities/    # Domain entities (user, product, session)
│   └── server/      # Server-side utilities (database, logging, etc.)
└── routes/          # SvelteKit routes
    ├── admin/       # Admin panel (products, users)
    └── auth/        # Authentication pages
```

## License

MIT
