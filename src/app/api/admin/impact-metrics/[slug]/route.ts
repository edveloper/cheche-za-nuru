import { updateSupabase, deleteFromSupabase, readFromSupabase } from "@/lib/supabase-rest";

export const dynamic = "force-dynamic";

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const body = await request.json();
    const { label, valueText, numericValue, unit, category, metricYear, summary, isFeatured, sortOrder } = body;

    // Validate category enum if provided
    if (category) {
      const validCategories = ["education", "healthcare", "sports", "cross_cutting"];
      if (!validCategories.includes(category)) {
        return Response.json(
          { error: `Category must be one of: ${validCategories.join(", ")}` },
          { status: 400 }
        );
      }
    }

    const updates: Record<string, any> = {};
    if (label) updates.label = label;
    if (valueText) updates.value_text = valueText;
    if (numericValue !== undefined) updates.numeric_value = numericValue ? parseFloat(numericValue) : null;
    if (unit !== undefined) updates.unit = unit;
    if (category) updates.category = category;
    if (metricYear !== undefined) updates.metric_year = metricYear ? parseInt(metricYear) : null;
    if (summary !== undefined) updates.summary = summary;
    if (isFeatured !== undefined) updates.is_featured = isFeatured;
    if (sortOrder !== undefined) updates.sort_order = parseInt(sortOrder);

    await updateSupabase("impact_metrics", { slug }, updates);

    // Fetch and return updated record
    const updated = await readFromSupabase("impact_metrics", `slug=eq.${slug}`);
    return Response.json(updated?.[0] || null);
  } catch (error) {
    console.error("Failed to update impact metric:", error);
    return Response.json(
      { error: "Failed to update impact metric" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    await deleteFromSupabase("impact_metrics", { slug });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to delete impact metric:", error);
    return Response.json(
      { error: "Failed to delete impact metric" },
      { status: 500 }
    );
  }
}
