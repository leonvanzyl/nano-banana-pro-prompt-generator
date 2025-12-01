# Nano Banana Pro

An AI-powered image generator application that uses Google's Gemini 3 Pro Image Preview model to create and refine images based on detailed prompts with optional reference images (avatars) for consistent character generation.

## Features

- **AI Image Generation**: Generate images using Google Gemini 3 Pro with multi-turn conversation support for refinements
- **Prompt Builder**: Intuitive UI to construct detailed prompts with location, lighting, camera angle, style, and subject options
- **Avatar System**: Upload reference images to maintain consistent characters/objects across generations
- **Gallery**: Browse and share generated images with the community
- **Like System**: Like and discover popular images from other users
- **BYOK (Bring Your Own Key)**: Users provide their own Google AI API key, stored securely with AES-256-GCM encryption

## Tech Stack

- **Framework**: Next.js 16 (App Router) with React 19
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth with Google OAuth
- **AI**: Google Gemini via `@google/genai` SDK
- **Storage**: Vercel Blob (production) / local filesystem (development)
- **UI**: shadcn/ui with Tailwind CSS v4

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google OAuth credentials
- pnpm (recommended)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd nano-banana-pro
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp env.example .env
   ```

4. Configure your `.env` file:
   ```env
   # Database
   POSTGRES_URL="postgresql://username:password@localhost:5432/nano_banana"

   # Authentication
   BETTER_AUTH_SECRET="your-random-32-character-secret-key"

   # Google OAuth
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"

   # App URL
   NEXT_PUBLIC_APP_URL="http://localhost:3000"

   # Optional: Vercel Blob storage (leave empty for local storage)
   BLOB_READ_WRITE_TOKEN=""
   ```

5. Set up the database:
   ```bash
   pnpm db:migrate
   ```

6. Start the development server:
   ```bash
   pnpm dev
   ```

7. Open [http://localhost:3000](http://localhost:3000)

## Usage

1. **Sign in** with your Google account
2. **Add your Google AI API key** in settings (get one from [Google AI Studio](https://aistudio.google.com/apikey))
3. **Create avatars** by uploading reference images for consistent character generation
4. **Build your prompt** using the Prompt Builder interface
5. **Generate images** and refine them with follow-up prompts
6. **Share to gallery** by making images public for the community to see

## Development Commands

```bash
pnpm dev              # Start dev server with Turbopack
pnpm build            # Build for production
pnpm lint             # Run ESLint
pnpm typecheck        # Run TypeScript type checking
pnpm check            # Run both lint and typecheck
pnpm format           # Format code with Prettier
```

### Database Commands

```bash
pnpm db:push          # Push schema changes (development)
pnpm db:generate      # Generate migrations
pnpm db:migrate       # Run migrations
pnpm db:studio        # Open Drizzle Studio GUI
pnpm db:reset         # Drop and recreate all tables
```

## Project Structure

```
src/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   ├── generate/             # Image generation page
│   ├── gallery/              # Public gallery page
│   └── dashboard/            # User dashboard
├── components/
│   ├── generate/             # Prompt builder and generation UI
│   ├── auth/                 # Authentication components
│   └── ui/                   # shadcn/ui components
├── hooks/                    # Custom React hooks
│   ├── use-avatars.ts        # Avatar management
│   ├── use-generation.ts     # Image generation logic
│   └── use-prompt-builder.ts # Prompt builder state
└── lib/
    ├── gemini.ts             # Gemini API integration
    ├── schema.ts             # Database schema
    ├── storage.ts            # File storage abstraction
    └── auth.ts               # Authentication config
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `POSTGRES_URL` | Yes | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Yes | 32+ character secret for auth |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth client secret |
| `NEXT_PUBLIC_APP_URL` | Yes | Application URL |
| `BLOB_READ_WRITE_TOKEN` | No | Vercel Blob token (uses local storage if not set) |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables
4. Deploy

The application will automatically use Vercel Blob for storage when `BLOB_READ_WRITE_TOKEN` is configured.

## License

MIT License - see [LICENSE](LICENSE) for details.
