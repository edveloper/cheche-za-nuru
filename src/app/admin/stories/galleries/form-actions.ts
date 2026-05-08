"use server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function savePhotoGalleryAction(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean } | null> {
  try {
    const title = formData.get("title") as string;
    const excerpt = formData.get("excerpt") as string;
    const slug = formData.get("slug") as string;
    const storyDate = formData.get("storyDate") as string;
    const layoutStyle = formData.get("layoutStyle") as string;
    const status = formData.get("status") as string;
    const isEditing = formData.get("isEditing") === "true";

    if (!title || !slug) {
      return { error: "Title and slug are required" };
    }

    if (isEditing) {
      // Update existing gallery
      const { error } = await supabase
        .from("story_galleries")
        .update({
          title,
          excerpt: excerpt || "",
          story_date: storyDate || null,
          layout_style: layoutStyle || "editorial",
          status: status || "draft",
          updated_at: new Date().toISOString(),
        })
        .eq("slug", slug);

      if (error) {
        console.error("[Gallery Update Error]", error);
        return { error: `Failed to update gallery: ${error.message}` };
      }

      return { success: true };
    } else {
      // Create new gallery
      const { error } = await supabase
        .from("story_galleries")
        .insert({
          slug,
          title,
          excerpt: excerpt || "",
          story_date: storyDate || null,
          layout_style: layoutStyle || "editorial",
          status: status || "draft",
        });

      if (error) {
        console.error("[Gallery Create Error]", error);
        if (error.message?.includes("duplicate")) {
          return { error: "A gallery with this slug already exists" };
        }
        return { error: `Failed to create gallery: ${error.message}` };
      }

      return { success: true };
    }
  } catch (error) {
    console.error("[Gallery Save Error]", error);
    return { error: "An unexpected error occurred while saving the gallery" };
  }
}

export async function deletePhotoGalleryAction(slug: string): Promise<void> {
  try {
    const { error } = await supabase
      .from("story_galleries")
      .delete()
      .eq("slug", slug);

    if (error) {
      console.error("[Gallery Delete Error]", error);
      throw new Error(`Failed to delete gallery: ${error.message}`);
    }
  } catch (error) {
    console.error("[Gallery Delete Error]", error);
    throw error;
  }
}
