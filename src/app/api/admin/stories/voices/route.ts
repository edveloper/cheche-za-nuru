import { NextResponse } from "next/server";
import { readFromSupabase } from "@/lib/supabase-rest";

export async function GET() {
  try {
    const voices = await readFromSupabase<any[]>(
      "voice_submissions",
      "select=id,display_name,role_label,location,quote,status,created_at&order=created_at.desc"
    );

    return NextResponse.json({ voices });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load voices";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
