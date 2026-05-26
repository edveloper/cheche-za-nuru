import { hasSupabaseConfig, readFromSupabase } from "./supabase-rest";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  profile_photo_path: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  if (!hasSupabaseConfig()) {
    console.warn("[Team Content] Supabase not configured, returning empty team list.");
    return [];
  }

  try {
    const members = await readFromSupabase<TeamMember[]>(
      "team_members",
      [
        "select=*",
        "is_active=eq.true",
        "order=sort_order.asc",
      ].join("&"),
    );

    return members || [];
  } catch (error) {
    console.error("[Team Content] Error fetching team members:", error);
    return [];
  }
}

export async function getAllTeamMembers(): Promise<TeamMember[]> {
  if (!hasSupabaseConfig()) {
    console.warn("[Team Content] Supabase not configured, returning empty team list.");
    return [];
  }

  try {
    const members = await readFromSupabase<TeamMember[]>(
      "team_members",
      [
        "select=*",
        "order=sort_order.asc",
      ].join("&"),
    );

    return members || [];
  } catch (error) {
    console.error("[Team Content] Error fetching all team members:", error);
    return [];
  }
}
