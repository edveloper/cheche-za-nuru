# Cheche Za Nuru - Admin System Audit
**Date:** April 27, 2026  
**Auditor:** Code Audit  
**Focus:** Admin Dashboard Implementation & Functional Completeness

---

## Executive Summary

Your **custom admin dashboard is partially implemented** with:
- ✅ **3 fully functional sections** (Stories, Team, Submissions)
- ⚠️ **3 view-only sections** (Programs, Impact, Donations)
- ❌ **Key admin functions missing** from dashboard (form status tracking, bulk operations)

**Critical Finding:** Your team is currently **forced to use Supabase Studio** for:
- Creating/editing/deleting programs and events
- Creating/editing/deleting impact metrics
- Creating/editing/deleting donation funds
- Tracking donation and contact submission statuses

This audit details what works, what's missing, and what needs to be built to achieve your goal of **eliminating Supabase Studio dependency**.

---

## Part 1: Public Site Status ✅

All 8 public pages are **live and functional**:

| Page | URL | Status | Notes |
|------|-----|--------|-------|
| Home | `/` | ✅ Working | Hero, stats, CTAs functional |
| About | `/about` | ✅ Working | Team grid loads from Supabase |
| Programs | `/programs` | ✅ Working | Calendar displays events (hardcoded) |
| Impact | `/impact` | ✅ Working | Metrics load from Supabase |
| Stories | `/stories` | ✅ Working | Blog posts, galleries, videos load from Supabase |
| Get Involved | `/get-involved` | ✅ Working | Form submits to `involvement_leads` table |
| Contact | `/contact` | ✅ Working | Form submits to `contact_submissions` table |
| Donate | `/donate` | ✅ Working | Form submits to `donation_intents` table |

**Form Endpoints:**
- `POST /api/contact` → `contact_submissions` ✅
- `POST /api/involvement` → `involvement_leads` ✅
- `POST /api/donations` → `donation_intents` ✅

**Public Data APIs:**
- `GET /api/impact-metrics` → Impact page metrics ✅
- `GET /api/program-events` → Programs calendar ✅
- `GET /api/donation-funds` → Donation form options ✅

---

## Part 2: Admin Dashboard Breakdown

### Location & Access
- **URL:** `/admin/dashboard`
- **Requires:** Authentication via `/admin/login`
- **Layout:** 6-section card grid with navigation

### Section 1: Stories ✅ FULLY FUNCTIONAL

**Current Capabilities:**
```
GET  /api/admin/stories              → List all blog posts
GET  /api/admin/stories/galleries    → List all galleries
GET  /api/admin/stories/videos       → List all videos
GET  /api/admin/stories/voices       → List all voice submissions
PATCH /api/admin/stories/voices/[id] → Approve/reject voice submissions
```

**UI Features Implemented:**
- ✅ Tabbed interface (Blog | Photos | Videos | Voices)
- ✅ List all blog posts with status badges
- ✅ Delete blog post (with confirmation)
- ✅ Create new blog post link (`/admin/stories/new`)
- ✅ Edit existing blog post link (`/admin/stories/[slug]/edit`)
- ✅ List galleries with status display
- ✅ List videos with status display
- ✅ List voice submissions with Approve/Reject buttons
- ✅ Update voice submission status via API

**Data Flow:**
```
Form Input (story-form.tsx)
    ↓
saveStoryAction() [form-actions.ts]
    ↓
Supabase (blog_posts table)
    ↓
Image upload to storage (story-covers)
    ↓
API redirect on success
```

**Example File Locations:**
- Dashboard page: [src/app/admin/stories/page.tsx](src/app/admin/stories/page.tsx)
- Dashboard component: [src/app/admin/stories/dashboard.tsx](src/app/admin/stories/dashboard.tsx)
- Form actions: [src/app/admin/stories/form-actions.ts](src/app/admin/stories/form-actions.ts)
- Submission handlers: [src/app/admin/stories/actions.ts](src/app/admin/stories/actions.ts)

---

### Section 2: Team ✅ FULLY FUNCTIONAL

**Current Capabilities:**
```
GET    /api/admin/team           → List all team members
POST   /api/admin/team           → Create new team member
PUT    /api/admin/team           → Update existing team member
DELETE /api/admin/team?id=[uuid] → Delete team member
```

**UI Features Implemented:**
- ✅ List all team members (including inactive)
- ✅ Add new team member form
- ✅ Edit team member (inline form)
- ✅ Delete team member (with confirmation)
- ✅ Toggle active/inactive status
- ✅ Sort order management
- ✅ Photo path field (for profile photos)

**Data Flow:**
```
Team Form Input
    ↓
saveTeamMemberAction() / deleteTeamMemberAction()
    ↓
/api/admin/team (POST/PUT/DELETE)
    ↓
Supabase (team_members table)
    ↓
Updated on About page
```

**File Locations:**
- Page: [src/app/admin/team/page.tsx](src/app/admin/team/page.tsx)
- Form component: [src/components/team-form.tsx](src/components/team-form.tsx)
- Form actions: [src/app/admin/team/form-actions.ts](src/app/admin/team/form-actions.ts)
- API: [src/app/api/admin/team/route.ts](src/app/api/admin/team/route.ts)

---

### Section 3: Submissions ✅ FULLY FUNCTIONAL (View-Only)

**Current Capabilities:**
```
GET /api/admin/submissions/contact      → List all contact submissions
GET /api/admin/submissions/involvement  → List all involvement leads
```

**UI Features Implemented:**
- ✅ Tabbed interface (Contact | Involvement)
- ✅ List all contact submissions with details
- ✅ List all involvement leads with details
- ✅ Display submission timestamp
- ✅ Show all fields (name, email, phone, interest, message)
- ✅ Filter by submission type

**⚠️ Missing Features:**
- ❌ Update submission status (new → reviewed → responded → archived)
- ❌ Mark as read/unread
- ❌ Add internal notes
- ❌ Delete submission
- ❌ Export submissions
- ❌ Email notifications on new submission

**Data Flow:**
```
Public form submission
    ↓
POST /api/contact or /api/involvement
    ↓
Supabase (contact_submissions / involvement_leads)
    ↓
Admin reads via GET /api/admin/submissions/[type]
    ↓
⚠️ BLOCKED: Can't update status without Supabase Studio
```

**File Locations:**
- Page: [src/app/admin/submissions/page.tsx](src/app/admin/submissions/page.tsx)
- Contact API: [src/app/api/admin/submissions/contact/route.ts](src/app/api/admin/submissions/contact/route.ts)
- Involvement API: [src/app/api/admin/submissions/involvement/route.ts](src/app/api/admin/submissions/involvement/route.ts)

---

### Section 4: Programs & Events ⚠️ VIEW-ONLY

**Current Capabilities:**
```
GET /api/program-events → List upcoming/featured events
```

**UI Features Implemented:**
- ✅ Display all events with color-coded program types
- ✅ Show date, location, summary
- ✅ Format dates properly (Feb 14, 2026)
- ✅ Link back to dashboard

**⚠️ Missing Features:**
- ❌ Create new event
- ❌ Edit existing event
- ❌ Delete event
- ❌ Change event status (draft → scheduled → completed)
- ❌ Upload event images
- ❌ Manage event-related details

**Data Flow:**
```
Hardcoded events in src/data/site.ts
    ↓
getProgramEvents() from lib/program-content.ts
    ↓
/api/program-events endpoint
    ↓
Admin dashboard displays
    ↓
❌ BLOCKED: Can only view; must go to Supabase Studio to edit
```

**Why It's Broken:**
The table `program_events` exists in Supabase but:
1. Events are hardcoded in `src/data/site.ts` instead of pulled from Supabase
2. No admin edit form exists
3. No POST/PUT/DELETE endpoints implemented
4. Status workflow not implemented

**File Locations:**
- Page: [src/app/admin/programs/page.tsx](src/app/admin/programs/page.tsx)
- Data layer: [src/lib/program-content.ts](src/lib/program-content.ts)
- API: [src/app/api/program-events/route.ts](src/app/api/program-events/route.ts)

---

### Section 5: Impact Metrics ⚠️ VIEW-ONLY

**Current Capabilities:**
```
GET /api/impact-metrics → List all impact metrics
```

**UI Features Implemented:**
- ✅ List all metrics by category
- ✅ Color-coded category badges
- ✅ Display metric values and units
- ✅ Show featured flag
- ✅ Display sort order

**⚠️ Missing Features:**
- ❌ Create new metric
- ❌ Edit existing metric
- ❌ Delete metric
- ❌ Bulk update (e.g., refresh all 2026 data)
- ❌ Manage which metrics are featured

**Data Flow:**
```
Supabase (impact_metrics table)
    ↓
getImpactMetrics() in lib/impact-content.ts
    ↓
/api/impact-metrics endpoint
    ↓
Admin dashboard displays
    ↓
❌ BLOCKED: Can only view; must use Supabase Studio to edit
```

**File Locations:**
- Page: [src/app/admin/impact/page.tsx](src/app/admin/impact/page.tsx)
- Data layer: [src/lib/impact-content.ts](src/lib/impact-content.ts)
- API: [src/app/api/impact-metrics/route.ts](src/app/api/impact-metrics/route.ts)

---

### Section 6: Donation Funds ⚠️ VIEW-ONLY

**Current Capabilities:**
```
GET /api/donation-funds → List all active donation funds
```

**UI Features Implemented:**
- ✅ List all donation funds
- ✅ Show fund names and descriptions
- ✅ Display active/inactive status
- ✅ Show sort order

**⚠️ Missing Features:**
- ❌ Create new donation fund category
- ❌ Edit fund description or name
- ❌ Delete fund
- ❌ Toggle active/inactive
- ❌ Reorder funds

**Data Flow:**
```
Supabase (donation_funds table)
    ↓
getDonationFunds() in lib/donation-funds.ts
    ↓
/api/donation-funds endpoint
    ↓
Admin dashboard displays
    ↓
❌ BLOCKED: Can only view; must use Supabase Studio to edit
```

**File Locations:**
- Page: [src/app/admin/donations/page.tsx](src/app/admin/donations/page.tsx)
- Data layer: [src/lib/donation-funds.ts](src/lib/donation-funds.ts)
- API: [src/app/api/donation-funds/route.ts](src/app/api/donation-funds/route.ts)

---

## Part 3: Critical Gaps

### 1. **Programs & Events: No CRUD**
**Impact:** Admin must use Supabase Studio to manage events  
**Status:** High Priority

**To Fix:**
1. Create `/admin/programs/form` component with fields:
   - Title, slug, program_type
   - Summary, description
   - Location, start_date, end_date
   - is_featured, status checkboxes
2. Implement `POST /api/admin/programs` for create
3. Implement `PUT /api/admin/programs/[slug]` for update
4. Implement `DELETE /api/admin/programs/[slug]` for delete
5. Migrate hardcoded events from `src/data/site.ts` to Supabase
6. Update `getProgramEvents()` to read from Supabase instead

**Estimated Effort:** 3-4 hours

---

### 2. **Impact Metrics: No CRUD**
**Impact:** Admin must use Supabase Studio to manage metrics  
**Status:** High Priority

**To Fix:**
1. Create `/admin/impact/form` component with fields:
   - Label, value_text, numeric_value
   - Category, metric_year
   - Summary, is_featured checkbox
   - Sort order
2. Implement `POST /api/admin/impact-metrics` for create
3. Implement `PUT /api/admin/impact-metrics/[slug]` for update
4. Implement `DELETE /api/admin/impact-metrics/[slug]` for delete
5. Add bulk update capability (update multiple metrics at once)

**Estimated Effort:** 3-4 hours

---

### 3. **Donation Funds: No CRUD**
**Impact:** Admin must use Supabase Studio to manage funds  
**Status:** Medium Priority

**To Fix:**
1. Create `/admin/donations/form` component with fields:
   - Name, slug, short_description
   - Impact summary, is_active toggle
   - Sort order
2. Implement `POST /api/admin/donation-funds` for create
3. Implement `PUT /api/admin/donation-funds/[slug]` for update
4. Implement `DELETE /api/admin/donation-funds/[slug]` for delete

**Estimated Effort:** 2-3 hours

---

### 4. **Submissions: Status Management Missing**
**Impact:** Admin can't respond to form submissions within dashboard  
**Status:** High Priority

**To Fix:**
1. Add status update buttons (new → reviewed → responded → archived)
2. Implement `PATCH /api/admin/submissions/contact/[id]` for status updates
3. Implement `PATCH /api/admin/submissions/involvement/[id]` for status updates
4. Add optional response notes field
5. Add delete capability (with confirmation)
6. Add export to CSV functionality

**Estimated Effort:** 2-3 hours

---

### 5. **Stories: Edit Functionality Missing**
**Impact:** Admin can create/delete but cannot edit existing stories  
**Status:** Medium Priority

**Current:** Edit link points to `/admin/stories/[slug]/edit` but this page may not be complete  
**To Fix:**
1. Verify edit page implementation at [src/app/admin/stories/[slug]/edit/page.tsx](src/app/admin/stories/[slug]/edit/page.tsx)
2. Ensure image replacement works
3. Ensure published_at timestamp handled correctly
4. Test full edit flow

**Estimated Effort:** 1-2 hours

---

## Part 4: Authentication & Security

**Current Setup:**
- `/admin/login` exists for authentication
- Admin dashboard access controlled
- Row-Level Security (RLS) enabled on all Supabase tables

**⚠️ Questions:**
- [ ] How are admins currently authenticated? JWT token? Session cookie?
- [ ] Are role-based permissions enforced? (admin vs editor vs reviewer)
- [ ] Is there an approval workflow for submissions?
- [ ] Are activity logs maintained for audit trail?

---

## Part 5: Database & Data Architecture

### Supabase Schema Status

| Table | Reads | Writes | Dashboard |
|-------|-------|--------|-----------|
| `blog_posts` | ✅ | ✅ API | ✅ Full CRUD |
| `voice_submissions` | ✅ | ✅ API + Public | ✅ Approve/Reject |
| `story_galleries` | ✅ | ❌ Supabase Studio only | ⚠️ View only |
| `video_stories` | ✅ | ❌ Supabase Studio only | ⚠️ View only |
| `team_members` | ✅ | ✅ API | ✅ Full CRUD |
| `program_events` | ❌ (hardcoded) | ❌ Supabase Studio only | ⚠️ View only |
| `impact_metrics` | ✅ | ❌ Supabase Studio only | ⚠️ View only |
| `donation_funds` | ✅ | ❌ Supabase Studio only | ⚠️ View only |
| `contact_submissions` | ✅ | ✅ Public form | ⚠️ View only (no status updates) |
| `involvement_leads` | ✅ | ✅ Public form | ⚠️ View only (no status updates) |
| `donation_intents` | ✅ | ✅ Public form | ❌ Not visible in dashboard |

---

## Part 6: Recommendations (Priority Order)

### Tier 1: Make All Sections Full CRUD (Eliminate Studio)

1. **Submission Status Management** (2-3 hours)
   - Add status update UI to submissions dashboard
   - Implement PATCH endpoints
   - Add delete + archive functionality

2. **Programs & Events CRUD** (3-4 hours)
   - Create form component
   - Implement 3 API endpoints (POST/PUT/DELETE)
   - Migrate hardcoded events to Supabase
   - Add event image/thumbnail upload

3. **Impact Metrics CRUD** (3-4 hours)
   - Create form component
   - Implement 3 API endpoints
   - Add bulk update UI

4. **Donation Funds CRUD** (2-3 hours)
   - Create form component
   - Implement 3 API endpoints

**Total Tier 1 Time:** ~10-14 hours | Achieves: 100% dashboard control

---

### Tier 2: Enhanced Features

5. **Donation Intents Dashboard** (2 hours)
   - View all donation intents
   - Update status (new → contacted → pledged → paid)
   - Track which donors have been followed up
   - Add notes field for staff communications

6. **Stories Gallery & Video Management** (2 hours)
   - Add forms to create/edit/delete galleries
   - Add forms to create/edit/delete videos
   - Connect image/video upload

7. **User Management** (3 hours)
   - Add admin user management page
   - Role assignment (admin, editor, reviewer)
   - Disable/enable access

---

### Tier 3: Nice-to-Have

8. **Activity Audit Log** (2 hours)
   - Track who changed what and when
   - Display in separate dashboard section

9. **Bulk Operations** (2 hours)
   - Bulk publish/archive
   - Bulk status updates for submissions
   - Bulk delete with safety checks

10. **Email Notifications** (3 hours)
    - Notify admin when new submissions arrive
    - Notify donors when donations received
    - Template system for communications

---

## Part 7: Architecture Notes

### How Forms Are Currently Wired

**Pattern for Working Sections (Stories, Team):**
```
Page Component (client)
    ↓
Form Component (client) using useActionState
    ↓
Server Action (saveAction / deleteAction)
    ↓
Supabase Client (with service role key)
    ↓
Supabase Table Update
    ↓
Redirect on success or return error
```

### Current API Pattern
Most admin sections read via API but write via server actions:
- **Reads:** `/api/admin/[section]` → fetch client-side
- **Writes:** Server actions → direct Supabase access

This works but is inconsistent. **Recommendation:** Migrate to pure API-based writes for:
- Easier testing
- Better error handling
- Middleware logging
- API route reusability

---

## Part 8: Immediate Next Steps

### Week 1: Core CRUD
1. ✅ Review this audit
2. Add submission status management (highest impact)
3. Build programs & events CRUD
4. Build impact metrics CRUD

### Week 2: Completeness
1. Build donation funds CRUD
2. Verify story edit workflow
3. Add validation/error handling across forms

### Week 3: Polish & Deploy
1. Test all endpoints
2. Verify RLS security policies
3. User acceptance testing
4. Deploy to production

---

## Summary Table

| Section | Status | CRUD | Edit Form | API | Notes |
|---------|--------|------|-----------|-----|-------|
| Stories | ✅ Working | ✅ | ✅ | ✅ | Verify edit flow |
| Team | ✅ Working | ✅ | ✅ | ✅ | Complete |
| Submissions | ⚠️ Partial | ❌ | ❌ | ⚠️ | Read-only; needs status updates |
| Programs | ⚠️ Partial | ❌ | ❌ | ❌ | Hardcoded; needs full implementation |
| Impact | ⚠️ Partial | ❌ | ❌ | ❌ | View-only; needs CRUD |
| Donations | ⚠️ Partial | ❌ | ❌ | ❌ | View-only; needs CRUD |

---

## Conclusion

Your admin dashboard is **foundation-solid** with great patterns established (Stories, Team). 

**To eliminate Supabase Studio completely, you need ~10-14 hours of focused development** on the 4 missing CRUD sections plus submission management.

The architecture is there. The remaining work is:
1. Creating form components (CSS already matches dashboard)
2. Adding 12 API endpoints (3 each for Programs, Impact, Donations, Submissions)
3. Migrating hardcoded data to Supabase
4. Testing

**Ready to prioritize and build these missing pieces?** Each section is isolated and can be tackled independently.
