# Nano Banana Pro - Implementation Plan

## Phase 0: Boilerplate Cleanup

Before building new features, remove all boilerplate-specific code that's not needed for the image generation app.

### Files to Delete

- [x] `src/app/api/chat/route.ts` - Chat endpoint (not needed)
- [x] `src/app/api/diagnostics/route.ts` - Setup diagnostic endpoint
- [x] `src/app/page.tsx` - Boilerplate welcome page (will be replaced)
- [x] `src/app/chat/` - Entire directory (page.tsx, error.tsx, loading.tsx)
- [x] `src/app/dashboard/` - Entire directory (placeholder dashboard)
- [x] `src/components/setup-checklist.tsx` - Boilerplate setup checker
- [x] `src/components/starter-prompt-modal.tsx` - Boilerplate meta tool
- [x] `src/components/ui/github-stars.tsx` - GitHub stars display
- [x] `src/hooks/use-diagnostics.ts` - Diagnostics hook

### Files to Customize

- [x] Update `src/components/site-header.tsx` - Change branding to "Nano Banana Pro"
- [x] Update `src/components/site-footer.tsx` - Update links/attribution
- [x] Update `src/app/layout.tsx` - Update metadata/title

---

## Phase 1: Database Schema

### Tasks

- [x] Add `uuid` import to schema.ts from `drizzle-orm/pg-core`
- [x] Create `userApiKeys` table (UUID id, encrypted key, iv, hint)
- [x] Create `avatars` table (UUID id, userId, name, imageUrl, description, avatarType)
- [x] Create `presets` table (UUID id, userId, name, config JSON)
- [x] Create `generations` table (UUID id, userId, prompt, settings JSON, status)
- [x] Create `generatedImages` table (UUID id, generationId, imageUrl, isPublic)
- [x] Create `generationHistory` table (UUID id, generationId, role, content, imageUrls)
- [x] Create TypeScript types in `src/lib/types/generation.ts`
- [x] Run database migration: `pnpm db:generate && pnpm db:migrate`

### Schema Details

```typescript
// All new tables use UUID with .defaultRandom()
// Foreign keys to user table use text (matching BetterAuth)
// Foreign keys between new tables use uuid
```

---

## Phase 2: Secure API Key Management

### Tasks

- [x] Generate encryption secret: `openssl rand -hex 32`
- [x] Add `ENCRYPTION_SECRET` to `.env` and `src/lib/env.ts` validation
- [x] Create `src/lib/encryption.ts` with AES-256-GCM encrypt/decrypt functions
- [x] Create `GET /api/user/api-key` - Check if key exists (returns hint only)
- [x] Create `POST /api/user/api-key` - Save encrypted API key
- [x] Create `DELETE /api/user/api-key` - Remove API key
- [x] Create `src/components/profile/api-key-form.tsx` component
- [x] Add API key management section to profile page

---

## Phase 3: Gemini SDK Integration

### Tasks

- [x] Install Google GenAI SDK: `pnpm add @google/genai`
- [x] Create `src/lib/gemini.ts` wrapper with `generateWithUserKey` function
- [x] Handle reference images (base64 encoding)
- [x] Handle multi-turn conversation history
- [x] Configure response modalities (TEXT + IMAGE)
- [x] Configure image settings (aspectRatio, imageSize)

---

## Phase 4: Template Data

### Tasks

- [x] Create `src/lib/data/templates.ts`
- [x] Define `Template` interface (id, name, description, promptFragment)
- [x] Create `lightingTemplates` array (8 templates)
- [x] Create `cameraTemplates` array (8 templates)
- [x] Create `styleTemplates` array (10 templates)
- [x] Create `locationTemplates` array (8 templates)
- [x] Create `poseTemplates` array (8 templates)
- [x] Create `actionTemplates` array (7 templates)
- [x] Create `clothingTemplates` array (6 templates)
- [x] Create `expressionTemplates` array (6 templates)

---

## Phase 5: Avatar System

### Tasks

- [x] Create `GET /api/avatars` - List user's avatars
- [x] Create `POST /api/avatars` - Create new avatar (with image upload)
- [x] Create `GET /api/avatars/[id]` - Get single avatar
- [x] Create `PUT /api/avatars/[id]` - Update avatar
- [x] Create `DELETE /api/avatars/[id]` - Delete avatar
- [x] Create `src/app/avatars/page.tsx` - Avatar management page
- [x] Create `src/components/avatars/avatar-list.tsx`
- [x] Create `src/components/avatars/avatar-card.tsx`
- [x] Create `src/components/avatars/avatar-form-modal.tsx`
- [x] Create `src/components/avatars/avatar-selector-modal.tsx` (for subject selection)
- [x] Create `src/hooks/use-avatars.ts` hook

---

## Phase 6: Prompt Builder UI

### Tasks

- [x] Install additional shadcn components: `pnpm dlx shadcn@latest add select tabs slider scroll-area sheet`
- [x] Create `src/app/generate/page.tsx` - Main generator page
- [x] Create `src/components/generate/three-column-layout.tsx`
- [x] Create `src/components/generate/prompt-builder/prompt-builder-panel.tsx`
- [x] Create `src/components/generate/prompt-builder/template-selector.tsx` (reusable)
- [x] Create `src/components/generate/prompt-builder/template-modal.tsx`
- [x] Create `src/components/generate/prompt-builder/subject-manager.tsx`
- [x] Create `src/components/generate/prompt-builder/subject-card.tsx`
- [x] Create `src/hooks/use-prompt-builder.ts` hook (form state + prompt assembly)

---

## Phase 7: Preview & Generate Panel

### Tasks

- [x] Create `src/components/generate/preview/preview-panel.tsx`
- [x] Create `src/components/generate/preview/prompt-preview.tsx` (live text preview) - integrated into preview-panel.tsx
- [x] Create `src/components/generate/preview/image-count-selector.tsx` (1-4 images) - integrated into preview-panel.tsx
- [x] Create `src/components/generate/preview/settings-modal.tsx` (resolution, aspect ratio) - integrated into preview-panel.tsx
- [x] Implement prompt assembly logic in `use-prompt-builder.ts`

---

## Phase 8: Generation API & Results

### Tasks

- [x] Create `POST /api/generate` - Start generation
- [x] Create `GET /api/generations` - List user's generations (paginated)
- [x] Create `GET /api/generations/[id]` - Get generation with images
- [x] Create `DELETE /api/generations/[id]` - Delete generation
- [x] Create `src/components/generate/results/results-panel.tsx`
- [x] Create `src/components/generate/results/image-card.tsx`
- [x] Create `src/components/generate/results/image-skeleton.tsx`
- [x] Create `src/hooks/use-generation.ts` hook
- [x] Implement image saving to storage (using existing storage.ts)

---

## Phase 9: Multi-Turn Refinement

### Tasks

- [x] Create `POST /api/generate/[id]/refine` - Refine existing generation
- [x] Create `src/components/generate/results/refine-input.tsx`
- [x] Update `use-generation.ts` hook for refinement flow
- [x] Store conversation history in `generationHistory` table

---

## Phase 10: Preset System

### Tasks

- [x] Create `GET /api/presets` - List user's presets
- [x] Create `POST /api/presets` - Save new preset
- [x] Create `GET /api/presets/[id]` - Get single preset
- [x] Create `PUT /api/presets/[id]` - Update preset
- [x] Create `DELETE /api/presets/[id]` - Delete preset
- [x] Create `src/components/presets/preset-list.tsx`
- [x] Create `src/components/presets/save-preset-modal.tsx`
- [x] Create `src/components/presets/load-preset-dropdown.tsx`
- [x] Create `src/hooks/use-presets.ts` hook
- [x] Integrate preset loading into prompt builder

---

## Phase 11: Gallery System

### Tasks

- [x] Create `GET /api/gallery/public` - Public gallery (paginated)
- [x] Create `PATCH /api/images/[id]/visibility` - Toggle public/private
- [x] Create `src/app/page.tsx` - Public gallery homepage
- [x] Create `src/app/gallery/page.tsx` - Personal gallery
- [x] Create `src/components/gallery/gallery-grid.tsx`
- [x] Create `src/components/gallery/image-card.tsx`
- [x] Create `src/components/gallery/image-detail-modal.tsx`
- [x] Create `src/components/gallery/visibility-toggle.tsx`
- [x] Show creator info (name, avatar) on public gallery images
- [x] Display original prompt on each image

---

## Phase 12: Polish & Error Handling

### Tasks

- [x] Add error handling for missing API key (prompt to add in settings)
- [x] Add error handling for API errors (rate limits, invalid key, etc.)
- [x] Add loading states throughout UI
- [x] Implement mobile responsive design for three-column layout
- [x] Update navigation in site-header for new pages
- [x] Add proper metadata/SEO for all pages

---

## File Structure

```
src/
├── app/
│   ├── page.tsx                    # Public gallery homepage
│   ├── generate/page.tsx           # Main 3-column generator
│   ├── gallery/page.tsx            # Personal gallery
│   ├── avatars/page.tsx            # Avatar management
│   ├── profile/page.tsx            # Settings + API key
│   └── api/
│       ├── user/api-key/route.ts
│       ├── avatars/route.ts
│       ├── avatars/[id]/route.ts
│       ├── presets/route.ts
│       ├── presets/[id]/route.ts
│       ├── generate/route.ts
│       ├── generate/[id]/route.ts
│       ├── generate/[id]/refine/route.ts
│       ├── generations/route.ts
│       ├── generations/[id]/route.ts
│       ├── gallery/public/route.ts
│       └── images/[id]/visibility/route.ts
├── components/
│   ├── generate/
│   │   ├── three-column-layout.tsx
│   │   ├── prompt-builder/
│   │   ├── preview/
│   │   └── results/
│   ├── avatars/
│   ├── presets/
│   ├── gallery/
│   └── profile/
├── hooks/
│   ├── use-prompt-builder.ts
│   ├── use-generation.ts
│   ├── use-avatars.ts
│   └── use-presets.ts
└── lib/
    ├── types/generation.ts
    ├── data/templates.ts
    ├── encryption.ts
    └── gemini.ts
```

---

## Environment Variables

```env
# Existing
POSTGRES_URL=...
BETTER_AUTH_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXT_PUBLIC_APP_URL=...
BLOB_READ_WRITE_TOKEN=...

# New - Required
ENCRYPTION_SECRET=<64-char-hex-string>  # For API key encryption
```
