"use server";

export async function saveImpactMetricAction(prevState: any, formData: FormData) {
  try {
    const isEditing = formData.get("isEditing") === "true";
    const slug = formData.get("slug") as string;
    const label = formData.get("label") as string;
    const valueText = formData.get("valueText") as string;
    const numericValue = formData.get("numericValue") as string;
    const unit = formData.get("unit") as string;
    const category = formData.get("category") as string;
    const metricYear = formData.get("metricYear") as string;
    const summary = formData.get("summary") as string;
    const isFeatured = formData.get("isFeatured") === "on";
    const sortOrder = formData.get("sortOrder") as string;

    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `/api/admin/impact-metrics/${slug}`
      : "/api/admin/impact-metrics";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug,
        label,
        valueText,
        numericValue: numericValue ? parseFloat(numericValue) : null,
        unit,
        category,
        metricYear: metricYear ? parseInt(metricYear) : null,
        summary,
        isFeatured,
        sortOrder: sortOrder ? parseInt(sortOrder) : 0,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.error || "Failed to save metric" };
    }

    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to save metric" };
  }
}

export async function deleteImpactMetricAction(slug: string) {
  try {
    const response = await fetch(`/api/admin/impact-metrics/${slug}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete metric");
    }

    return { success: true };
  } catch (error) {
    throw error;
  }
}
