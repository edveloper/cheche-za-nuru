import { NextResponse } from "next/server";
import { readFromSupabase, insertIntoSupabase } from "@/lib/supabase-rest";

export async function GET() {
  try {
    const videos = await readFromSupabase<any[]>(
      "video_stories",
      "select=id,slug,title,summary,video_path,thumbnail_path,duration_seconds,status,published_at&order=created_at.desc"
    );
    return NextResponse.json({ videos });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load videos";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, title, summary = "", video_path, thumbnail_path = "", duration_seconds = null, status = "draft", published_at = null } = body;

    if (!slug || !title || !video_path) {
      return NextResponse.json({ error: "slug, title and video_path are required" }, { status: 400 });
    }

    const inserted = await insertIntoSupabase("video_stories", {
      slug,
      title,
      summary,
      video_path,
      thumbnail_path,
      duration_seconds,
      status,
      published_at,
      created_at: new Date().toISOString(),
    });

    const created = Array.isArray(inserted) ? inserted[0] : inserted;

    return NextResponse.json({ ok: true, video: created });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create video";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
