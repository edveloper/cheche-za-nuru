# Cheche Za Nuru Phased Roadmap

## Why this roadmap exists

The current codebase is in a hybrid state:

- the public site already has a strong visual shell
- the platform data model exists in `supabase/schema.sql`
- most public content is still hardcoded in `src/data/site.ts`
- only contact and donation intent submissions are wired into Supabase

That means the next work should not be approached as isolated page edits. It should be phased so the brand layer, content layer, data layer, and admin workflow evolve in the right order.

This roadmap replaces ad hoc changes with a sequence that keeps the site usable while moving it from brochure site to operating content platform.

## Current status

- Phase 1 is complete
- Phase 2 is complete
- Phase 3 is complete
- The next implementation stage is Phase 4: Stories platform

## Core decisions for the next phase of work

### 1. Branding should use a real logo asset

The site should stop using the current text badge in the header and move to the actual logo image in `public/logo/czn-logo.png`.

Implication:

- brand treatment needs a small asset pass
- header and footer should support logo image usage cleanly
- logo variants should be planned for light backgrounds, dark backgrounds, and compact mobile layouts

### 2. Images should be managed intentionally

The current image usage is serviceable, but it is still tied to a small set of repeated placeholders referenced from `src/data/site.ts`.

Implication:

- image choices need to be reviewed page by page
- each route should have a clear editorial purpose for its images
- image handling should be separated into content images, hero images, gallery images, and utility brand assets

### 3. Parallax should stop being the default image behavior

The current `ParallaxImage` component is used as a generic image wrapper across the site. That is too broad for the effect and makes image rendering feel overly uniform.

Implication:

- parallax should become an opt-in effect, not the default image primitive
- most page images should likely move to simpler non-parallax components
- only a few high-value placements should keep motion, if any

## Delivery principles

- Finish foundational visual and content architecture work before expanding feature surface area.
- Replace hardcoded marketing content with structured content only when the model and page behavior are ready.
- Build one content domain at a time so each phase ends in a usable state.
- Prefer Studio-first workflows before building custom admin UI.
- Keep public forms simple, safe, and auditable.

## Phase 0: Stabilize direction

Goal:
Create a single agreed implementation path before more feature work lands.

Scope:

- confirm the public voice, audience, and content priorities
- confirm which existing images stay, which are replaced, and which are temporary
- confirm whether parallax is removed completely or retained only in one or two hero placements
- confirm donation flow expectations: enquiry-first, pledge-first, or payment-integrated later
- confirm what "launch-ready" means for the first public release

Deliverables:

- approved roadmap
- approved content priorities
- approved visual correction list

Exit criteria:

- no ambiguity about what gets built first
- no disagreement about brand asset direction

## Phase 1: Brand and media foundation

Goal:
Fix the visual and asset layer before building more platform behavior on top of it.

Status:
Complete

Scope:

- replace the text-based header mark with the actual logo image
- update footer branding to match the logo system
- audit image usage on all routes and assign each image a role
- replace weak or repetitive images with stronger page-specific choices
- define image standards for aspect ratio, crop behavior, alt text, and responsive loading

Required code changes:

- refactor `src/components/site-header.tsx` to render the real logo
- update `src/components/site-footer.tsx` so footer branding matches the new identity
- reduce direct dependence on repeated placeholder image assignments in `src/data/site.ts`
- normalize image usage patterns across home, about, programs, impact, stories, get involved, and contact

Exit criteria:

- real logo is live in header and footer
- each page uses intentionally chosen images
- asset usage is no longer obviously placeholder-driven

## Phase 2: Image architecture refactor

Goal:
Stop treating all images as parallax images and create separate rendering paths based on purpose.

Status:
Complete

Scope:

- replace `ParallaxImage` as the default image wrapper
- introduce clearer image primitives such as:
  - hero image
  - section banner image
  - editorial card image
  - gallery image
  - plain responsive image
- keep motion only where it improves the page instead of flattening every image into the same behavior

Recommended implementation direction:

- convert most existing `ParallaxImage` usage to plain `next/image`
- keep a specialized motion image component only for a small number of intentional placements
- separate image styling concerns from motion concerns

Required code changes:

- audit all usages of `src/components/parallax-image.tsx`
- remove broad styling dependence on `.parallax-frame` and `.parallax-image` in `src/app/globals.css`
- update route components to choose the correct image primitive per placement

Exit criteria:

- parallax is either removed or isolated to a very small set of places
- image rendering is visually consistent without relying on the same motion effect everywhere
- the site feels calmer and more deliberate

Completion notes:

- banner, card, collage, and editorial images now use static image primitives
- the home hero uses a dedicated hero-motion component instead of the old shared parallax wrapper
- image responsibilities are now separated by placement instead of by one generic effect
- shared sports copy has been normalized across the public site content data

## Phase 3: Public conversion flows

Goal:
Turn the current contact-first setup into proper supporter intake flows.

Status:
Complete

Scope:

- build a dedicated `/donate` route
- connect donation funds to Supabase instead of static options
- improve donation intent capture with better structure and validation
- turn `/get-involved` into a real intake path for volunteers, partners, sponsors, and in-kind support
- preserve the contact page for general enquiries

Required data models already present:

- `donation_funds`
- `donation_intents`
- `involvement_leads`
- `contact_submissions`

Required code changes:

- expand `src/lib/supabase-rest.ts` beyond the current narrow insert whitelist
- build a dedicated donation page instead of sending donation CTAs to `/contact`
- add server-side validation and anti-spam controls for all public forms

Exit criteria:

- donation CTA goes to a real donation flow
- get involved submissions go into `involvement_leads`
- contact page is no longer overloaded with unrelated intents

Completion notes:

- `/donate` now exists as a dedicated donation intake route
- donation CTA paths point to `/donate` instead of routing through contact
- donation fund options can be read from Supabase with a safe fallback set when no live records exist
- `/get-involved` now submits structured leads into `involvement_leads`
- contact remains available for general enquiries instead of acting as the main donation surface
- public form handlers now include basic honeypot protection and stronger server-side validation

## Phase 4: Stories platform

Goal:
Replace the static stories page with a real storytelling system.

Scope:

- fetch published blog posts from Supabase
- fetch approved voice snippets from Supabase
- fetch published galleries and gallery items from Supabase
- fetch published video stories from Supabase
- add detail routes where needed for posts and galleries
- add public submission handling for moderated voice/story intake if desired

Required data models already present:

- `blog_posts`
- `voice_submissions`
- `story_galleries`
- `story_gallery_items`
- `video_stories`

Exit criteria:

- `/stories` is backed by real data
- "Read more" interactions lead somewhere real
- moderation-ready content flow exists for public submissions

## Phase 5: Programs and events

Goal:
Turn the programs page into a current, updateable program and event surface.

Scope:

- source events from `program_events`
- support featured and upcoming events
- keep the calendar, but back it with real data
- add event detail pages if the foundation needs public event pages
- add event CTAs such as register interest where appropriate

Exit criteria:

- `/programs` no longer relies on hardcoded event arrays
- event publishing can happen through Supabase Studio

## Phase 6: Impact publishing

Goal:
Make the impact page credible, sourced, and maintainable.

Scope:

- move impact metrics and context stats into Supabase
- keep source attribution visible and easy to update
- separate national context from foundation response data
- make comparison views easier to maintain without code edits

Required data models already present:

- `impact_metrics`
- `impact_context_stats`

Exit criteria:

- `/impact` is driven by structured data
- metric updates no longer require code edits
- source-backed content can be reviewed before publish

## Phase 7: Admin and workflow layer

Goal:
Make the platform manageable without prematurely building unnecessary admin software.

Scope:

- use Supabase Studio as the default admin layer first
- define clear moderation and publishing checklists
- add admin auth only when there is actual friction
- build a custom admin surface only for workflows Studio handles poorly

Likely triggers for custom admin work:

- gallery ordering becomes cumbersome
- story preview needs become frequent
- moderation volume increases
- event editing becomes repetitive

Exit criteria:

- team can manage content and submissions reliably
- custom dashboard work is justified by real pain, not anticipation

## Phase 8: Hardening and launch readiness

Goal:
Prepare the site for sustained public use.

Scope:

- tighten validation and anti-spam behavior
- add success and error observability for public forms
- improve empty states and fallback handling for data-driven pages
- review accessibility for forms, navigation, imagery, and motion
- replace default README and document project setup properly

Exit criteria:

- site has clear failure handling
- content and submission flows are supportable
- documentation matches the actual project

## Suggested sequence of implementation work

Recommended order:

1. Phase 1: Brand and media foundation
2. Phase 2: Image architecture refactor
3. Phase 3: Public conversion flows
4. Phase 4: Stories platform
5. Phase 5: Programs and events
6. Phase 6: Impact publishing
7. Phase 7: Admin and workflow layer
8. Phase 8: Hardening and launch readiness

This order matters because the current visual layer still needs correction, and the current content layer is still mostly static. It is better to fix the site shell first, then wire public flows, then migrate content domains into structured data.

## Immediate next actions

The next practical sprint should focus on Phase 4:

- replace static stories content with structured blog, gallery, voice, and video data
- add real story detail routes and remove dead-end story interactions
- connect approved story content to Supabase-backed publishing
- keep public submissions moderated instead of publishing directly

That work turns the current stories surface from a visual placeholder into the first real content domain on the platform.
