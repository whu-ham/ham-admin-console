# Ham Admin Web

Internal admin panel for managing app versions and open applications.

## Tech Stack

- [Nuxt 3](https://nuxt.com/) — Vue 3 full-stack framework
- [Nuxt UI](https://ui.nuxt.com/) — UI component library
- [TypeScript](https://www.typescriptlang.org/) — Type-safe development
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework (via Nuxt UI)
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) — Code linting & formatting
- [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/okonet/lint-staged) + [commitlint](https://commitlint.js.org/) — Git hooks & commit message validation

## Prerequisites

- [Bun](https://bun.sh/) `1.2.x` (recommended, other versions may cause module resolution issues)

## Getting Started

### 1. Install dependencies

```bash
bun install
```

### 2. Start development server

```bash
bun run dev
```

The app will be available at `http://localhost:3000`.

### 3. Configure API settings

On first launch, navigate to **Settings** page in the sidebar and fill in:

- **API Endpoint** — Backend API base URL (e.g. `http://localhost:8086`)
- **Auth Token** — Bearer token for API authentication

Settings are stored in `localStorage` and persisted across sessions. No `.env` file needed.

### 4. Build for production

```bash
# Static site generation (SPA mode)
NUXT_SSR=false bun run generate

# Or standard build
bun run build
bun run preview
```

## Project Structure

```
ham-admin-web/
├── nuxt.config.ts             # Nuxt configuration
├── src/
│   ├── app.vue                # Root app component
│   ├── composables/
│   │   ├── useApi.ts          # Generic API request helper (X-Base-Api & X-Auth-Token headers)
│   │   ├── useSettings.ts     # localStorage-based settings (API endpoint & auth token)
│   │   ├── useVersions.ts     # Version CRUD composable
│   │   └── useOpenApps.ts     # OpenApp CRUD composable
│   ├── layouts/
│   │   ├── default.vue        # Main layout with sidebar navigation
│   │   └── blank.vue          # Blank layout
│   ├── pages/
│   │   ├── index.vue          # Dashboard
│   │   ├── versions.vue       # App version management
│   │   ├── open-apps.vue      # Open application management
│   │   └── settings.vue       # API endpoint & auth token configuration
│   ├── server/
│   │   └── api/
│   │       └── [...].ts       # Server proxy — forwards requests with auth headers
│   ├── public/
│   │   ├── favicon.svg
│   │   └── favicon.ico
│   └── types/
│       └── index.ts           # TypeScript type definitions
├── .github/workflows/
│   ├── ci.yml                 # CI: lint & build checks
│   └── deploy.yml             # Deploy to GitHub Pages on push to main
├── commitlint.config.ts       # Commit message linting rules
├── eslint.config.mjs          # ESLint flat config
├── tailwind.config.ts         # Tailwind CSS configuration
└── package.json
```

## API Architecture

All client-side API calls include `X-Base-Api` and `X-Auth-Token` headers (read from localStorage via `useSettings()`). Requests are proxied through the Nuxt server route (`/api/*`):

1. Client sends request with `X-Base-Api` (backend URL) and `X-Auth-Token` headers
2. Server proxy validates the endpoint URL and forwards the request
3. Server returns the backend response to the client

This ensures the auth token is only stored in `localStorage` and transmitted via headers, never hardcoded or exposed in source code.

## Deployment

The project is automatically deployed to GitHub Pages via CI on every push to `main`.

Key CI configuration:

- Bun `1.2.18` (pinned for consistent module resolution)
- `NUXT_SSR=false` for SPA static generation
- Output directory: `.output/public`

## Code Quality

### Linting & Formatting

```bash
# Run ESLint
bun run lint

# Auto-fix ESLint issues
bun run lint:fix

# Format with Prettier
bun run format
```

### Git Hooks

- **pre-commit**: Runs `lint-staged` to auto-fix and format staged files
- **commit-msg**: Runs `commitlint` to validate commit message format (Conventional Commits)

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: resolve a bug
docs: update documentation
style: formatting, no code change
refactor: code restructuring
chore: build/tooling changes
```
