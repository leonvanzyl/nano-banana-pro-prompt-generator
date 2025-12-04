# Platform Admin Dashboard - Requirements

## Overview
Add a platform admin dashboard that allows users with admin privileges to view and manage all users, avatars, and generated images across the platform.

## User Stories

### As a platform admin, I want to:
1. Access an admin-only dashboard from the main navigation
2. View all registered users in the application
3. View all avatars created by users across the platform
4. View all generated images across the platform
5. Filter avatars and images by specific user
6. Delete users, avatars, and images when necessary
7. Navigate quickly from a user to their avatars or images

## Functional Requirements

### Authentication & Authorization
- Add a `platformRole` field to the user table (nullable text field)
- Users with `platformRole = 'admin'` can access the admin dashboard
- Non-admin users attempting to access `/admin` routes are redirected to the home page
- All admin API endpoints return 403 Forbidden for non-admin users

### Admin Dashboard Routes
- `/admin` - Main admin page (redirects to `/admin/users`)
- `/admin/users` - View all users
- `/admin/avatars` - View all avatars
- `/admin/images` - View all generated images

### Users Page (`/admin/users`)
- Display paginated list of all users (20-50 per page)
- Show: User avatar, name, email, role badge, avatar count, image count, join date
- Search users by name or email
- Quick links from each user row to their avatars and images
- Delete user button (with confirmation dialog)
- Admin cannot delete their own account

### Avatars Page (`/admin/avatars`)
- Display paginated list/grid of all avatars
- Show: Avatar thumbnail, name, type (human/object), owner name, created date
- Filter by user using search input with autocomplete dropdown
- Delete avatar button (with confirmation dialog)

### Images Page (`/admin/images`)
- Display paginated grid of all generated images
- Show: Image thumbnail, prompt (truncated), owner name, public/private badge, like count, created date
- Filter by user using search input with autocomplete dropdown
- Delete image button (with confirmation dialog)

### UI/UX Requirements
- Admin sidebar navigation for switching between pages
- Consistent table/grid layouts across all admin pages
- Pagination controls with page size selector (20, 30, 50)
- Search input with debounced autocomplete for user filtering
- Delete confirmation dialogs to prevent accidental deletions
- Loading states and error handling
- Admin link in main navigation (visible only to admins)

## Non-Functional Requirements
- All admin operations require server-side authorization checks
- Cascade deletes maintain referential integrity
- Parameterized queries to prevent SQL injection
- Responsive design for desktop and mobile views

## Out of Scope
- Edit/modify capabilities (admin can only view and delete)
- Bulk operations (batch delete)
- Export functionality
- Audit logging
- Role management UI (admins are set via direct database update)
