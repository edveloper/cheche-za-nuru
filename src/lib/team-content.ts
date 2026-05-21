import { readFromSupabase } from "./supabase-rest";

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
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/admin/team`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch team members: ${response.statusText}`);
    }

    const data = (await response.json()) as TeamMember[];
    return data || [];
  } catch (error) {
    console.error("[Team Content] Error fetching team members:", error);
    return [];
  }
}

export async function getAllTeamMembers(): Promise<TeamMember[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/admin/team?includeInactive=true`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch team members: ${response.statusText}`);
    }

    const data = (await response.json()) as TeamMember[];
    return data || [];
  } catch (error) {
    console.error("[Team Content] Error fetching all team members:", error);
    return [];
  }
}
