import { NextResponse, NextRequest } from "next/server";
import { readFromSupabase, insertIntoSupabase, updateSupabase, deleteFromSupabase } from "@/lib/supabase-rest";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const videos = await readFromSupabase<any[]>(
      "video_stories",
      "order=published_at.desc,created_at.desc"
    );
    return NextResponse.json({ videos: videos || [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load videos";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, title, summary, videoPath, thumbnailPath, durationSeconds, status } = body;

    if (!slug || !title || !videoPath) {
      return NextResponse.json(
        { error: "Slug, title, and videoPath are required" },
        { status: 400 }
      );
    }

    const validStatuses = ["draft", "published", "archived"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Status must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const inserted = await insertIntoSupabase("video_stories", {
      slug,
      title,
      summary: summary || "",
      video_path: videoPath,
      thumbnail_path: thumbnailPath || "",
      duration_seconds: durationSeconds || null,
      status: status || "draft",
      published_at: status === "published" ? new Date().toISOString() : null,
    });

    return NextResponse.json(inserted, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create video story:", error);
    if (error.message?.includes("duplicate")) {
      return NextResponse.json({ error: "Slug must be unique" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create video story" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { slug, title, summary, videoPath, thumbnailPath, durationSeconds, status } = body;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const updates: Record<string, any> = {};
    if (title) updates.title = title;
    if (summary !== undefined) updates.summary = summary;
    if (videoPath) updates.video_path = videoPath;
    if (thumbnailPath !== undefined) updates.thumbnail_path = thumbnailPath;
    if (durationSeconds !== undefined) updates.duration_seconds = durationSeconds;
    if (status) {
      const validStatuses = ["draft", "published", "archived"];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: `Status must be one of: ${validStatuses.join(", ")}` },
          { status: 400 }
        );
      }
      updates.status = status;
      updates.published_at = status === "published" ? new Date().toISOString() : null;
    }

    await updateSupabase("video_stories", `slug=eq.${slug}`, updates);
    const updated = await readFromSupabase<any[]>("video_stories", `slug=eq.${slug}`);
    return NextResponse.json(updated?.[0] || null);
  } catch (error) {
    console.error("Failed to update video story:", error);
    return NextResponse.json({ error: "Failed to update video story" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    await deleteFromSupabase("video_stories", `slug=eq.${slug}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete video story:", error);
    return NextResponse.json({ error: "Failed to delete video story" }, { status: 500 });
  }
}
