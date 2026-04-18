-- Phase 7: Row-Level Security Policies for Cheche Za Nuru
-- 
-- These policies control who can read and write to each table in Supabase.
-- Run this entire file in the Supabase SQL Editor to apply all policies.
-- 
-- Assumptions:
-- - Editors have a custom claim 'role' = 'editor' or 'admin'
-- - Admins have a custom claim 'role' = 'admin'
-- - Public access is unauthenticated or authenticated non-editors

-- Enable RLS on all tables
ALTER TABLE donation_funds ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE involvement_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_context_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_stories ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- DONATION_FUNDS: Public read-only (needed for /donate form dropdown)
-- ============================================================================

CREATE POLICY "donation_funds_public_read" ON donation_funds
  FOR SELECT
  USING (true);

CREATE POLICY "donation_funds_editor_write" ON donation_funds
  FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'role' IN ('editor', 'admin')
  );

CREATE POLICY "donation_funds_editor_update" ON donation_funds
  FOR UPDATE
  WITH CHECK (
    auth.jwt() ->> 'role' IN ('editor', 'admin')
  );

CREATE POLICY "donation_funds_admin_delete" ON donation_funds
  FOR DELETE
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- ============================================================================
-- PROGRAM_EVENTS: Public read (status='scheduled'), Editors write
-- ============================================================================

CREATE POLICY "program_events_public_read_scheduled" ON program_events
  FOR SELECT
  USING (
    status = 'scheduled' OR
    auth.jwt() ->> 'role' IN ('editor', 'admin')
  );

CREATE POLICY "program_events_editor_read_all" ON program_events
  FOR SELECT
  USING (auth.jwt() ->> 'role' IN ('editor', 'admin'));

CREATE POLICY "program_events_editor_write" ON program_events
  FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'role' IN ('editor', 'admin')
  );

CREATE POLICY "program_events_editor_update" ON program_events
  FOR UPDATE
  WITH CHECK (
    auth.jwt() ->> 'role' IN ('editor', 'admin')
  );

CREATE POLICY "program_events_admin_delete" ON program_events
  FOR DELETE
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- ============================================================================
-- IMPACT_METRICS: Public read (is_featured=true), Editors write
-- ============================================================================

CREATE POLICY "impact_metrics_public_read_featured" ON impact_metrics
  FOR SELECT
  USING (
    is_featured = true OR
    auth.jwt() ->> 'role' IN ('editor', 'admin')
  );

CREATE POLICY "impact_metrics_editor_read_all" ON impact_metrics
  FOR SELECT
  USING (auth.jwt() ->> 'role' IN ('editor', 'admin'));

CREATE POLICY "impact_metrics_editor_write" ON impact_metrics
  FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'role' IN ('editor', 'admin')
  );

CREATE POLICY "impact_metrics_editor_update" ON impact_metrics
  FOR UPDATE
  WITH CHECK (
    auth.jwt() ->> 'role' IN ('editor', 'admin')
  );

CREATE POLICY "impact_metrics_admin_delete" ON impact_metrics
  FOR DELETE
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- ============================================================================
-- IMPACT_CONTEXT_STATS: Public read-only, Editors write
-- ============================================================================

CREATE POLICY "impact_context_stats_public_read" ON impact_context_stats
  FOR SELECT
  USING (true);

CREATE POLICY "impact_context_stats_editor_write" ON impact_context_stats
  FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'role' IN ('editor', 'admin')
  );

CREATE POLICY "impact_context_stats_editor_update" ON impact_context_stats
  FOR UPDATE
  WITH CHECK (
    auth.jwt() ->> 'role' IN ('editor', 'admin')
  );

CREATE POLICY "impact_context_stats_admin_delete" ON impact_context_stats
  FOR DELETE
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- ============================================================================
-- BLOG_POSTS: Public read (status='published'), Editors write
-- ============================================================================

CREATE POLICY "blog_posts_public_read_published" ON blog_posts
  FOR SELECT
  USING (
    status = 'published' OR
    auth.jwt() ->> 'role' IN ('editor', 'admin')
  );

CREATE POLICY "blog_posts_editor_read_all" ON blog_posts
  FOR SELECT
  USING (auth.jwt() ->> 'role' IN ('editor', 'admin'));

CREATE POLICY "blog_posts_editor_write" ON blog_posts
  FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'role' IN ('editor', 'admin')
  );

CREATE POLICY "blog_posts_editor_update" ON blog_posts
  FOR UPDATE
  WITH CHECK (
    auth.jwt() ->> 'role' IN ('editor', 'admin')
  );

CREATE POLICY "blog_posts_admin_delete" ON blog_posts
  FOR DELETE
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- ============================================================================
-- VOICE_SUBMISSIONS: Public read (status='approved'), Editors read-only, 
--                     Public submit via API
-- ============================================================================

CREATE POLICY "voice_submissions_public_read_approved" ON voice_submissions
  FOR SELECT
  USING (
    status = 'approved' OR
    auth.jwt() ->> 'role' IN ('editor', 'admin')
  );

CREATE POLICY "voice_submissions_editor_read_all" ON voice_submissions
  FOR SELECT
  USING (auth.jwt() ->> 'role' IN ('editor', 'admin'));

CREATE POLICY "voice_submissions_editor_update_status" ON voice_submissions
  FOR UPDATE
  WITH CHECK (
    auth.jwt() ->> 'role' IN ('editor', 'admin')
  );

CREATE POLICY "voice_submissions_admin_delete" ON voice_submissions
  FOR DELETE
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- ============================================================================
-- STORY_GALLERIES: Public read (status='published'), Editors write
-- ============================================================================

CREATE POLICY "story_galleries_public_read_published" ON story_galleries
  FOR SELECT
  USING (
    status = 'published' OR
    auth.jwt() ->> 'role' IN ('editor', 'admin')
  );

CREATE POLICY "story_galleries_editor_read_all" ON story_galleries
  FOR SELECT
  USING (auth.jwt() ->> 'role' IN ('editor', 'admin'));

CREATE POLICY "story_galleries_editor_write" ON story_galleries
  FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'role' IN ('editor', 'admin')
  );

CREATE POLICY "story_galleries_editor_update" ON story_galleries
  FOR UPDATE
  WITH CHECK (
    auth.jwt() ->> 'role' IN ('editor', 'admin')
  );

CREATE POLICY "story_galleries_admin_delete" ON story_galleries
  FOR DELETE
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- ============================================================================
-- STORY_GALLERY_ITEMS: Public read (parent published), Editors write
-- ============================================================================

CREATE POLICY "story_gallery_items_public_read_if_parent_published" ON story_gallery_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM story_galleries
      WHERE story_galleries.id = story_gallery_items.gallery_id
        AND (story_galleries.status = 'published' OR auth.jwt() ->> 'role' IN ('editor', 'admin'))
    )
  );

CREATE POLICY "story_gallery_items_editor_write" ON story_gallery_items
  FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'role' IN ('editor', 'admin')
  );

CREATE POLICY "story_gallery_items_editor_update" ON story_gallery_items
  FOR UPDATE
  WITH CHECK (
    auth.jwt() ->> 'role' IN ('editor', 'admin')
  );

CREATE POLICY "story_gallery_items_admin_delete" ON story_gallery_items
  FOR DELETE
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- ============================================================================
-- VIDEO_STORIES: Public read (status='published'), Editors write
-- ============================================================================

CREATE POLICY "video_stories_public_read_published" ON video_stories
  FOR SELECT
  USING (
    status = 'published' OR
    auth.jwt() ->> 'role' IN ('editor', 'admin')
  );

CREATE POLICY "video_stories_editor_read_all" ON video_stories
  FOR SELECT
  USING (auth.jwt() ->> 'role' IN ('editor', 'admin'));

CREATE POLICY "video_stories_editor_write" ON video_stories
  FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'role' IN ('editor', 'admin')
  );

CREATE POLICY "video_stories_editor_update" ON video_stories
  FOR UPDATE
  WITH CHECK (
    auth.jwt() ->> 'role' IN ('editor', 'admin')
  );

CREATE POLICY "video_stories_admin_delete" ON video_stories
  FOR DELETE
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- ============================================================================
-- DONATION_INTENTS: Admins only (private submissions)
-- ============================================================================

CREATE POLICY "donation_intents_admin_read" ON donation_intents
  FOR SELECT
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "donation_intents_admin_write" ON donation_intents
  FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "donation_intents_admin_update" ON donation_intents
  FOR UPDATE
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "donation_intents_admin_delete" ON donation_intents
  FOR DELETE
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- ============================================================================
-- CONTACT_SUBMISSIONS: Admins only (private submissions)
-- ============================================================================

CREATE POLICY "contact_submissions_admin_read" ON contact_submissions
  FOR SELECT
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "contact_submissions_admin_write" ON contact_submissions
  FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "contact_submissions_admin_update" ON contact_submissions
  FOR UPDATE
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "contact_submissions_admin_delete" ON contact_submissions
  FOR DELETE
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- ============================================================================
-- INVOLVEMENT_LEADS: Admins only (private submissions)
-- ============================================================================

CREATE POLICY "involvement_leads_admin_read" ON involvement_leads
  FOR SELECT
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "involvement_leads_admin_write" ON involvement_leads
  FOR INSERT
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "involvement_leads_admin_update" ON involvement_leads
  FOR UPDATE
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "involvement_leads_admin_delete" ON involvement_leads
  FOR DELETE
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- ============================================================================
-- NOTES
-- ============================================================================
-- 
-- Custom Claims Setup (required in Supabase Auth):
-- 
-- 1. For editors, add custom claim in Auth settings:
--    {
--      "role": "editor"
--    }
--
-- 2. For admins, add:
--    {
--      "role": "admin"
--    }
--
-- How custom claims work:
-- - When a user logs in, their JWT token includes the 'role' claim
-- - RLS policies check auth.jwt() ->> 'role' to verify permissions
-- - This happens at the database level (more secure than app-level checks)
--
-- To set custom claims, use Supabase CLI or API:
-- supabase auth admin update-user-by-id <USER_ID> --custom-claims '{"role":"editor"}'
--
