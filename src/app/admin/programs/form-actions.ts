"use server";

export async function saveProgramEventAction(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean } | null> {
  try {
    const slug = formData.get("slug") as string;
    const title = formData.get("title") as string;
    const programType = formData.get("programType") as string;
    const summary = formData.get("summary") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;
    const isFeatured = formData.get("isFeatured") === "true";
    const status = formData.get("status") as string;
    const isEditing = formData.get("isEditing") === "true";

    // Validation
    if (!slug || !title || !programType || !startDate) {
      return { error: "Slug, title, program type, and start date are required" };
    }

    const url = isEditing
      ? `/api/admin/program-events/${slug}`
      : "/api/admin/program-events";

    const method = isEditing ? "PUT" : "POST";

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${url}`,
      {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          title,
          program_type: programType,
          summary,
          description,
          location,
          start_date: startDate,
          end_date: endDate || null,
          is_featured: isFeatured,
          status: status || "draft",
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return { error: error.error || "Failed to save event" };
    }

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "An error occurred";
    return { error: message };
  }
}

export async function deleteProgramEventAction(slug: string): Promise<void> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/admin/program-events/${slug}`,
      { method: "DELETE" }
    );

    if (!response.ok) {
      throw new Error("Failed to delete event");
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "An error occurred";
    throw new Error(message);
  }
}
