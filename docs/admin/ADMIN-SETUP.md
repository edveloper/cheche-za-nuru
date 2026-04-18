# Cheche Za Nuru Admin Setup Guide

## Phase 7: Admin and Workflow Layer

This guide walks through setting up Supabase Studio as the admin interface for managing foundation content and submissions.

---

## 1. User Management

### Creating Admin Accounts

1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. Click **"Invite"**
3. Enter the team member's email
4. They'll receive an invite link via email
5. They complete signup at that link

### Admin Roles

The foundation should have at least these roles:

| Role | Permissions | Responsibilities |
|------|-----------|------------------|
| **Editor** | Read/write content (stories, events, metrics) | Manage public-facing content |
| **Admin** | All permissions + user management | Oversee team, handle submissions |
| **Reviewer** | Read-only on submissions, write-only to update status | Review and respond to public submissions |

---

## 2. Row-Level Security (RLS) Setup

RLS policies control who can see and edit what data. Without RLS, anyone with Supabase access could see everything.

### Overview of Policy Approach

- **Public can read** published content (blog_posts with status='published', events with status='scheduled', etc.)
- **Public cannot write** to any table (submissions go through API forms only)
- **Editors can read/write** content tables (blog_posts, program_events, impact_metrics, etc.)
- **Admins can read/write** everything including submissions
- **Submission data is read-only** for editors (can be reviewed but not deleted without admin)

### Applying RLS Policies

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Create a new query
3. Copy the contents from `docs/admin/rls-policies.sql` (see Phase 7 docs)
4. Run the query
5. RLS is now active on all tables

**Note:** RLS policies are in a separate file for clarity and ease of updates.

---

## 3. Accessing Supabase Studio

### For Content Editors

1. Visit [your-project].supabase.co (get URL from Supabase dashboard)
2. Log in with your Supabase account
3. Click on any table to browse/edit data
4. Tables available for editing:
   - `program_events` — Event calendar
   - `impact_metrics` — Impact statistics
   - `blog_posts` — Story articles
   - `story_galleries` — Story galleries
   - `voice_submissions` — Community voices (approved by admin)

### For Admins (also see submissions)

1. Same login
2. Additional tables visible:
   - `donation_intents` — Donation inquiries
   - `contact_submissions` — General contact submissions
   - `involvement_leads` — Volunteer/partner inquiries

---

## 4. Publishing Workflow

### For Events (`program_events`)

**Status values:** `draft`, `scheduled`, `completed`, `cancelled`

**Workflow:**
1. Create event as `draft`
2. Fill in all fields (title, date, location, summary)
3. Check event date and details
4. Change status to `scheduled` when ready to publish
5. Event appears on `/programs` calendar
6. After event happens, change status to `completed` to hide it

**Approval checklist:**
- [ ] Title is clear and action-oriented
- [ ] Date is accurate (format: YYYY-MM-DD)
- [ ] Location is specific (not just "Nairobi" but include venue if possible)
- [ ] Summary (120 chars max) explains what to expect
- [ ] Program type is correct (education/healthcare/sports/community)
- [ ] All required fields filled (no blank fields)

---

### For Metrics (`impact_metrics`)

**Status:** Always active (no draft/publish mechanism yet)

**Workflow:**
1. Insert row with label (e.g., "Children directly supported")
2. Fill value_text (e.g., "2,400+")
3. Set category (education/healthcare/sports/cross_cutting)
4. Set is_featured = true if it should appear on homepage
5. Set sort_order (1, 2, 3, 4...) to control display order
6. Save

**Approval checklist:**
- [ ] Value is accurate and current
- [ ] Source data is documented (add to summary field)
- [ ] Label is clear and consistent with existing metrics
- [ ] Numeric value (if applicable) is reasonable
- [ ] Metric year is set if this is historical data

---

### For Blog Posts (`blog_posts`)

**Status values:** `draft`, `published`, `archived`

**Workflow:**
1. Create post as `draft`
2. Fill in:
   - `slug` — URL-friendly version of title (e.g., "scholarship-winners-2026")
   - `title` — Full title
   - `excerpt` — 1-2 sentence summary (shows in story list)
   - `body_md` — Full story in Markdown
   - `cover_image_path` — Path to image in Supabase storage
   - `author_name` — Who wrote it (default: "Cheche Za Nuru")
3. Save and preview on site
4. Change status to `published` when ready
5. Story appears on `/stories` page

**Approval checklist:**
- [ ] Title is compelling and clear
- [ ] Excerpt (2 sentences max) hooks readers
- [ ] Slug is unique and lowercase-hyphenated
- [ ] Body is written in Markdown (headers with ##, emphasis with **)
- [ ] Tone matches foundation voice (human, hopeful, grounded)
- [ ] Cover image is high-quality and relevant
- [ ] Author name is accurate or "Cheche Za Nuru"

**Markdown tips:**
```markdown
## Subheading

This is a paragraph.

**Bold text** for emphasis
*Italic text* for secondary emphasis

- Bullet point
- Another point

[Link text](https://example.com)
```

---

### For Story Galleries (`story_galleries`)

**Status values:** `draft`, `published`, `archived`

**Workflow:**
1. Create gallery as `draft`
2. Fill in:
   - `slug` — URL-friendly (e.g., "classroom-moments-april-2026")
   - `title` — Gallery title
   - `excerpt` — Context/intro text
   - `story_date` — When photos were taken
   - `cover_image_path` — First image
   - `layout_style` — How to display (editorial/mosaic/stacked)
3. Save gallery
4. Then create `story_gallery_items` rows:
   - Link to parent gallery
   - Add image_path for each photo
   - Add caption for each photo
   - Set sort_order to control display sequence
5. Change gallery status to `published`
6. Gallery appears on `/stories` page with photo carousel

**Approval checklist:**
- [ ] All images are high quality
- [ ] Photos are relevant to foundation mission
- [ ] Captions are descriptive (2-3 sentences)
- [ ] Photos are in correct order (sort_order)
- [ ] Consent obtained from subjects (if identifiable)
- [ ] Gallery title is descriptive

---

### For Community Voices (`voice_submissions`)

**Status values:** `pending`, `approved`, `rejected`

**Workflow:**
1. Public submits voice through form on website
2. Row appears in `voice_submissions` table with status `pending`
3. Admin reviews submission:
   - Is quote authentic and relevant?
   - Does submitter give permission to publish?
   - Is quote positive/constructive?
4. If approved: change status to `approved` → appears on `/stories` page
5. If rejected: change status to `rejected` → remains in database but not visible

**Approval checklist:**
- [ ] Quote is genuine and from real person
- [ ] Quote is relevant to foundation work
- [ ] Quote reflects community voice (not promotional)
- [ ] Permission confirmed (internal note)
- [ ] Role/title is accurate
- [ ] Location information is appropriate to share

---

## 5. Managing Submissions

### Donation Inquiries (`donation_intents`)

These are created when someone submits the `/donate` form.

**Fields:**
- `reference_code` — Unique tracking ID (auto-generated)
- `donor_name`, `donor_email`, `donor_phone` — Contact info
- `amount`, `currency` — Donation amount
- `fund_id` — Which fund they're supporting
- `status` — new/contacted/pledged/paid/cancelled

**Workflow:**
1. New submissions arrive with status `new`
2. Donor Relations team reviews:
   - Verify donor contact info is correct
   - Determine if this is one-time or recurring
3. Change status to `contacted` once you reach out
4. Track status through to `paid` or `cancelled`

**Note:** Don't delete submissions. They're important for audit and follow-up.

---

### Contact Submissions (`contact_submissions`)

General inquiries from `/contact` form.

**Fields:**
- `first_name`, `last_name`, `email`, `phone` — Contact info
- `interest` — What they're inquiring about
- `message` — Their message
- `status` — new/reviewed/responded/archived

**Workflow:**
1. New submissions arrive with status `new`
2. Relevant team member reviews and responds
3. Change status to `responded` after you reply
4. Archive after 30 days: change status to `archived`

---

### Involvement/Partnership Inquiries (`involvement_leads`)

Volunteers, sponsors, partners submit through `/get-involved` form.

**Fields:**
- `interest_type` — donate/volunteer/partner/sponsor/in_kind/media/other
- `organization_name` — If representing an organization
- `contact_name`, `email`, `phone` — Contact info
- `location`, `support_area`, `budget_range` — Context
- `status` — new/contacted/qualified/in_progress/closed

**Workflow:**
1. New inquiries arrive with status `new`
2. Review and qualify:
   - Does this align with mission?
   - Is capacity available?
   - Can we respond meaningfully?
3. Change status to `contacted` when you reach out
4. Update to `qualified` if they're serious
5. Track through `in_progress` as you develop partnership
6. Close with `closed` when relationship is established or declined

---

## 6. Permissions Summary

### Public Users (not logged in)
- Read: published blog posts, scheduled events, featured metrics
- Write: contact form, donation form, involvement form (via API only)

### Editors (authenticated)
- Read: all content tables
- Write: content tables only (events, metrics, stories, galleries)
- Cannot: delete, see submissions, see user data

### Admins (authenticated)
- Read: all tables
- Write: all tables
- Responsibilities: User management, review submissions, final approval

---

## 7. Common Tasks in Supabase Studio

### To Add a New Event

1. Open table: `program_events`
2. Click **"Insert"** → **"Insert Row"**
3. Fill fields:
   - `slug`: "event-title-here" (lowercase, hyphens)
   - `title`: Full event name
   - `program_type`: education/healthcare/sports/community
   - `summary`: 1-2 sentence description
   - `description`: Longer description (same as summary for now)
   - `location`: City and venue
   - `start_date`: Date in format "2026-04-20 09:00:00+00:00"
   - `is_featured`: true or false
   - `status`: "draft" initially
4. Click **"Save"**
5. Review on website (it won't show until status is "scheduled")
6. Come back and change `status` to "scheduled" to publish

### To Edit an Event

1. Open table: `program_events`
2. Find event in list (use search at top)
3. Click row to open detail view
4. Edit any field
5. Click **"Save"**
6. Changes appear on website immediately

### To Delete Content

1. Open table
2. Find row
3. Click **"..."** menu → **"Delete row"**
4. Confirm deletion

Note: Deleting is permanent. Archive instead when possible (set status to "archived" if supported).

---

## 8. Troubleshooting

**Q: I can see a table but can't edit it**
A: RLS policies may not be applied yet. Ask admin to run the RLS policy SQL.

**Q: I submitted a donation but don't see it**
A: Donations appear in `donation_intents`. They might still be in review. Check with admin.

**Q: A story I published isn't showing on the website**
A: Make sure status is "published" (not "draft"). If published, wait 60 seconds for cache to clear.

**Q: I need to add a new team member**
A: Ask an admin to invite them (Supabase Dashboard → Authentication → Users → Invite).

**Q: Can I undo a deletion?**
A: Once deleted, it's gone. Supabase has no undo (yet). Be careful with delete button.

---

## 9. Next Steps

1. **Admin runs RLS setup** — Execute `docs/admin/rls-policies.sql`
2. **Team members invited** — Ask admin to create accounts for editors
3. **Try it out** — Add a test event, verify it appears on `/programs`
4. **Feedback** — Let us know what's missing or confusing
5. **Iterate** — RLS policies can be updated if roles need adjustment

---

## 10. Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Studio Guide](https://supabase.com/docs/guides/database)
- [Row-Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- This foundation's [Phased Roadmap](../phased-roadmap.md)

---

**Questions?** Contact the development team or refer to this guide.
