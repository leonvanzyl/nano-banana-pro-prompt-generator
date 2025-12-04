# Platform Admin Dashboard - Implementation Plan

## Phase 1: Database & Authentication Configuration

### Schema Changes
- [x] Add `platformRole` field to user table in `src/lib/schema.ts`
  ```typescript
  platformRole: text("platform_role"), // nullable, 'admin' for admins
  ```

### Better Auth Configuration
- [x] Update `src/lib/auth.ts` to include `additionalFields` for `platformRole`
  ```typescript
  user: {
    additionalFields: {
      platformRole: {
        type: "string",
        required: false,
        defaultValue: null,
        input: false,
      },
    },
  },
  ```

### Database Migration
- [x] Run `pnpm db:generate` to generate migration
- [x] Run `pnpm db:migrate` to apply migration

### Types
- [x] Create `src/lib/types/admin.ts` with types:
  - `PlatformRole`
  - `AdminUser` (with avatarCount, imageCount)
  - `AdminAvatar` (with user info)
  - `AdminImage` (with user info, prompt, likeCount)
  - `UserSearchResult`
  - `PaginatedResponse<T>`

---

## Phase 2: Authorization Layer

### Admin Helper Functions
- [x] Create `src/lib/admin.ts` with:
  - `requireAdmin()` - Server-side check, redirects to `/` if not admin
  - `isAdmin()` - Returns session if admin, null otherwise (for API routes)

### Route Protection Updates
- [x] Update `src/proxy.ts` to add `/admin/:path*` to matcher array
- [x] Update `src/lib/session.ts` to add `/admin` to `protectedRoutes` array

---

## Phase 3: Admin API Routes

### Users API
- [x] Create `src/app/api/admin/users/route.ts`
  - GET: List users with search, pagination, avatar/image counts
- [x] Create `src/app/api/admin/users/[id]/route.ts`
  - DELETE: Delete user (with self-deletion prevention)
- [x] Create `src/app/api/admin/users/search/route.ts`
  - GET: Search users for autocomplete dropdown

### Avatars API
- [x] Create `src/app/api/admin/avatars/route.ts`
  - GET: List avatars with user info, filter by userId, pagination
- [x] Create `src/app/api/admin/avatars/[id]/route.ts`
  - DELETE: Delete avatar and image from storage

### Images API
- [x] Create `src/app/api/admin/images/route.ts`
  - GET: List images with user info, filter by userId, pagination
- [x] Create `src/app/api/admin/images/[id]/route.ts`
  - DELETE: Delete image and file from storage

---

## Phase 4: UI Components

### Install Dependencies
- [x] Run `npx shadcn@latest add table` to add Table component

### Admin Layout & Navigation
- [x] Create `src/app/admin/layout.tsx`
  - Server-side admin check with `requireAdmin()`
  - Container layout with sidebar and content area
- [x] Create `src/components/admin/admin-sidebar.tsx`
  - Navigation links: Users, Avatars, Images
  - Active state highlighting
  - Back to app link

### Reusable Admin Components
- [x] Create `src/components/admin/user-search.tsx`
  - Search input with debounced API calls
  - Autocomplete dropdown with user results
  - Selected user display with clear button
- [x] Create `src/components/admin/delete-confirmation.tsx`
  - AlertDialog wrapper for delete confirmations
  - Loading state during deletion
- [x] Create `src/components/admin/pagination.tsx`
  - Page navigation (prev/next)
  - Page size selector (20, 30, 50)
  - Item count display

---

## Phase 5: Admin Pages

### Dashboard Entry
- [x] Create `src/app/admin/page.tsx`
  - Redirect to `/admin/users`

### Users Page
- [x] Create `src/app/admin/users/page.tsx`
  - Search input for filtering by name/email
  - Table with columns: User, Role, Avatars, Images, Joined, Actions
  - Clickable avatar/image counts linking to filtered views
  - Delete button with confirmation
  - Pagination controls
  - Loading skeleton states

### Avatars Page
- [x] Create `src/app/admin/avatars/page.tsx`
  - UserSearch component for filtering
  - Table/grid with columns: Thumbnail, Name, Type, Owner, Created, Actions
  - Support for `?userId=` query param (for navigation from users page)
  - Delete button with confirmation
  - Pagination controls

### Images Page
- [x] Create `src/app/admin/images/page.tsx`
  - UserSearch component for filtering
  - Grid with: Thumbnail, Prompt, Owner, Public badge, Likes, Actions
  - Support for `?userId=` query param
  - Delete button with confirmation
  - Pagination controls

---

## Phase 6: Navigation Integration

### Site Header Update
- [x] Update `src/components/site-header.tsx`
  - Check `session.user.platformRole === 'admin'`
  - Add conditional Admin link with Shield icon
  - Add to both desktop and mobile navigation

---

## Phase 7: Final Verification

### Code Quality
- [x] Run `pnpm lint` and fix any issues
- [x] Run `pnpm typecheck` and fix any type errors

### Manual Testing
- [ ] Set a test user as admin in database
- [ ] Verify admin can access all admin pages
- [ ] Verify non-admin users are redirected
- [ ] Test user search and filtering
- [ ] Test pagination on all pages
- [ ] Test delete functionality for users, avatars, and images
- [ ] Verify cascade deletes work correctly
- [ ] Test admin cannot delete themselves

---

## Files Summary

### New Files (15)
| File | Description |
|------|-------------|
| `src/lib/admin.ts` | Admin authorization helpers |
| `src/lib/types/admin.ts` | TypeScript types for admin features |
| `src/app/api/admin/users/route.ts` | Users list API |
| `src/app/api/admin/users/[id]/route.ts` | User delete API |
| `src/app/api/admin/users/search/route.ts` | User search API |
| `src/app/api/admin/avatars/route.ts` | Avatars list API |
| `src/app/api/admin/avatars/[id]/route.ts` | Avatar delete API |
| `src/app/api/admin/images/route.ts` | Images list API |
| `src/app/api/admin/images/[id]/route.ts` | Image delete API |
| `src/app/admin/layout.tsx` | Admin layout with auth check |
| `src/app/admin/page.tsx` | Admin redirect page |
| `src/app/admin/users/page.tsx` | Users management page |
| `src/app/admin/avatars/page.tsx` | Avatars management page |
| `src/app/admin/images/page.tsx` | Images management page |
| `src/components/admin/admin-sidebar.tsx` | Admin navigation sidebar |
| `src/components/admin/user-search.tsx` | User search/filter component |
| `src/components/admin/delete-confirmation.tsx` | Delete confirmation dialog |
| `src/components/admin/pagination.tsx` | Pagination controls |

### Modified Files (6)
| File | Change |
|------|--------|
| `src/lib/schema.ts` | Add `platformRole` field to user table |
| `src/lib/auth.ts` | Add `additionalFields` for platformRole |
| `src/lib/auth-client.ts` | Add `inferAdditionalFields` plugin for client-side typing |
| `src/proxy.ts` | Add `/admin` to route matcher |
| `src/lib/session.ts` | Add `/admin` to protectedRoutes |
| `src/components/site-header.tsx` | Add conditional admin nav link |
