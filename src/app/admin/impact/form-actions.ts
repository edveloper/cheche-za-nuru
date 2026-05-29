"use server";

import {
  hasSupabaseConfig,
  insertIntoSupabase,
  updateSupabase,
  deleteFromSupabase,
} from "@/lib/supabase-rest";

export async function saveImpactMetricAction(_prevState: any, formData: FormData) {
  try {
    if (!hasSupabaseConfig()) {
      return { error: "Database not configured" };
    }

    const isEditing = formData.get("isEditing") === "true";
    const slug = formData.get("slug") as string;
    const label = formData.get("label") as string;
    const valueText = formData.get("valueText") as string;
    const numericValueRaw = formData.get("numericValue") as string;
    const unit = formData.get("unit") as string;
    const category = formData.get("category") as string;
    const metricYearRaw = formData.get("metricYear") as string;
    const summary = formData.get("summary") as string;
    const isFeatured = formData.get("isFeatured") === "on";
    const sortOrderRaw = formData.get("sortOrder") as string;

    if (!slug || !label || !valueText || !category) {
      return { error: "Label, display value, and category are required." };
    }

    const validCategories = ["education", "healthcare", "sports", "cross_cutting"];
    if (!validCategories.includes(category)) {
      return { error: "Invalid category selected." };
    }

    const record = {
      slug,
      label,
      value_text: valueText,
      numeric_value: numericValueRaw ? parseFloat(numericValueRaw) : null,
      unit: unit || "",
      category,
      metric_year: metricYearRaw ? parseInt(metricYearRaw) : null,
      summary: summary || "",
      is_featured: isFeatured,
      sort_order: sortOrderRaw ? parseInt(sortOrderRaw) : 0,
    };

    if (isEditing) {
      const { slug: _slug, ...updates } = record;
      await updateSupabase("impact_metrics", `slug=eq.${slug}`, updates);
    } else {
      await insertIntoSupabase("impact_metrics", record);
    }

    return { success: true };
  } catch (error: any) {
    if (error?.message?.includes("duplicate") || error?.message?.includes("unique")) {
      return { error: "A metric with this label already exists. Try a different label." };
    }
    return { error: error instanceof Error ? error.message : "Failed to save metric." };
  }
}

export async function deleteImpactMetricAction(slug: string) {
  if (!hasSupabaseConfig()) throw new Error("Database not configured");
  await deleteFromSupabase("impact_metrics", `slug=eq.${slug}`);
  return { success: true };
}
