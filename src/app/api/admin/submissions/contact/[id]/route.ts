import { NextResponse, NextRequest } from "next/server";
import { updateSupabase, deleteFromSupabase } from "@/lib/supabase-rest";

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { status, notes } = body;

    // Validate status
    const validStatuses = ["new", "reviewed", "responded", "archived"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    // Update the submission
    const result = await updateSupabase(
      "contact_submissions",
      `id=eq.${id}`,
      {
        status,
        ...(notes && { notes }),
        updated_at: new Date().toISOString(),
      }
    );

    return NextResponse.json({
      success: true,
      message: "Contact submission updated",
      submission: result[0],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update submission";
    console.error("[Contact Submission PATCH]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params;

    // Delete the submission
    const result = await deleteFromSupabase(
      "contact_submissions",
      `id=eq.${id}`
    );

    return NextResponse.json({
      success: true,
      message: "Contact submission deleted",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete submission";
    console.error("[Contact Submission DELETE]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
