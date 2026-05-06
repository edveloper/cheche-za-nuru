import { insertIntoSupabase, readFromSupabase, updateSupabase } from "@/lib/supabase-rest";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const metrics = await readFromSupabase<{
      id: string;
      slug: string;
      label: string;
      value_text: string;
      numeric_value: number | null;
      unit: string;
      category: "education" | "healthcare" | "sports" | "cross_cutting";
      metric_year: number | null;
      summary: string;
      is_featured: boolean;
      sort_order: number;
      created_at: string;
      updated_at: string;
    }>("impact_metrics", "");

    return Response.json({ metrics: metrics || [] });
  } catch (error) {
    console.error("Failed to fetch impact metrics:", error);
    return Response.json(
      { error: "Failed to fetch impact metrics" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, label, valueText, numericValue, unit, category, metricYear, summary, isFeatured, sortOrder } = body;

    // Validate required fields
    if (!slug || !label || !valueText || !category) {
      return Response.json(
        { error: "Missing required fields: slug, label, valueText, category" },
        { status: 400 }
      );
    }

    // Validate category enum
    const validCategories = ["education", "healthcare", "sports", "cross_cutting"];
    if (!validCategories.includes(category)) {
      return Response.json(
        { error: `Category must be one of: ${validCategories.join(", ")}` },
        { status: 400 }
      );
    }

    const metric = await insertIntoSupabase("impact_metrics", {
      slug,
      label,
      value_text: valueText,
      numeric_value: numericValue ? parseFloat(numericValue) : null,
      unit: unit || "",
      category,
      metric_year: metricYear ? parseInt(metricYear) : null,
      summary: summary || "",
      is_featured: isFeatured || false,
      sort_order: sortOrder ? parseInt(sortOrder) : 0,
    });

    return Response.json(metric, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create impact metric:", error);
    
    if (error.message?.includes("duplicate key")) {
      return Response.json(
        { error: "Slug must be unique" },
        { status: 400 }
      );
    }

    return Response.json(
      { error: "Failed to create impact metric" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { slug, label, valueText, numericValue, unit, category, metricYear, summary, isFeatured, sortOrder } = body;

    if (!slug) {
      return Response.json({ error: "Slug is required" }, { status: 400 });
    }

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
