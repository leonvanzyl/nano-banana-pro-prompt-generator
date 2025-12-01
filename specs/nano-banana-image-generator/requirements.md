# Nano Banana Pro - Image Generation Application

## Overview

Build a prompt builder and image generation application using the Nano Banana Pro (Gemini 3 Pro Image) model. Users bring their own Google API keys and can generate images via text-to-image or image-to-image (using reusable avatars).

## Tech Stack (Existing)

- **Framework**: Next.js 16 + React 19 + TypeScript
- **Auth**: Better Auth with Google OAuth
- **Database**: PostgreSQL + Drizzle ORM
- **UI**: shadcn/ui + Tailwind CSS
- **Storage**: Vercel Blob with local fallback

## Core Features

### 1. Three-Column UI Layout

**Left Panel - Prompt Builder:**
- Setting/Location selector with predefined templates (Name + Description format)
- Lighting selector with templates
- Camera/Composition selector with templates
- Style selector with templates
- Subject management (add multiple subjects)
  - Each subject can link to an Avatar
  - Customize: pose, action, clothing, hair, makeup, facial expression
- All attributes support both dropdown template selection AND free text input
- Templates displayed in modals with name and description

**Middle Panel - Preview & Generate:**
- Live preview of the assembled prompt text (updates as user changes attributes)
- Generate button
- Number of images selector (1, 2, 3, or 4)
- Settings toggle button that opens modal with:
  - Resolution (1K, 2K, 4K)
  - Aspect ratio (1:1, 16:9, 9:16, 4:3, 3:4, 21:9)

**Right Panel - Results:**
- Display generated images with loading skeletons
- Support for multiple images (1-4)
- Each image shows while generating (skeleton to image transition)

### 2. Avatar System (Image-to-Image)

- Users can create Avatars (name, reference image, description/attributes)
- Avatar types: human or object
- Avatars are reusable across generations
- When adding a subject, user can select from their saved avatars
- Avatar image gets sent as reference image to the API
- Support up to 6 object images and 5 human images per generation

### 3. Preset System

- Users can save complete prompt configurations as presets
- Load presets to populate all form fields
- Presets stored per user in database

### 4. Multi-Turn / Iterative Generation

- Users can refine previous generations with follow-up instructions
- Conversation history maintained for iterative refinement
- "Refine this image" flow

### 5. User Authentication & Galleries

- Google OAuth via Better Auth (existing)
- Personal Gallery: User's own generations (all images)
- Public Gallery: Images marked as "Public" by their creators
- Image visibility toggle (Private/Public)
- Each image stores: prompt used, generation settings, creator info

### 6. Public Gallery (Homepage)

- Showcase public images from all users
- Show creator's name and avatar alongside images
- Show the prompt used for each image

### 7. User API Key Management

- Users bring their own Google GenAI API keys
- Keys stored encrypted at rest (AES-256-GCM)
- Key management in Profile/Settings page
- Only key hint (last 4 chars) shown after saving
- Server-side decryption only during API calls

## Nano Banana Pro API Details

- **SDK**: `@google/genai`
- **Model**: `gemini-3-pro-image-preview`
- **Reference Images**: Up to 14 total (6 objects + 5 humans for character consistency)
- **Output**: 1K, 2K, 4K resolution
- **Aspect Ratios**: Various (9:16, 16:9, 21:9, 1:1, 4:3, 3:4)
- **Response**: TEXT and IMAGE parts, images as base64 inline data

## Prompt Building Guidelines (from Nano Banana Pro docs)

Effective prompts should include:
- **Subject**: Who or what is in the image (specific details)
- **Composition**: How the shot is framed (close-up, wide shot, low angle, etc.)
- **Action**: What is happening
- **Location**: Where the scene takes place
- **Style**: Overall aesthetic (photorealistic, 3D animation, watercolor, etc.)
- **Camera/Lighting**: Depth of field, golden hour, studio lighting, etc.
- **Editing Instructions**: For modifying existing images

## Template Categories

1. **Lighting**: Golden Hour, Studio, Neon, Dramatic Shadows, Natural, Cinematic, Backlit, Moonlight
2. **Camera**: Close-up, Wide Shot, Low Angle, Bird's Eye, Portrait, Dutch Angle, Macro, Over-shoulder
3. **Style**: Photorealistic, 3D Animation, Watercolor, Film Noir, Vintage, Anime, Oil Painting, Cyberpunk
4. **Location**: Urban City, Forest, Beach, Studio Backdrop, Futuristic, Mountains, Cafe, Abstract
5. **Pose**: Standing, Sitting, Walking, Running, Leaning, Lying, Jumping, Crouching
6. **Action**: Smiling, Talking, Working, Dancing, Reading, Thinking, Laughing
7. **Clothing**: Casual, Formal, Athletic, Elegant, Vintage, Streetwear
8. **Expression**: Neutral, Happy, Serious, Surprised, Confident, Mysterious

## Database Tables Required

1. **userApiKeys** - Encrypted Google API key storage
2. **avatars** - Reusable reference images
3. **presets** - Saved prompt configurations
4. **generations** - Parent record for each generation session
5. **generatedImages** - Individual images from a generation
6. **generationHistory** - Multi-turn conversation history

## Security Requirements

- API keys encrypted with AES-256-GCM
- Server-side encryption key in environment variables
- Keys never returned to client (only hint)
- Session-based user isolation on all queries
- File storage validation (type, size limits)
