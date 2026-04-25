"use server";

import { revalidatePath } from "next/cache";

interface TeamMemberInput {
  id?: string;
  name: string;
  role: string;
  bio?: string;
  sort_order?: number;
}

export async function saveTeamMemberAction(
  prevState: any,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  try {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const bio = formData.get("bio") as string;
    const sort_order = parseInt(formData.get("sort_order") as string) || 0;

    console.log("[Team Save] Processing:", { id, name, role });

    // Validate required fields
    if (!name || !role) {
      return { error: "Name and role are required" };
    }

    const url = new URL(
      id ? `/api/admin/team?id=${id}` : "/api/admin/team",
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001"
    );

    const response = await fetch(url, {
      method: id ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        name,
        role,
        bio,
        sort_order,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("[Team Save] Error:", errorData);
      return { error: errorData.error || "Failed to save team member" };
    }

    console.log("[Team Save] Success");
    revalidatePath("/admin/team");
    revalidatePath("/about");

    return { success: true };
  } catch (error) {
    console.error("[Team Save] Unexpected error:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function deleteTeamMemberAction(
  prevState: any,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  try {
    const id = formData.get("id") as string;

    if (!id) {
      return { error: "Team member ID is required" };
    }

    console.log("[Team Delete] Processing:", { id });

    const url = new URL(
      `/api/admin/team?id=${id}`,
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001"
    );

    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("[Team Delete] Error:", errorData);
      return { error: errorData.error || "Failed to delete team member" };
    }

    console.log("[Team Delete] Success");
    revalidatePath("/admin/team");
    revalidatePath("/about");

    return { success: true };
  } catch (error) {
    console.error("[Team Delete] Unexpected error:", error);
    return { error: "An unexpected error occurred" };
  }
}
