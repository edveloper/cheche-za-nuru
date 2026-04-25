import { NextResponse } from "next/server";
import { getProgramEvents } from "@/lib/program-content";

export async function GET() {
  try {
    const events = await getProgramEvents({ includePast: false });
    return NextResponse.json({ events });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load events";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
