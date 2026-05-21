import { NextResponse, NextRequest } from "next/server";
import { updateSupabase, deleteFromSupabase } from "@/lib/supabase-rest";

export const dynamic = "force-dynamic";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const body = await request.json();
    const { title, program_type, summary, description, location, start_date, end_date, is_featured, status } = body;

    if (!title || !program_type) {
      return NextResponse.json(
        { error: "Title and program_type are required" },
        { status: 400 }
      );
    }

    const result = await updateSupabase(
      "program_events",
      `slug=eq.${slug}`,
      {
        title,
        program_type,
        summary: summary || "",
        description: description || "",
        location: location || "",
        start_date,
        end_date: end_date || null,
        is_featured: is_featured === true,
        status: status || "draft",
      }
    );

    return NextResponse.json({
      success: true,
      message: "Event updated",
      event: result[0],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update event";
    console.error("[Program Event PUT]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    const result = await deleteFromSupabase(
      "program_events",
      `slug=eq.${slug}`
    );

    return NextResponse.json({
      success: true,
      message: "Event deleted",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete event";
    console.error("[Program Event DELETE]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
