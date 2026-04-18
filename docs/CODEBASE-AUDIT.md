# Cheche Za Nuru Codebase Audit Report
**Date:** April 16, 2026  
**Status:** Phases 1-4 Complete | Phase 5 Next

---

## Executive Summary

The Cheche Za Nuru website is **well-structured and progressing as planned**. Phases 1-4 are fully complete with:
- ✅ Brand and visual layer fixed with real logo
- ✅ Image architecture refactored with intentional primitives
- ✅ Public conversion flows (donate, get-involved, contact) working
- ✅ Stories platform connected to Supabase with fallback handling

The next phase (Phase 5: Programs and events) requires moving hardcoded event data from `src/data/site.ts` to the `program_events` Supabase table. The groundwork is already in place—only the migration remains.

---

## Phase-by-Phase Assessment

### Phase 1: Brand and Media Foundation ✅ COMPLETE

**Goal:** Fix visual and asset layer  
**Status:** All exit criteria met

**Completed work:**
- Real logo (`/logo/czn-logo.png`) deployed in header and footer via `site-header.tsx` and `site-footer.tsx`
- All pages have distinct, intentionally chosen banner images (not repetitive placeholders)
- Image library in `src/data/site.ts` consolidates all asset references
- Hero stats and visual hierarchy established on home page

**Evidence:**
- `src/components/site-header.tsx` references `brandAssets.logo`
- `src/data/site.ts` defines `pageVisuals` with unique images per page
- No complaints about placeholder images in the roadmap notes

**Exit criteria:**
- ✅ Real logo is live in header and footer
- ✅ Each page uses intentionally chosen images
- ✅ Asset usage is no longer placeholder-driven

---

### Phase 2: Image Architecture Refactor ✅ COMPLETE

**Goal:** Replace parallax-as-default with separate rendering paths  
**Status:** All exit criteria met

**Completed work:**
- `ParallaxImage` component phased out as default wrapper
- New image primitives introduced:
  - `ContentImage` — static, responsive images for sections
  - `HeroImage` — dedicated hero motion component (home page only)
  - Gallery and editorial images use simpler static rendering
- Motion isolated to a single high-value placement (home hero)
- Global parallax styling (`parallax-frame`, `parallax-image`) minimized

**Evidence:**
- `/programs/page.tsx` uses `ContentImage` instead of parallax
- `/stories/page.tsx` uses `ContentImage` for banners
- `/impact/page.tsx` uses `ContentImage` for banners
- Home page explicitly imports `HeroImage` component

**Exit criteria:**
- ✅ Parallax isolated to one or two intentional placements
- ✅ Image rendering is consistent without relying on same effect everywhere
- ✅ Site feels calmer and more deliberate

---

### Phase 3: Public Conversion Flows ✅ COMPLETE

**Goal:** Turn contact-first setup into proper supporter intake flows  
**Status:** All exit criteria met

**Completed work:**
1. **Donation flow:**
   - Dedicated `/donate` route exists (`src/app/donate/page.tsx`)
   - `src/components/donation-form.tsx` submits to `/api/donations`
   - Donation funds read from Supabase `donation_funds` table via `src/lib/donation-funds.ts`
   - Fallback set defined in `donation-funds.ts` when no live records exist
   - API validates and inserts into `donation_intents` table

2. **Get Involved flow:**
   - Dedicated `/get-involved` route exists (`src/app/get-involved/page.tsx`)
   - `src/components/involvement-form.tsx` submits to `/api/involvement`
   - Submits structured leads into `involvement_leads` table
   - Supports volunteer, partner, sponsor, in-kind, media, other

3. **Contact preserved:**
   - `/contact` page still available for general enquiries
   - No longer overloaded with donation CTAs
   - `/api/contact` submits to `contact_submissions`

4. **Form security:**
   - Honeypot protection implemented
   - Server-side validation on all forms
   - Reference codes generated for tracking

**Evidence:**
- `/api/contact/route.ts`, `/api/donations/route.ts`, `/api/involvement/route.ts` all exist
- `src/lib/donation-funds.ts` handles Supabase reads with fallback
- Supabase REST client has "contact_submissions", "donation_intents", "involvement_leads" in insert whitelist

**Exit criteria:**
- ✅ Donation CTA goes to real donation flow
- ✅ Get involved submissions go into `involvement_leads`
- ✅ Contact page no longer overloaded with unrelated intents

---

### Phase 4: Stories Platform ✅ COMPLETE

**Goal:** Replace static stories page with real storytelling system  
**Status:** All exit criteria met

**Completed work:**
1. **Data layer:**
   - `src/lib/story-content.ts` handles fetching from Supabase:
     - `getStoryPosts()` — reads from `blog_posts` table
     - `getVoiceSnippets()` — reads from `voice_submissions` table
     - `getStoryGalleries()` — reads from `story_galleries` table
     - `getVideoStories()` — reads from `video_stories` table
   - All functions fall back to hardcoded fallbacks when Supabase unavailable

2. **Public routes:**
   - `/stories` displays posts, voices, galleries, videos from Supabase
   - `/stories/[slug]` shows individual blog post detail
   - `/stories/galleries/[slug]` shows gallery detail view
   - Type-safe data models defined (StoryPost, VoiceSnippet, etc.)

3. **Content structure:**
   - Blog posts include title, excerpt, body, cover image, author, status, published_at
   - Gallery support with images, captions, layout styles (editorial, mosaic, stacked)
   - Video stories with title, summary, video path, thumbnail, duration
   - Moderation-ready status field (draft, published, archived)

**Evidence:**
- `src/app/stories/page.tsx` calls async data functions
- `src/app/stories/[slug]/page.tsx` loads individual post
- `src/app/stories/galleries/[slug]/page.tsx` loads gallery details
- Supabase REST client includes all story tables in read whitelist

**Exit criteria:**
- ✅ `/stories` backed by real data
- ✅ Detail routes exist for posts and galleries
- ✅ Moderation-ready content flow with status field

---

## Phases 5-8: Implementation Roadmap

### Phase 5: Programs and Events 🔄 NEXT

**Goal:** Turn programs page into updateable program and event surface  
**Current Status:** Not yet started  
**Timeline:** Ready to begin immediately

**What's already in place:**
- `program_events` Supabase table fully defined (slug, title, program_type, summary, location, start_date, end_date, is_featured, status)
- 5 hardcoded events in `src/data/site.ts` ready to migrate
- Programs page (`/programs/page.tsx`) imports `programEvents` from site.ts
- `ProgramsCalendar` component ready to accept live event data

**What needs to be done:**
1. Create `src/lib/program-content.ts` with function to fetch events from `program_events` table
   - Include fallback to hardcoded events from site.ts
   - Filter by `is_featured`, `status='scheduled'`, and date range
   - Return upcoming and featured events

2. Update Supabase REST whitelist to include `program_events` in ReadTableName

3. Update `/programs/page.tsx` to call async data fetching
   - Fetch events at build/request time
   - Pass to ProgramsCalendar component

4. Optionally add `/programs/[slug]` route for event detail pages
   - Check if foundation needs public event pages

5. Seed 5 events into Supabase Studio from hardcoded array in site.ts

**Hardcoded events to migrate:**
- Scholarship Mentorship Forum (Feb 14, Education, Nairobi)
- Community Health Outreach Day (Feb 21, Healthcare, Kajiado)
- Rising Stars League Opening Weekend (Mar 7, Sports, Nairobi)
- School Supply Distribution Drive (Mar 18, Education, Machakos)
- Maternal and Child Wellness Clinic (Apr 9, Healthcare, Kibera)
- Youth Talent Showcase (Apr 25, Sports, Nairobi)

**Exit criteria:**
- Programs page no longer relies on hardcoded event arrays
- Event publishing possible through Supabase Studio
- Fallback handles when no live events exist

---

### Phase 6: Impact Publishing

**Goal:** Make impact page credible, sourced, and maintainable  
**Current Status:** Not yet started  
**Timeline:** After Phase 5 complete

**What's already in place:**
- `impact_metrics` table defined
- `impact_context_stats` table defined
- 4 hardcoded impact metrics in site.ts
- Complex impact data (domain views, county pressure, comparisons) in site.ts
- Impact page (`/impact/page.tsx`) imports all data from site.ts

**What needs to be done:**
1. Create `src/lib/impact-content.ts` with functions to fetch:
   - Featured metrics from `impact_metrics`
   - Context stats from `impact_context_stats`
   - With fallbacks to hardcoded data

2. Update `/impact/page.tsx` to fetch live data

3. Decide on handling complex aggregated views:
   - Domain views (education/health/youth) — could stay in code or migrate to a new table
   - County pressure data — could stay in code or migrate
   - Response comparisons — could stay in code or be generated dynamically

4. Seed initial data into Supabase

**Hardcoded metrics to migrate:**
- 2,400+ children directly supported
- 580 scholarships awarded
- 12,000+ health consultations given
- 320 athletes in active leagues

**Hardcoded context stats to migrate:**
- Kenya poverty rate (42.4%)
- Out-of-school children (2.5M)
- Child stunting (18%)
- Youth outside learning/work (~20%)

**Exit criteria:**
- Impact page driven by structured data
- Metric updates no longer require code edits
- Source-backed content easily reviewable before publish

---

### Phase 7: Admin and Workflow Layer

**Goal:** Make platform manageable without premature custom admin work  
**Current Status:** Foundation ready  
**Timeline:** After data migrations complete

**What's already in place:**
- Supabase Studio available as default admin layer
- All tables properly structured with status, created_at, updated_at fields
- Role-based permissions can be configured in Supabase

**What needs to be done:**
1. Set up Supabase Studio with proper:
   - User roles and permissions
   - Publishing workflows (draft → published → archived)
   - Content moderation checklists for stories, events, metrics

2. Define clear content management checklists:
   - Event publishing requirements
   - Story moderation workflow
   - Impact metric sourcing and review process

3. Only build custom admin UI if Supabase Studio becomes friction point
   - Likely triggers: gallery ordering, preview needs, moderation volume, repetitive editing

**Exit criteria:**
- Team can manage content and submissions reliably
- Custom dashboard work justified by real pain (not anticipation)

---

### Phase 8: Hardening and Launch Readiness

**Goal:** Prepare site for sustained public use  
**Current Status:** Foundation ready  
**Timeline:** Final phase before public launch

**What needs to be done:**
1. **Validation and anti-spam:**
   - Review all form validation rules
   - Strengthen honeypot implementation
   - Add rate limiting if needed
   - Test spam/bot scenarios

2. **Observability:**
   - Add success/error logging for public forms
   - Track submission rates and common errors
   - Monitor Supabase query performance

3. **Empty states:**
   - Handle zero events gracefully
   - Handle zero stories gracefully
   - Handle data loading failures
   - Add fallback messages

4. **Accessibility review:**
   - Forms navigation and focus management
   - Image alt text completeness
   - Motion/animation accessibility
   - Color contrast compliance
   - Screen reader testing

5. **Documentation:**
   - Replace default Next.js README
   - Document project structure and conventions
   - Add deployment and environment setup guide
   - Document Supabase schema and relationships

**Exit criteria:**
- Site has clear failure handling
- Content and submission flows supportable
- Documentation matches actual project

---

## Code Quality Assessment

### Strengths ✅
- Well-organized component structure (`src/components/`)
- Clear separation of concerns (data layer, API routes, pages)
- Type-safe data models for complex types
- Proper use of async/await for server-side data fetching
- Fallback patterns for Supabase unavailability
- Centralized configuration in `src/data/site.ts`
- Honeypot protection on forms
- Server-side validation on all submissions

### Areas for Attention
- `src/data/site.ts` is becoming large (800+ lines) — consider splitting by domain once Phase 5-6 complete
- Some hardcoded event/metric data still in site.ts — plan gradual migration to Supabase as phases complete
- Error handling in story content could be more explicit
- No explicit logging/observability for form submissions yet

### Tech Stack
- **Framework:** Next.js 16.2.3
- **React:** 19.2.4
- **Styling:** Tailwind CSS 4
- **Database:** Supabase (PostgRES)
- **Form handling:** Server actions with validation
- **Image handling:** Next.js `<Image>` component with optimized loading

---

## Deployment & Environment

**Current setup:**
- Environment variables for Supabase:
  - `NEXT_PUBLIC_SUPABASE_URL` (public)
  - `SUPABASE_SERVICE_ROLE_KEY` (private, server-only)
- Forms work even without Supabase configured (validation layer)
- All data reads include fallbacks for dev/offline scenarios

**Ready for:**
- Vercel deployment
- GitHub-based CI/CD
- Environment-based config switching

---

## Recommended Next Actions (Immediate)

### Week 1: Phase 5 Migration
1. Create `src/lib/program-content.ts` with event fetching logic
2. Populate initial events into Supabase `program_events` table
3. Update `/programs/page.tsx` to use live data
4. Test fallback behavior when Supabase empty
5. Deploy and verify calendar updates in real-time

### Week 2: Phase 5 Polish
1. Add optional event detail routes at `/programs/[slug]` if needed
2. Test event filtering (featured, upcoming, past)
3. Update roadmap with Phase 5 completion notes

### Week 3-4: Phase 6 Planning
1. Audit impact metrics for accuracy and sourcing
2. Plan context stats consolidation (keep vs. migrate)
3. Prepare impact-content.ts implementation

---

## Summary Table

| Phase | Goal | Status | Key Work | Start Blocker |
|-------|------|--------|----------|---------------|
| 1 | Brand & Media | ✅ Complete | Brand, images | None |
| 2 | Image Architecture | ✅ Complete | Refactor parallax | None |
| 3 | Conversion Flows | ✅ Complete | Donate, involved, contact | None |
| 4 | Stories Platform | ✅ Complete | Blog, gallery, video support | None |
| 5 | Programs & Events | 🔄 Next | Event Supabase migration | Create program-content.ts |
| 6 | Impact Publishing | ⏳ Planned | Metrics Supabase migration | Phase 5 complete |
| 7 | Admin Workflow | ⏳ Planned | Studio config, workflows | Phase 6 complete |
| 8 | Launch Readiness | ⏳ Planned | Hardening, docs, accessibility | Phase 7 complete |

---

## Questions & Decisions Needed

1. **Event detail pages:** Should `/programs/[slug]` exist for individual event detail pages? (Recommended: No, not until demand exists)

2. **Impact data structure:** Should complex aggregated views (domain views, county pressure) stay in code or migrate to Supabase?
   - Option A: Keep in code for stability (recommended for now)
   - Option B: Migrate to Supabase for updateability

3. **Launch timeline:** Target launch date? This affects prioritization of Phase 7-8 work.

4. **Team setup:** Who has Supabase Studio access for content management?

---

**Report prepared by:** Codebase Audit  
**Next review:** After Phase 5 implementation
