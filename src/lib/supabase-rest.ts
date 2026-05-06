type InsertTableName =
  | "contact_submissions"
  | "donation_intents"
  | "involvement_leads"
  | "blog_posts"
  | "story_galleries"
  | "story_gallery_items"
  | "video_stories"
  | "voice_submissions";

type ReadTableName =
  | "donation_funds"
  | "blog_posts"
  | "voice_submissions"
  | "story_galleries"
  | "story_gallery_items"
  | "video_stories"
  | "program_events"
  | "impact_metrics"
  | "impact_context_stats"
  | "contact_submissions"
  | "involvement_leads"
  | "team_members";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function hasSupabaseConfig() {
  return Boolean(supabaseUrl && serviceKey);
}

export async function insertIntoSupabase(
  table: InsertTableName,
  payload: Record<string, unknown>,
) {
  if (!hasSupabaseConfig()) {
    throw new Error("Supabase environment variables are missing.");
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: serviceKey!,
      Authorization: `Bearer ${serviceKey!}`,
      Prefer: "return=representation",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Supabase insert failed for ${table}.`);
  }

  return response.json();
}

export async function updateSupabase(
  table: string,
  filter: string,
  payload: Record<string, unknown>,
) {
  if (!hasSupabaseConfig()) {
    throw new Error("Supabase environment variables are missing.");
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${filter}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      apikey: serviceKey!,
      Authorization: `Bearer ${serviceKey!}`,
      Prefer: "return=representation",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Supabase update failed for ${table}.`);
  }

  return response.json();
}

export async function readFromSupabase<T>(
  table: ReadTableName,
  query: string,
) {
  if (!hasSupabaseConfig()) {
    throw new Error("Supabase environment variables are missing.");
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${query}`, {
    headers: {
      apikey: serviceKey!,
      Authorization: `Bearer ${serviceKey!}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Supabase read failed for ${table}.`);
  }

  return response.json() as Promise<T>;
}

export async function deleteFromSupabase(
  table: string,
  filter: string,
) {
  if (!hasSupabaseConfig()) {
    throw new Error("Supabase environment variables are missing.");
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${filter}`, {
    method: "DELETE",
    headers: {
      apikey: serviceKey!,
      Authorization: `Bearer ${serviceKey!}`,
      Prefer: "return=representation",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Supabase delete failed for ${table}.`);
  }

  return response.json();
}
