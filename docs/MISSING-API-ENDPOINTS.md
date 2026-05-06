# Missing API Endpoints to Achieve Dashboard Control

## Summary
**To eliminate Supabase Studio dependency, you need 12 new API endpoints.**

---

## Tier 1: HIGH PRIORITY (Will immediately enable full admin control)

### 1. Submission Status Management
**Why:** Currently admins can't respond to form submissions in the dashboard

```
PATCH /api/admin/submissions/contact/[id]
- Body: { status: 'new' | 'reviewed' | 'responded' | 'archived', notes?: string }
- Updates contact_submissions table
- Auth: Admin required

PATCH /api/admin/submissions/involvement/[id]
- Body: { status: 'new' | 'contacted' | 'qualified' | 'in_progress' | 'closed', notes?: string }
- Updates involvement_leads table
- Auth: Admin required

DELETE /api/admin/submissions/contact/[id]
- Soft delete (mark as archived) or hard delete
- Auth: Admin required

DELETE /api/admin/submissions/involvement/[id]
- Soft delete (mark as archived) or hard delete
- Auth: Admin required
```

---

### 2. Programs & Events CRUD
**Why:** Events hardcoded in src/data/site.ts; currently only readable

```
POST /api/admin/programs
- Body: { title, slug, program_type, summary, description, location, start_date, end_date, is_featured, status }
- Creates program_events row
- Returns: Created event object

PUT /api/admin/programs/[slug]
- Body: Same as POST
- Updates program_events row by slug
- Returns: Updated event object

DELETE /api/admin/programs/[slug]
- Deletes program_events row
- Returns: Success message

GET /api/admin/programs
- List all events (not just scheduled)
- For admin dashboard display
- Returns: Array of all events
```

**Also need:**
- Migrate 5 hardcoded events from src/data/site.ts to Supabase
- Update src/lib/program-content.ts to read from Supabase instead of site.ts
- Remove hardcoded data from site.ts

---

### 3. Impact Metrics CRUD
**Why:** Metrics in Supabase but only readable; no create/edit/delete

```
POST /api/admin/impact-metrics
- Body: { label, value_text, numeric_value, unit, category, metric_year, summary, is_featured, sort_order }
- Creates impact_metrics row
- Returns: Created metric object

PUT /api/admin/impact-metrics/[slug]
- Body: Same as POST
- Updates impact_metrics row
- Returns: Updated metric object

DELETE /api/admin/impact-metrics/[slug]
- Deletes impact_metrics row
- Returns: Success message

GET /api/admin/impact-metrics
- List all metrics (not filtered by featured)
- For admin dashboard display
- Returns: Array of all metrics
```

---

### 4. Donation Funds CRUD
**Why:** Funds in Supabase but only readable; no create/edit/delete

```
POST /api/admin/donation-funds
- Body: { slug, name, short_description, impact_summary, is_active, sort_order }
- Creates donation_funds row
- Returns: Created fund object

PUT /api/admin/donation-funds/[slug]
- Body: Same as POST
- Updates donation_funds row
- Returns: Updated fund object

DELETE /api/admin/donation-funds/[slug]
- Deletes donation_funds row
- Returns: Success message

GET /api/admin/donation-funds
- List all funds (including inactive)
- For admin dashboard display
- Returns: Array of all funds
```

---

## Tier 2: MEDIUM PRIORITY (Enhances dashboard functionality)

### 5. Donation Intents Dashboard
**Why:** Donations visible in public form submissions but not in admin dashboard

```
GET /api/admin/donations
- List all donation_intents
- Filter by: status, date range, fund_id
- Returns: Array of donation intents with summary stats

PATCH /api/admin/donations/[id]
- Body: { status: 'new' | 'contacted' | 'pledged' | 'paid' | 'cancelled', notes?: string }
- Updates donation_intents row
- Returns: Updated donation intent
```

---

### 6. Story Galleries & Videos CRUD
**Why:** Galleries and videos are view-only; no create/edit/delete

```
POST /api/admin/stories/galleries
- Body: { slug, title, excerpt, story_date, cover_image_path, layout_style, status }
- Creates story_galleries row
- Returns: Created gallery object

PUT /api/admin/stories/galleries/[slug]
- Body: Same as POST
- Updates story_galleries row
- Returns: Updated gallery object

DELETE /api/admin/stories/galleries/[slug]
- Deletes story_galleries + related story_gallery_items
- Returns: Success message

POST /api/admin/stories/videos
- Body: { slug, title, summary, video_path, thumbnail_path, duration_seconds, status }
- Creates video_stories row
- Returns: Created video object

PUT /api/admin/stories/videos/[slug]
- Body: Same as POST
- Updates video_stories row
- Returns: Updated video object

DELETE /api/admin/stories/videos/[slug]
- Deletes video_stories row
- Returns: Success message
```

---

## Implementation Strategy

### Step 1: Create Form Components
For each missing section, create a form component matching the existing pattern:
- [src/components/programs-form.tsx](src/components/programs-form.tsx) (new)
- [src/components/impact-form.tsx](src/components/impact-form.tsx) (new)
- [src/components/donations-form.tsx](src/components/donations-form.tsx) (new)
- [src/components/submissions-actions.tsx](src/components/submissions-actions.tsx) (new)

**Template to follow:** Look at [src/components/team-form.tsx](src/components/team-form.tsx) or [src/components/story-form.tsx](src/components/story-form.tsx)

### Step 2: Create Server Actions
Create form actions for mutations:
- `src/app/admin/programs/form-actions.ts` (new)
- `src/app/admin/impact/form-actions.ts` (new)
- `src/app/admin/donations/form-actions.ts` (new)
- `src/app/admin/submissions/form-actions.ts` (new)

**Template to follow:** Look at [src/app/admin/team/form-actions.ts](src/app/admin/team/form-actions.ts)

### Step 3: Create API Routes
Create the 12 endpoints (or use existing structure):
- [src/app/api/admin/programs/route.ts](src/app/api/admin/programs/route.ts) (POST/PUT/DELETE)
- [src/app/api/admin/impact-metrics/route.ts](src/app/api/admin/impact-metrics/route.ts) (POST/PUT/DELETE)
- [src/app/api/admin/donation-funds/route.ts](src/app/api/admin/donation-funds/route.ts) (POST/PUT/DELETE)
- [src/app/api/admin/submissions/[type]/[id]/route.ts](src/app/api/admin/submissions/[type]/[id]/route.ts) (PATCH/DELETE)

### Step 4: Update Dashboard Pages
Add edit/create UI to:
- `/admin/programs/page.tsx` - Add create button, edit links, delete buttons
- `/admin/impact/page.tsx` - Add create form, edit buttons
- `/admin/donations/page.tsx` - Add create form, edit buttons
- `/admin/submissions/page.tsx` - Add status dropdowns, notes field, delete buttons

### Step 5: Data Migration
For programs/events:
- Read hardcoded events from `src/data/site.ts`
- Create them in Supabase via admin form (or SQL migration)
- Update `src/lib/program-content.ts` to read from Supabase
- Remove hardcoded events from `src/data/site.ts`

---

## Effort Estimate

| Task | Hours | Complexity |
|------|-------|-----------|
| Submission status management | 2-3 | Easy |
| Programs & Events CRUD | 3-4 | Medium |
| Impact Metrics CRUD | 3-4 | Medium |
| Donation Funds CRUD | 2-3 | Easy |
| **Tier 1 Total** | **10-14** | |
| Donation Intents Dashboard | 2 | Easy |
| Galleries & Videos CRUD | 3-4 | Medium |
| **Tier 2 Total** | **5-6** | |

---

## Testing Checklist

After implementing each endpoint:
- [ ] POST endpoint creates record in Supabase
- [ ] PUT endpoint updates record correctly
- [ ] DELETE endpoint removes record safely
- [ ] UI form submits data correctly
- [ ] Error handling displays to user
- [ ] Status/validation rules enforced
- [ ] RLS policies allow admin access
- [ ] Timestamps (created_at, updated_at) set correctly
- [ ] Redirects happen on success
- [ ] Duplicate prevention (e.g., slug uniqueness)

---

## RLS Policy Verification

Ensure Row-Level Security policies allow admins to:
- Read all records in admin dashboard tables
- Write (create/update/delete) to content tables
- Update status fields on submission tables

Check [docs/admin/rls-policies.sql](docs/admin/rls-policies.sql) for current policies.
