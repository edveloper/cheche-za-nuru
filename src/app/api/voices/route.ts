import { NextResponse } from "next/server";
import { insertIntoSupabase } from "@/lib/supabase-rest";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { display_name, role_label, location, quote, website } = body;

    // Honeypot — bots fill hidden fields, humans don't
    if (website) {
      return NextResponse.json({ success: true });
    }

    if (!display_name?.trim() || !quote?.trim()) {
      return NextResponse.json(
        { error: "Name and quote are required" },
        { status: 400 }
      );
    }

    if (quote.trim().length > 600) {
      return NextResponse.json(
        { error: "Quote must be 600 characters or fewer" },
        { status: 400 }
      );
    }

    await insertIntoSupabase("voice_submissions", {
      display_name: display_name.trim(),
      role_label: role_label?.trim() ?? "",
      location: location?.trim() ?? "",
      quote: quote.trim(),
      status: "pending",
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to submit";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
