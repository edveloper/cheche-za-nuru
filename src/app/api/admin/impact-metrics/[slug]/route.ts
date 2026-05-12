import { NextRequest, NextResponse } from "next/server";
import { updateSupabase, deleteFromSupabase, readFromSupabase } from "@/lib/supabase-rest";

export const dynamic = "force-dynamic";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const body = await request.json();
    const { label, valueText, numericValue, unit, category, metricYear, summary, isFeatured, sortOrder } = body;

    // Validate category enum if provided
    if (category) {
      const validCategories = ["education", "healthcare", "sports", "cross_cutting"];
      if (!validCategories.includes(category)) {
        return NextResponse.json(
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

    await updateSupabase("impact_metrics", `slug=eq.${slug}`, updates);

    // Fetch and return updated record
    const updated = await readFromSupabase<any[]>("impact_metrics", `slug=eq.${slug}`);
    return NextResponse.json(updated?.[0] || null);
  } catch (error) {
    console.error("Failed to update impact metric:", error);
    return NextResponse.json(
      { error: "Failed to update impact metric" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    await deleteFromSupabase("impact_metrics", `slug=eq.${slug}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete impact metric:", error);
    return NextResponse.json(
      { error: "Failed to delete impact metric" },
      { status: 500 }
    );
  }
}
