import { NextResponse } from "next/server";
import { updateSupabase } from "@/lib/supabase-rest";

export async function PATCH(request: Request, context: any) {
  try {
    const { params } = context || {};
    const body = await request.json();
    const status = body.status as string;
    if (!status || (status !== "approved" && status !== "rejected")) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const payload: Record<string, unknown> = { status };
    if (status === "approved") payload.approved_at = new Date().toISOString();
    if (status === "rejected") payload.approved_at = null;

    const updated = await updateSupabase("voice_submissions", `id=eq.${params.id}`, payload);

    return NextResponse.json({ ok: true, updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update voice";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
