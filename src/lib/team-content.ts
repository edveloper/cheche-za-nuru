import { supabaseClient } from "./supabase-client";

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
  try {
    const { data, error } = await supabaseClient
      .from("team_members")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("[Team Content] Error fetching team members:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("[Team Content] Unexpected error:", error);
    return [];
  }
}

export async function getAllTeamMembers(): Promise<TeamMember[]> {
  try {
    const { data, error } = await supabaseClient
      .from("team_members")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("[Team Content] Error fetching all team members:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("[Team Content] Unexpected error:", error);
    return [];
  }
}
