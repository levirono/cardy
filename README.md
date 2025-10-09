# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Supabase Setup

1. Create a Supabase project.
2. In the SQL Editor, run the contents of `supabase.sql` from the project root to create tables and policies.
3. Create `.env` in project root and add:

```
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key
# Optional: only on server (do not expose to client)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

4. Install deps and start the dev server:

```bash
npm install
npm run dev
```

### API Endpoints

- GET `/api/health`
- GET `/api/cards`
- POST `/api/cards`
- GET `/api/cards/:id`
- PUT `/api/cards/:id`
- DELETE `/api/cards/:id`

Writes require `SUPABASE_SERVICE_ROLE_KEY` set. Reads depend on RLS policies in `supabase.sql`.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
