"use server";

export async function saveDonationFundAction(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean } | null> {
  try {
    const slug = formData.get("slug") as string;
    const name = formData.get("name") as string;
    const shortDescription = formData.get("shortDescription") as string;
    const impactSummary = formData.get("impactSummary") as string;
    const isActive = formData.get("isActive") === "true";
    const sortOrder = parseInt(formData.get("sortOrder") as string, 10) || 0;
    const isEditing = formData.get("isEditing") === "true";

    // Validation
    if (!slug || !name) {
      return { error: "Slug and name are required" };
    }

    const url = isEditing
      ? `/api/admin/donation-funds/${slug}`
      : "/api/admin/donation-funds";

    const method = isEditing ? "PUT" : "POST";

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${url}`,
      {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          name,
          short_description: shortDescription,
          impact_summary: impactSummary,
          is_active: isActive,
          sort_order: sortOrder,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return { error: error.error || "Failed to save donation fund" };
    }

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "An error occurred";
    return { error: message };
  }
}

export async function deleteDonationFundAction(slug: string): Promise<void> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/admin/donation-funds/${slug}`,
      { method: "DELETE" }
    );

    if (!response.ok) {
      throw new Error("Failed to delete donation fund");
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "An error occurred";
    throw new Error(message);
  }
}
