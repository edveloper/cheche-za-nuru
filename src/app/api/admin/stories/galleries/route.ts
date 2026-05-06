import { NextResponse, NextRequest } from "next/server";
import { readFromSupabase, insertIntoSupabase, updateSupabase, deleteFromSupabase } from "@/lib/supabase-rest";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const galleries = await readFromSupabase<any[]>(
      "story_galleries",
      "order=published_at.desc,created_at.desc"
    );
    return NextResponse.json({ galleries: galleries || [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load galleries";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, title, excerpt, storyDate, coverImagePath, layoutStyle, status } = body;

    if (!slug || !title) {
      return NextResponse.json({ error: "Slug and title are required" }, { status: 400 });
    }

    const validLayouts = ["editorial", "mosaic", "stacked"];
    if (layoutStyle && !validLayouts.includes(layoutStyle)) {
      return NextResponse.json(
        { error: `Layout style must be one of: ${validLayouts.join(", ")}` },
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

    const inserted = await insertIntoSupabase("story_galleries", {
      slug,
      title,
      excerpt: excerpt || "",
      story_date: storyDate || null,
      cover_image_path: coverImagePath || "",
      layout_style: layoutStyle || "editorial",
      status: status || "draft",
      published_at: status === "published" ? new Date().toISOString() : null,
    });

    return NextResponse.json(inserted, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create photo gallery:", error);
    if (error.message?.includes("duplicate")) {
      return NextResponse.json({ error: "Slug must be unique" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create photo gallery" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { slug, title, excerpt, storyDate, coverImagePath, layoutStyle, status } = body;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const updates: Record<string, any> = {};
    if (title) updates.title = title;
    if (excerpt !== undefined) updates.excerpt = excerpt;
    if (storyDate !== undefined) updates.story_date = storyDate;
    if (coverImagePath !== undefined) updates.cover_image_path = coverImagePath;
    if (layoutStyle) updates.layout_style = layoutStyle;
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

    await updateSupabase("story_galleries", { slug }, updates);
    const updated = await readFromSupabase("story_galleries", `slug=eq.${slug}`);
    return NextResponse.json(updated?.[0] || null);
  } catch (error) {
    console.error("Failed to update photo gallery:", error);
    return NextResponse.json({ error: "Failed to update photo gallery" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    await deleteFromSupabase("story_galleries", { slug });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete photo gallery:", error);
    return NextResponse.json({ error: "Failed to delete photo gallery" }, { status: 500 });
  }
}
