# Cardy — Full Application Rebuild Plan

## Overview

A complete rebuild of the Cardy application — a digital card & invitation platform. The existing codebase is a Nuxt 3 + Supabase + NuxtUI/Tailwind v4 project. We keep the tech stack but rebuild every file from scratch with clean architecture, proper role-based routing, real DB relationships, and a new **Weddings** module.

---

## User Review Required

> [!IMPORTANT]
> The `.env` file currently has no `SUPABASE_URL=` key prefix on line 1 — just a bare URL. This will break in production. **Please verify your `.env` file starts with `SUPABASE_URL=https://ddupvifliropjkdnodye.supabase.co`.**

> [!IMPORTANT]
> The new Weddings module requires **new tables** to be added in Supabase. A new `supabase.sql` file will be generated. You must run it in the Supabase SQL editor before the features work.

> [!WARNING]
> The existing `profiles` table uses `role` values `'user' | 'designer' | 'admin'` but the current code sometimes uses `'editor'` (in the schema comment). We standardize to **`user | designer | admin`** throughout.

> [!NOTE]
> The existing `cards`, `valentines`, `design_requests`, `print_requests`, `profiles`, `app_settings`, and `designer_applications` tables remain. We add new `weddings`, `wedding_rsvps`, `wedding_wishes`, `card_templates`, and `card_ratings` tables.

---

## Open Questions

> [!IMPORTANT]
> **Ratings**: Should ratings be tied to `cards` only, or also to `card_templates` (designer-made templates)? I'll implement ratings on **card_templates** (what designers upload) and show real average ratings on the landing page.

> [!NOTE]
> **Valentine's**: Keep as-is (existing animated valentine page + simple message creation). No structural changes needed — just clean up the UI.

> [!NOTE]
> **Card Create simplification**: The current create page is ~33KB of complex options. We simplify to: pick a template (or blank), set recipient + message, optional time-lock + secret key, then save. Advanced styling is optional/collapsed.

---

## Architecture — 3 User Roles

| Role | Access |
|---|---|
| `user` | Landing, create card (simplified), my cards, my requests, weddings (create & view own), valentines |
| `designer` | All user pages + designer dashboard (manage design requests, upload templates) |
| `admin` | All pages + admin panel (users, designer applications, settings, all requests) |

### Route Structure

```
/                          — Public landing page (rich info, real stats, real ratings)
/login                     — Auth
/signup                    — Auth
/forgot-password           — Auth

/cards/[id]               — Public card viewer (no auth needed)
/valentines               — Public valentine animation viewer
/valentines/create        — Create a valentine message (no auth)

/dashboard                — User home (auth required → redirects by role)
/cards/create             — Simplified card creator
/cards/my                 — My cards list
/cards/my-requests        — My design requests
/profile                  — Profile settings

/designer                 — Designer dashboard
/designer/requests        — Manage design requests  
/designer/templates       — Upload & manage templates

/admin                    — Admin dashboard
/admin/users              — User management (view, change roles)
/admin/applications       — Designer applications
/admin/requests           — All design requests
/admin/settings           — App settings (feature flags)

/weddings/create          — Create a wedding event (auth required)
/weddings/my              — My weddings list
/weddings/[slug]          — Public wedding invitation page (open via shared link)
/weddings/[slug]/rsvp     — RSVP form (public)
```

---

## Database — New Tables (additions to existing schema)

### `card_templates`
Designer-uploaded card templates that users can pick from during card creation.
```sql
id, designer_id (profiles), title, description, thumbnail_url, 
preview_url, category, is_active, created_at
```

### `card_ratings`
Real ratings tied to card_templates (replaces hardcoded testimonials).
```sql
id, template_id (card_templates), user_id (profiles), 
rating (1-5), comment, created_at
```

### `weddings`
Core wedding event record.
```sql
id, user_id (profiles), slug (unique, for URL),
couple_name_1, couple_name_2, wedding_date, 
venue_name, venue_address, venue_lat, venue_lng,
ceremony_time, reception_time, 
cover_image_url, theme_color, theme_preset,
welcome_message, story_text,
dress_code, additional_info,
is_published, created_at, updated_at
```

### `wedding_rsvps`
Responses from guests.
```sql
id, wedding_id (weddings), guest_name, guest_email,
attendance_status (attending | not_attending | maybe),
how_they_know (bride | groom | both | other),
how_they_know_detail (text),
dietary_restrictions, plus_one (bool), plus_one_name,
message_to_couple, created_at
```

### `wedding_wishes`
Standalone wishes/messages posted on the wedding page.
```sql
id, wedding_id (weddings), guest_name, 
wish_message, is_approved, created_at
```

---

## Proposed Changes

### Infrastructure / Config

#### [MODIFY] [nuxt.config.ts](file:///c:/Users/Lcheruiyot/Desktop/new/cardy/nuxt.config.ts)
- Add `app.head` for global SEO meta
- Keep existing module setup

#### [MODIFY] [.env](file:///c:/Users/Lcheruiyot/Desktop/new/cardy/.env)
- Fix missing `SUPABASE_URL=` key prefix

#### [NEW] supabase.sql (replace existing)
- All existing tables preserved
- Add 5 new tables: `card_templates`, `card_ratings`, `weddings`, `wedding_rsvps`, `wedding_wishes`
- Add RLS policies for all new tables
- Triggers and helper functions

---

### Types

#### [NEW] `types/index.ts`
Central type definitions for all entities: `Profile`, `Card`, `CardTemplate`, `CardRating`, `DesignRequest`, `Wedding`, `WeddingRsvp`, `WeddingWish`, `Valentine`, `PrintRequest`

---

### Plugins

#### [MODIFY] `plugins/supabase.client.ts`
- Clean up debug logging (remove in production)
- Keep auth persistence config

---

### Composables

#### [MODIFY] `composables/useAuth.ts`
- Add `isAdmin` computed
- Fix role check to include `'designer'` consistently
- Add redirect-after-login based on role
- Remove 1000ms artificial delay in fetchProfile

#### [NEW] `composables/useWeddings.ts`
- CRUD for weddings, fetch single by slug
- Generate unique slug from couple names + random suffix

#### [NEW] `composables/useTemplates.ts`
- Fetch public card templates
- Fetch templates by designer
- Submit ratings

#### [NEW] `composables/useAdmin.ts`
- Fetch all users, update roles
- Fetch/approve/reject designer applications
- Update app settings

---

### Middleware

#### [MODIFY] `middleware/auth.ts`
- Redirect to `/login` if not authenticated

#### [MODIFY] `middleware/designer.ts`
- Redirect if role is not `designer` or `admin`

#### [NEW] `middleware/admin.ts`
- Redirect if role is not `admin`

#### [MODIFY] `middleware/guest.ts`
- Redirect to `/dashboard` if already authenticated

---

### Layouts

#### [MODIFY] `layouts/default.vue`
- Role-aware nav: show correct links per role
- Add Wedding nav item
- Add Admin panel link for admins
- Cleaner mobile nav (hamburger menu)
- Dark mode toggle restored

#### [NEW] `layouts/auth.vue`
- Minimal centered layout for login/signup pages (no nav)

#### [NEW] `layouts/wedding.vue`
- Full-screen immersive layout for the public wedding invitation page
- No standard nav, just a "Back" link and share button

#### [NEW] `layouts/admin.vue`
- Sidebar layout for admin pages

---

### Pages — Auth

#### [MODIFY] `pages/login.vue`
- Fix: use `layout: 'auth'` 
- After login, redirect based on role (admin→`/admin`, designer→`/designer`, user→`/dashboard`)

#### [MODIFY] `pages/signup.vue`
- Use `layout: 'auth'`
- Clean up, remove complexity

#### [NEW] `pages/forgot-password.vue`
- Supabase password reset email flow

---

### Pages — User

#### [NEW] `pages/index.vue` (full rebuild)
- Hero section with real stats (card count from DB)
- Features section (cards, weddings, valentines)
- How it works section (3 steps)
- Designer showcase (templates with real ratings)
- CTA section

#### [NEW] `pages/dashboard.vue`
- Role-based redirect hub
- Shows user's quick stats: card count, wedding count, pending requests

#### [MODIFY] `pages/cards/create.vue` (was `pages/create.vue`)
- **Simplified**: Step 1 = pick template or blank, Step 2 = fill details (recipient, message, optional lock/key), Step 3 = preview & save
- No more overwhelming color pickers and align controls on one screen
- Advanced options in collapsible section

#### [NEW] `pages/cards/my.vue` (was `pages/my.vue`)
- List user's cards with preview thumbnails
- Delete/share actions

#### [NEW] `pages/cards/[id].vue` (was `pages/card/[id].vue`)
- Public card viewer — lock check, key prompt, reveal animation

#### [NEW] `pages/cards/my-requests.vue` (was `pages/my-requests.vue`)
- User's design requests list with status

#### [NEW] `pages/cards/request-design.vue` (was `pages/designer-request/`)
- Form to request a custom design from a designer

---

### Pages — Valentines

#### [MODIFY] `pages/valentines/index.vue`
- Keep animated experience, clean up UI

#### [MODIFY] `pages/valentines/create.vue`
- Simple form: sender name, recipient, message → generates shareable link

---

### Pages — Weddings (NEW MODULE)

#### [NEW] `pages/weddings/create.vue`
Multi-step wizard:
1. **Couple Info** — Names, relationship, short story
2. **Event Details** — Wedding date, ceremony time, reception time, venue name + address
3. **Design** — Cover image upload, theme color/preset, welcome message, dress code
4. **Settings** — Publish toggle, additional info
5. **Preview & Generate Link** — Shows the public URL `/weddings/[slug]`

#### [NEW] `pages/weddings/my.vue`
- List of user's wedding events with stats (RSVP count, wish count)
- Edit/delete/share actions

#### [NEW] `pages/weddings/[slug].vue`  
Public wedding invitation page (uses `wedding` layout). Procedural experience:
1. **Landing / Cover** — Full-screen cover with couple names, wedding date, venue
2. **Our Story** — Couple's story text
3. **Event Details** — Date, time, venue map link, dress code
4. **RSVP Section** — Button to open RSVP form (or inline)
5. **Wishes Wall** — Show approved wishes from guests
6. **Wishing Section** — Form to submit a wish

#### [NEW] `pages/weddings/[slug]/rsvp.vue`
Dedicated RSVP page:
- Guest name, email
- Attendance status (Yes/No/Maybe)
- How do you know the couple? (Bride's side / Groom's side / Both / Other)
- How you met (text field)
- Plus one? (toggle + name)
- Dietary restrictions
- Message to couple
- Submit → success animation

---

### Pages — Designer

#### [MODIFY] `pages/designer/dashboard.vue`  
- Real stats from DB
- Pending requests list
- Template management link

#### [NEW] `pages/designer/requests.vue` (was inline in dashboard)
- Full table of design requests assigned or pending
- Accept/reject/mark complete actions

#### [NEW] `pages/designer/templates.vue`
- Upload new card templates (title, description, thumbnail)
- List own templates with ratings

---

### Pages — Admin

#### [NEW] `pages/admin/index.vue`
- Dashboard: total users, cards, weddings, pending applications

#### [NEW] `pages/admin/users.vue`
- Table of all users
- Change role (user ↔ designer ↔ admin)
- Deactivate account

#### [NEW] `pages/admin/applications.vue`
- Table of designer applications (approve/reject)

#### [NEW] `pages/admin/requests.vue`
- All design requests across all users

#### [NEW] `pages/admin/settings.vue`
- Toggle feature flags (designer_applications_enabled, etc.)

---

### Server API

#### [MODIFY] `server/api/cards.post.ts`
- Clean up, proper error handling

#### [NEW] `server/api/cards/[id].get.ts`
- Fetch single card by ID (for the public viewer)

#### [NEW] `server/api/cards/[id].put.ts`
- Update card (owner only)

#### [NEW] `server/api/cards/[id].delete.ts`
- Delete card (owner only)

#### [NEW] `server/api/templates/index.get.ts`
- Get all active templates

#### [NEW] `server/api/templates/index.post.ts`
- Designer creates a template

#### [NEW] `server/api/templates/[id]/ratings.post.ts`
- Submit a rating for a template

#### [NEW] `server/api/weddings/index.post.ts`
- Create wedding event

#### [NEW] `server/api/weddings/my.get.ts`
- Get current user's weddings

#### [NEW] `server/api/weddings/[slug].get.ts`
- Get wedding by slug (public)

#### [NEW] `server/api/weddings/[slug].put.ts`
- Update wedding (owner only)

#### [NEW] `server/api/weddings/[slug]/rsvp.post.ts`
- Submit RSVP

#### [NEW] `server/api/weddings/[slug]/wishes.post.ts`
- Submit a wish

#### [NEW] `server/api/weddings/[slug]/wishes.get.ts`
- Get approved wishes

#### [NEW] `server/api/admin/users.get.ts`
- Admin: get all users

#### [NEW] `server/api/admin/users/[id]/role.put.ts`
- Admin: update user role

#### [NEW] `server/api/admin/applications.get.ts`
- Admin: get all designer applications

#### [NEW] `server/api/admin/applications/[id]/decide.put.ts`
- Admin: approve/reject application (also updates profile role)

#### [MODIFY] `server/api/design-requests.post.ts`
- Clean up existing

#### [NEW] `server/api/design-requests/index.get.ts`
- Get requests (scoped by role)

#### [NEW] `server/api/design-requests/[id]/status.put.ts`
- Designer updates status

---

### Components

#### [MODIFY] `components/CardPreview.vue`
- Cleaner card preview with template thumbnail support

#### [NEW] `components/TemplateCard.vue`
- Template tile with thumbnail, designer name, star rating

#### [NEW] `components/StarRating.vue`
- Interactive/display star rating component

#### [NEW] `components/WeddingCard.vue`
- Wedding event card for the `/weddings/my` list

#### [NEW] `components/WeddingRsvpForm.vue`
- Full RSVP form component

#### [NEW] `components/WeddingWishCard.vue`
- Individual wish display card

#### [NEW] `components/RsvpStatsBar.vue`
- Attending/not/maybe count bar for wedding owner

#### [NEW] `components/AdminSidebar.vue`
- Admin navigation sidebar

#### [NEW] `components/StatsCard.vue`
- Reusable stat display card for dashboards

#### [MODIFY] `components/TestimonialCard.vue`
- Use real data instead of hardcoded props (fed from real ratings)

---

## Verification Plan

### Automated Tests
- Run `npm run dev` and verify no build errors
- Navigate to all new routes and verify they load
- Test auth flow: signup → redirect to dashboard → sign out → redirect to login

### Browser Tests
- Test wedding creation flow (all 5 steps)
- Test RSVP submission and wish submission on public wedding page
- Test admin panel: change user role, approve designer application
- Test simplified card creation (template selection + fill + save)
- Test real ratings display on landing page

### Manual Verification
- Run new `supabase.sql` in Supabase SQL editor
- Verify RLS policies work (user can't see another user's weddings)
- Verify admin can change roles
