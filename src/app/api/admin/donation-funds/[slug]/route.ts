import { NextResponse, NextRequest } from "next/server";
import { updateSupabase, deleteFromSupabase } from "@/lib/supabase-rest";

export async function PUT(
  request: NextRequest,
  context: { params: { slug: string } }
) {
  try {
    const { slug } = await context.params;
    const body = await request.json();
    const { name, short_description, impact_summary, is_active, sort_order } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const result = await updateSupabase(
      "donation_funds",
      `slug=eq.${slug}`,
      {
        name,
        short_description: short_description || "",
        impact_summary: impact_summary || "",
        is_active: is_active !== false,
        sort_order: sort_order || 0,
      }
    );

    return NextResponse.json({
      success: true,
      message: "Donation fund updated",
      fund: result[0],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update donation fund";
    console.error("[Donation Fund PUT]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { slug: string } }
) {
  try {
    const { slug } = await context.params;

    const result = await deleteFromSupabase(
      "donation_funds",
      `slug=eq.${slug}`
    );

    return NextResponse.json({
      success: true,
      message: "Donation fund deleted",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete donation fund";
    console.error("[Donation Fund DELETE]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
