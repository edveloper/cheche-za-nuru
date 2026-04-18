# Content Management Checklists

These checklists help ensure consistent, quality content across all public-facing material.

---

## Event Publishing Checklist

Use this before changing an event's status from `draft` to `scheduled`.

### Event Details
- [ ] Title is clear and action-oriented (not generic)
- [ ] Program type matches actual content (education/healthcare/sports/community)
- [ ] Date is accurate and in correct format (YYYY-MM-DD, 09:00:00+00:00)
- [ ] Location is specific (venue name + city, not just city)
- [ ] Summary clearly explains what the event is (120 chars or less)
- [ ] All required fields are filled (no blank fields)

### Quality Check
- [ ] Title doesn't duplicate other recent events
- [ ] Date makes sense (not in past, not conflicting with other events)
- [ ] Event serves foundation mission (education, health, sports, community)
- [ ] Summary is written for public (not internal shorthand)

### Publishing
- [ ] Event is set to status `scheduled`
- [ ] Verified event appears on `/programs` calendar
- [ ] Event details are correct on live calendar

### After Event
- [ ] Return to Supabase Studio
- [ ] Change status to `completed`
- [ ] Event disappears from public calendar

---

## Impact Metric Publishing Checklist

Use before or when adding/updating metrics in `impact_metrics` table.

### Data Accuracy
- [ ] Value is current and verified (not historical unless marked)
- [ ] Numeric value is reasonable (no typos in numbers)
- [ ] Unit is specified if applicable (%, +, etc.)
- [ ] Category matches content (education/healthcare/sports/cross_cutting)

### Source & Documentation
- [ ] Source of data is documented (add to `summary` field)
- [ ] Data collection date is recent (within current year if possible)
- [ ] Data source is reliable (internal records, partner reports, etc.)
- [ ] No unverified claims included

### Display & Context
- [ ] Label is clear and consistent (e.g., "Scholarships awarded" not "# scholarships")
- [ ] Value format is readable (e.g., "2,400+" not "2400+")
- [ ] Metric is relevant to current mission (not outdated or superseded)
- [ ] Sort order reflects importance (1 = most important)

### Featured Metrics Only
- [ ] Only 4-6 metrics marked as `is_featured=true`
- [ ] Featured metrics are most impactful numbers
- [ ] Featured metrics are current and frequently updated

---

## Blog Post Publishing Checklist

Use before changing post status from `draft` to `published`.

### Foundational
- [ ] Title is compelling and clear (not generic/click-baity)
- [ ] Slug is unique, lowercase, hyphenated (e.g., "scholarship-winners-2026")
- [ ] Slug is not duplicated in other posts
- [ ] Author name is accurate or set to "Cheche Za Nuru"

### Content
- [ ] Excerpt is 1-2 sentences (shows in story list)
- [ ] Excerpt is compelling and hooks reader
- [ ] Body is written in Markdown (headers with ##, emphasis with **)
- [ ] Tone is human, hopeful, grounded (matches brand voice)
- [ ] No jargon or technical language used
- [ ] Story connects to real people/impact (not just facts)

### Structure
- [ ] Post has clear beginning, middle, end
- [ ] Paragraphs are short (2-3 sentences max)
- [ ] Use headers (##) to break content into sections
- [ ] Use bold (**text**) to highlight key phrases
- [ ] Use bullet points for lists

### Images & Media
- [ ] Cover image is high quality (no pixelation)
- [ ] Cover image is relevant to content
- [ ] Image has good contrast/readability
- [ ] Image path is correct (references Supabase storage)

### Final Check
- [ ] Spell check complete (no typos)
- [ ] Grammar reviewed (sounds natural)
- [ ] Fact check complete (verify any numbers/claims)
- [ ] Privacy check (no sensitive personal info)
- [ ] Status is `published`
- [ ] Verified post appears on `/stories` page

---

## Story Gallery Publishing Checklist

Use before changing gallery status from `draft` to `published`.

### Gallery Setup
- [ ] Title is descriptive (not generic)
- [ ] Slug is unique, lowercase, hyphenated
- [ ] Excerpt explains context/timing (1-2 sentences)
- [ ] Story date is when photos were taken
- [ ] Layout style matches content (editorial/mosaic/stacked)

### Photo Quality
- [ ] All photos are high quality (sharp, well-lit)
- [ ] Photos are relevant to foundation mission
- [ ] No blurry, out-of-focus, or low-quality images
- [ ] Photos are diverse (not repetitive)
- [ ] Minimum 3-4 photos (ideally 6-8)

### Captions & Ordering
- [ ] Each photo has meaningful caption (2-3 sentences)
- [ ] Captions are specific (not generic like "group of kids")
- [ ] Photos are in logical order (`sort_order` 1, 2, 3...)
- [ ] Order tells a story or flows naturally
- [ ] First photo is strongest (sets tone for gallery)

### Consent & Privacy
- [ ] Consent obtained from any identifiable subjects
- [ ] Children's photos have parental consent
- [ ] Participants' privacy is respected
- [ ] No identifying info in captions unless appropriate

### Gallery Items
- [ ] All gallery items linked to correct gallery
- [ ] All image paths are valid (images exist in storage)
- [ ] Sort order reflects intended viewing sequence
- [ ] No duplicate images

### Publishing
- [ ] Gallery status is `published`
- [ ] Verified gallery appears on `/stories` page
- [ ] Captions are readable
- [ ] Photos load properly

---

## Community Voice Submission Checklist

Use when reviewing submissions in `voice_submissions` table.

### Authenticity
- [ ] Quote sounds genuine (not written/promotional)
- [ ] Quote reflects real lived experience
- [ ] Name and role are verifiable
- [ ] No fake or placeholder names

### Relevance
- [ ] Quote relates to foundation work (education/health/sports/community)
- [ ] Quote reflects positive experience or constructive feedback
- [ ] Quote is appropriate for public (not controversial/sensitive)
- [ ] Quote aligns with foundation values

### Permission
- [ ] Submitter gave explicit permission to publish (internal note)
- [ ] Contact information is accurate
- [ ] Right person authorized to give permission

### Quality
- [ ] Quote is clear and concise (fits in 1-2 sentences)
- [ ] Quote is grammatically sound (or edited slightly if needed)
- [ ] Quote has emotional weight (not bland)
- [ ] Role/title accurately describes person

### Decision
- [ ] Approve (change status to `approved`) OR
- [ ] Reject (change status to `rejected`) with reason (internal note)

---

## Submission Review Checklist

Use for donation inquiries, contact submissions, and partnership leads.

### Initial Triage
- [ ] Message is legible and complete
- [ ] Contact information is valid (email/phone format)
- [ ] No spam or test entries
- [ ] Priority level clear (urgent/normal/followup)

### Response Planning
- [ ] Determine appropriate response (donation follow-up / contact reply / partnership discussion)
- [ ] Assign to responsible team member
- [ ] Note any action items needed
- [ ] Set followup date

### Response Quality
- [ ] Response is personalized (not template)
- [ ] Response addresses specific inquiry
- [ ] Tone is warm and professional
- [ ] Call-to-action is clear

### Record Keeping
- [ ] Status updated in Supabase (contacted/qualified/responded)
- [ ] Date of contact recorded (in notes or timestamp)
- [ ] Outcome tracked (promised next step, got commitment, etc.)

---

## Monthly Content Review

Run this at the end of each month to keep content fresh.

### Events
- [ ] Any events completed this month? (change status to `completed`)
- [ ] Any new upcoming events added?
- [ ] Calendar is accurate and current

### Stories & Galleries
- [ ] Any new stories published this month?
- [ ] Any new galleries published?
- [ ] Old stories still accurate and relevant?

### Metrics
- [ ] Any metrics updated with new data?
- [ ] Values are current (not outdated)
- [ ] All featured metrics still relevant?

### Submissions
- [ ] Any old submissions not yet responded to? (older than 2 weeks?)
- [ ] Submissions properly triaged and assigned
- [ ] Follow-ups on in-progress leads

### Overall Health
- [ ] Site feels current and alive (or stale?)
- [ ] Any broken images or 404s on stories?
- [ ] Any feedback from site visitors or team?

---

## Questions?

Refer to [ADMIN-SETUP.md](./ADMIN-SETUP.md) for detailed instructions on any task.
