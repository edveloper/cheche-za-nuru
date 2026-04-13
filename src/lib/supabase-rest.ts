type TableName = "contact_submissions" | "donation_intents";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function hasSupabaseConfig() {
  return Boolean(supabaseUrl && serviceKey);
}

export async function insertIntoSupabase(
  table: TableName,
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
