import { NextResponse } from "next/server";
import { getImpactMetrics } from "@/lib/impact-content";

export async function GET() {
  try {
    const metrics = await getImpactMetrics();
    return NextResponse.json({ metrics });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load metrics";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
