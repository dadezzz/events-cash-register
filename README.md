# Events Cash Register

A web-based cash register application for event management, built with
[SvelteKit](https://svelte.dev).

## Features

- Product management (with options)
- User management with role-based access
- Printer management
- Secure authentication with session management
- Session tracking and reporting
- Automated cleanup via cron jobs

## Tech Stack

- **Frontend:** Svelte 5, Tailwind CSS 4, bits-ui, phosphor-svelte
- **Backend:** SvelteKit server functions, Node.js adapter
- **Database:** libSQL (SQLite) with Drizzle ORM
- **Validation:** valibot
- **Authentication:** Custom session-based auth with Argon2 password hashing

## Getting Started

Prerequisites:

- clang++ or g++ (c++23 compiler)
- cups-dev (cups/cups.h for development) or cups-libs (libcups.so.2 for
  production)
- meson (c++ build system)
- ninja (c++ build system)
- node.js (js server runtime)
- pnpm (js package manager)

```bash
pnpm install

# Build the project.
pnpm run -r --no-sort setup
pnpm run -r build
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
│   ├── entities/    # Domain entities (user, product, printer, session)
│   └── server/      # Server-side utilities (database, logging, cron, etc.)
└── routes/          # SvelteKit routes
    ├── admin/       # Admin panel (products, users, printers)
    └── auth/        # Authentication (sign-in)
```

## License

MIT
