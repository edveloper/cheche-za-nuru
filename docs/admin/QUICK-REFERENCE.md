# Quick Reference: Day-to-Day Admin Tasks

Keep this open while you're working in Supabase Studio.

---

## Logging In

1. Go to **[your-project].supabase.co** (ask admin for URL)
2. Email: your-email@example.com
3. Password: (you set this at signup)
4. You're in!

---

## Publishing an Event

1. Open table **program_events**
2. Click **Insert** → **Insert Row**
3. Fill these fields:
   - `slug`: lowercase-hyphenated
   - `title`: Full event name
   - `program_type`: education/healthcare/sports/community
   - `summary`: 1-2 sentence description
   - `location`: City, Venue
   - `start_date`: 2026-04-20 09:00:00+00:00
   - `status`: draft
4. Click **Save**
5. When ready: change `status` to **scheduled**

---

## Publishing a Story

1. Open table **blog_posts**
2. Click **Insert** → **Insert Row**
3. Fill these fields:
   - `slug`: lowercase-hyphenated
   - `title`: Story title
   - `excerpt`: 1-2 sentence hook
   - `body_md`: Full story in Markdown
   - `cover_image_path`: /images/filename.jpg
   - `status`: draft
4. Click **Save**
5. When ready: change `status` to **published**

---

## Publishing a Gallery

1. Open table **story_galleries**
2. Click **Insert** → **Insert Row**
3. Fill these fields:
   - `slug`: lowercase-hyphenated
   - `title`: Gallery title
   - `excerpt`: Context/intro text
   - `story_date`: 2026-04-15
   - `cover_image_path`: /images/photo1.jpg
   - `layout_style`: editorial (or mosaic/stacked)
   - `status`: draft
4. Click **Save**
5. Open table **story_gallery_items**
6. For each photo, click **Insert** → **Insert Row**:
   - `gallery_id`: (select the gallery you just created)
   - `image_path`: /images/photo2.jpg
   - `caption`: Photo description
   - `sort_order`: 1, 2, 3...
7. When all photos added: change gallery `status` to **published**

---

## Approving a Community Voice

1. Open table **voice_submissions**
2. Find submission with status **pending**
3. Read the quote
4. If good: change `status` to **approved**
5. If not appropriate: change `status` to **rejected**

---

## Responding to a Submission

1. Open table **contact_submissions**, **donation_intents**, or **involvement_leads**
2. Find submission with status **new**
3. Check email/phone and reach out to the person
4. Update status to **contacted**
5. Follow up as needed

---

## Unpublishing Content

To hide content without deleting:

- **Events:** Change `status` from `scheduled` to `completed` or `draft`
- **Stories:** Change `status` from `published` to `draft`
- **Galleries:** Change `status` from `published` to `draft`
- **Voices:** Change `status` from `approved` to `pending`

---

## Editing Existing Content

1. Open the table
2. Find the row (use search at top if needed)
3. Click the row to open it
4. Edit any field
5. Click **Save**

---

## Common Mistakes to Avoid

❌ **Don't delete submissions.** Archive them instead (change status).

❌ **Don't change capitalization inconsistently.** "Nairobi" always, not "nairobi".

❌ **Don't leave status as `draft`.** Content won't show to public until published.

❌ **Don't skip the summary/description fields.** These help people understand what the content is about.

❌ **Don't use emojis in fields.** They can break things. Use text only.

---

## Helpful Links

- **Supabase Admin:** [Go to Supabase](https://app.supabase.com)
- **Full Documentation:** See ADMIN-SETUP.md
- **Checklists:** See CHECKLISTS.md
- **Published Site:** (your live domain)

---

## Still Stuck?

1. Check the **Checklists** document for detailed steps
2. Check the **ADMIN-SETUP** guide for full explanations
3. Reach out to the development team

---

**Bookmark this page for quick access!**
