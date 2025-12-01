# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nano Banana Pro is an AI image generator application built on the Agentic Coding Starter Kit. It uses Google's Gemini 3 Pro Image Preview model to generate and refine images based on user prompts with optional reference images (avatars).

## Development Commands

```bash
pnpm dev              # Start dev server with Turbopack
pnpm build            # Build for production (runs migrations first)
pnpm lint             # Run ESLint
pnpm typecheck        # Run TypeScript type checking
pnpm check            # Run both lint and typecheck
pnpm format           # Format code with Prettier
```

**Database commands:**
```bash
pnpm db:push          # Push schema changes (development)
pnpm db:generate      # Generate migrations
pnpm db:migrate       # Run migrations
pnpm db:studio        # Open Drizzle Studio GUI
pnpm db:reset         # Drop and recreate all tables
```

**Important:** Always run `pnpm lint && pnpm typecheck` after completing changes to catch issues.

## Architecture

### Tech Stack
- **Framework:** Next.js 16 (App Router) with React 19
- **Database:** PostgreSQL with Drizzle ORM
- **Auth:** Better Auth with Google OAuth
- **AI:** Google Gemini via `@google/genai` SDK (model: `gemini-3-pro-image-preview`)
- **Storage:** Vercel Blob (production) / local filesystem (development)
- **UI:** shadcn/ui with Tailwind CSS v4

### Core Data Flow

1. **API Keys:** Users store their Google AI API key encrypted (AES-256-GCM) in the `userApiKeys` table. The key is decrypted server-side only when generating images.

2. **Image Generation:**
   - User builds a prompt using the PromptBuilder UI (location, lighting, camera, style, subjects)
   - Subjects can be linked to Avatars (reference images) for consistent character/object generation
   - `src/lib/gemini.ts` handles API calls with multi-turn conversation support for refinements
   - Generated images are stored via the storage abstraction and tracked in `generations`/`generatedImages` tables

3. **Gallery System:**
   - Users can toggle images public/private via `isPublic` flag
   - Public gallery shows community images with like functionality
   - Like counts tracked in `imageLikes` table

### Key Directories

- `src/app/generate/` - Main generation UI with three-column layout (PromptBuilder, Preview, Results)
- `src/components/generate/` - Generation-specific components including prompt builder and results panels
- `src/hooks/` - Custom hooks for avatars, generation, presets, API key, and prompt builder state
- `src/lib/gemini.ts` - Gemini API integration with reference image support
- `src/lib/schema.ts` - Drizzle schema (extends base auth tables with: `userApiKeys`, `avatars`, `presets`, `generations`, `generatedImages`, `generationHistory`, `imageLikes`)
- `src/lib/types/generation.ts` - TypeScript types for generation system

### Authentication Pattern

Server-side: Use `getSession()` from `src/lib/session.ts`
Client-side: Use `useSession()` from `src/lib/auth-client.ts`

### Storage Abstraction

`src/lib/storage.ts` auto-switches between local filesystem (`public/uploads/`) and Vercel Blob based on `BLOB_READ_WRITE_TOKEN` presence.

## Environment Variables

Required:
- `POSTGRES_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - 32+ char secret for auth
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - Google OAuth credentials
- `NEXT_PUBLIC_APP_URL` - App URL (used for image fetching in Gemini API calls)

Optional:
- `BLOB_READ_WRITE_TOKEN` - Enables Vercel Blob storage (otherwise uses local)

## Project Rules

- Never start the dev server automatically. Ask the user for terminal output when needed.
