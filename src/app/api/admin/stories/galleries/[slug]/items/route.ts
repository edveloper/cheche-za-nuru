import { NextResponse, NextRequest } from "next/server";
import {
  readFromSupabase,
  insertIntoSupabase,
  updateSupabase,
  deleteFromSupabase,
} from "@/lib/supabase-rest";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

async function getGalleryId(slug: string): Promise<string | null> {
  const rows = await readFromSupabase<{ id: string }[]>(
    "story_galleries",
    `slug=eq.${slug}&select=id`
  );
  return rows?.[0]?.id ?? null;
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const galleryId = await getGalleryId(slug);
    if (!galleryId) {
      return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
    }

    const items = await readFromSupabase<any[]>(
      "story_gallery_items",
      `gallery_id=eq.${galleryId}&order=sort_order.asc`
    );

    return NextResponse.json({ items: items || [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load items";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const galleryId = await getGalleryId(slug);
    if (!galleryId) {
      return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
    }

    const body = await request.json();
    const { image_path, caption, alt_text, sort_order } = body;

    if (!image_path) {
      return NextResponse.json({ error: "image_path is required" }, { status: 400 });
    }

    const inserted = await insertIntoSupabase("story_gallery_items", {
      gallery_id: galleryId,
      image_path,
      caption: caption ?? "",
      alt_text: alt_text ?? "",
      sort_order: sort_order ?? 0,
    });

    return NextResponse.json(inserted, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create item";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id query param is required" }, { status: 400 });
    }

    const galleryId = await getGalleryId(slug);
    if (!galleryId) {
      return NextResponse.json({ error: "Gallery not found" }, { status: 404 });
    }

    const body = await request.json();
    const updates: Record<string, unknown> = {};
    if (body.caption !== undefined) updates.caption = body.caption;
    if (body.alt_text !== undefined) updates.alt_text = body.alt_text;
    if (body.sort_order !== undefined) updates.sort_order = body.sort_order;

    await updateSupabase("story_gallery_items", `id=eq.${id}`, updates);
    const updated = await readFromSupabase<any[]>(
      "story_gallery_items",
      `id=eq.${id}`
    );
    return NextResponse.json(updated?.[0] ?? null);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update item";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    await params;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id query param is required" }, { status: 400 });
    }

    await deleteFromSupabase("story_gallery_items", `id=eq.${id}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete item";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
