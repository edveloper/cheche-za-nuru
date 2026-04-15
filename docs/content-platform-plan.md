# Cheche Za Nuru Content Platform Plan

## Purpose
This site is moving beyond a static brochure into a lightweight content and engagement platform. The goal is to support:

- public storytelling
- structured donation intake
- partner and volunteer onboarding
- event publishing
- impact reporting
- moderated public submissions
- simple internal content management

## Principles
- Public visitors should not need accounts.
- Internal admins should have accounts.
- Public submissions should never publish directly without moderation.
- Content models should be reusable across multiple pages.
- Forms should work on a zero-budget stack using Next.js route handlers and Supabase.

## Recommended Stack
- Frontend: Next.js App Router
- Database: Supabase Postgres
- File storage: Supabase Storage
- Admin auth: Supabase Auth
- Admin workflow: Supabase Studio first, custom dashboard only where it adds real value

## Public Content Domains

### Programs
Used by `/programs`

- program pillars
- upcoming events
- event calendar
- event detail copy

Primary table:
- `program_events`

### Impact
Used by `/impact`

- CZN metrics
- Kenya context metrics
- milestone timeline
- comparison framing between national need and CZN response

Primary tables:
- `impact_metrics`
- `impact_context_stats`

### Stories
Used by `/stories`

- blog posts
- moderated voice snippets
- photo stories / galleries
- video stories

Primary tables:
- `blog_posts`
- `voice_submissions`
- `story_galleries`
- `story_gallery_items`
- `video_stories`

### Get Involved
Used by `/get-involved`

- donation path
- volunteer path
- partner path
- sponsor path
- in-kind support path

Primary table:
- `involvement_leads`

### Donate
Used by dedicated donation page and CTA

- giving purpose / fund
- one-time vs recurring intent
- donor details
- donor reference code
- public-facing impact updates by fund

Primary tables:
- `donation_funds`
- `donation_intents`

### Contact
Used by `/contact`

- general enquiries
- program-related contact
- referral or support requests

Primary table:
- `contact_submissions`

## Moderation Model
For voice snippets and story submissions:

1. public visitor submits content
2. row is stored as `pending`
3. admin reviews in Supabase Studio or internal dashboard
4. admin marks row `approved` or `rejected`
5. only approved rows are shown publicly

This avoids spam and abuse while keeping submission friction low.

## Suggested Admin Workflows

### Minimum viable admin workflow
Use Supabase Studio to:
- review submissions
- create blog posts
- create event records
- upload storage assets
- manage galleries
- update impact metrics

### When to build a custom dashboard
Only when one of these becomes painful in Studio:
- managing ordered gallery layouts
- previewing blog/story content before publish
- bulk event editing
- reviewing large numbers of public submissions

## Suggested Page Behavior

### `/programs`
- hero and program overview
- upcoming dates
- filterable calendar or agenda
- event CTA like `Register interest`

### `/impact`
- Kenya challenge section with sourced public figures
- CZN response metrics
- milestone timeline
- charts that compare problem context to current reach

### `/stories`
- featured story
- voice snippets
- blog feed
- photo stories
- video stories

### `/get-involved`
- path chooser
- tailored intake forms
- donation entry point
- sponsor / partner options

### `/contact`
- practical contact form
- route-to-interest selection
- anti-spam handling

### `/donate`
- purpose-led giving
- choose a fund
- explain likely use of funds
- donation intent form
- impact updates tied to fund categories

## Anti-Spam and Safety
Zero-budget does not mean open write access.

Recommended controls:
- server-side validation in route handlers
- honeypot field on public forms
- simple submission rate limiting later if needed
- moderation for all public-generated story content
- optional Turnstile only if spam becomes real

## Content Ownership
This structure assumes:
- CZN staff own content decisions
- public users can submit, not publish
- metrics and national context data must be sourced and reviewed before release

## Build Order
Recommended implementation order:

1. Supabase schema and content model
2. Donation flow and fund structure
3. Stories publishing model
4. Programs events/calendar
5. Get Involved pipeline
6. Impact visualizations using real datasets
