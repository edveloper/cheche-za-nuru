import { NextResponse, NextRequest } from "next/server";
import { updateSupabase, deleteFromSupabase } from "@/lib/supabase-rest";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { status, notes } = body;

    // Validate status
    const validStatuses = ["new", "contacted", "qualified", "in_progress", "closed"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    // Update the lead
    const result = await updateSupabase(
      "involvement_leads",
      `id=eq.${id}`,
      {
        status,
        ...(notes && { notes }),
        updated_at: new Date().toISOString(),
      }
    );

    return NextResponse.json({
      success: true,
      message: "Involvement lead updated",
      lead: result[0],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update lead";
    console.error("[Involvement Lead PATCH]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Delete the lead
    const result = await deleteFromSupabase(
      "involvement_leads",
      `id=eq.${id}`
    );

    return NextResponse.json({
      success: true,
      message: "Involvement lead deleted",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete lead";
    console.error("[Involvement Lead DELETE]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
