import { revalidateTag } from "next/cache";

/**
 * Every public page reads CMS content through `readFromSupabase(..., { cache: "public" })`,
 * which tags the cached response with CMS_CACHE_TAG. Pages are therefore served from
 * cache instead of hitting Supabase on every request.
 */
export const CMS_CACHE_TAG = "cms";

/** Seconds before cached CMS reads are refreshed even without an admin edit. */
export const CMS_REVALIDATE_SECONDS = 600;

const contentTables = new Set([
  "blog_posts",
  "donation_funds",
  "impact_context_stats",
  "impact_metrics",
  "program_events",
  "story_galleries",
  "story_gallery_items",
  "team_members",
  "video_stories",
  "voice_submissions",
]);

/**
 * Expire cached CMS content immediately so admin edits show up on the next request.
 * Call after any write to a content table. Safe to call for non-content tables (no-op).
 */
export function expireCmsCache(table?: string) {
  if (table && !contentTables.has(table)) {
    return;
  }

  try {
    revalidateTag(CMS_CACHE_TAG, { expire: 0 });
  } catch (error) {
    // revalidateTag only works inside Server Functions and Route Handlers.
    console.error("[CMS Cache] Unable to expire cache:", error);
  }
}
