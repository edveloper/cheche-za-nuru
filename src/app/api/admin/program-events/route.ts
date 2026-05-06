import { NextResponse, NextRequest } from "next/server";
import { readFromSupabase, insertIntoSupabase, updateSupabase, deleteFromSupabase } from "@/lib/supabase-rest";

type ProgramEvent = {
  id: string;
  slug: string;
  title: string;
  program_type: "education" | "healthcare" | "sports" | "community";
  summary: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string | null;
  is_featured: boolean;
  status: "draft" | "scheduled" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
};

export async function GET() {
  try {
    const events = await readFromSupabase<ProgramEvent[]>(
      "program_events",
      "order=start_date.asc"
    );
    return NextResponse.json({ events });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load events";
    console.error("[Program Events GET]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, title, program_type, summary, description, location, start_date, end_date, is_featured, status } = body;

    // Validation
    if (!slug || !title || !program_type || !start_date) {
      return NextResponse.json(
        { error: "Slug, title, program_type, and start_date are required" },
        { status: 400 }
      );
    }

    const validTypes = ["education", "healthcare", "sports", "community"];
    if (!validTypes.includes(program_type)) {
      return NextResponse.json(
        { error: `Invalid program_type. Must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      );
    }

    const validStatuses = ["draft", "scheduled", "completed", "cancelled"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const result = await insertIntoSupabase("program_events", {
      slug,
      title,
      program_type,
      summary: summary || "",
      description: description || "",
      location: location || "",
      start_date,
      end_date: end_date || null,
      is_featured: is_featured === true,
      status: status || "draft",
    });

    return NextResponse.json({
      success: true,
      message: "Event created",
      event: result[0],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create event";
    console.error("[Program Events POST]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, title, program_type, summary, description, location, start_date, end_date, is_featured, status } = body;

    if (!slug || !title || !program_type) {
      return NextResponse.json(
        { error: "Slug, title, and program_type are required" },
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
    console.error("[Program Events PUT]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
