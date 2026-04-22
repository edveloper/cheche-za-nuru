"use server";

import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function saveStoryAction(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean } | null> {
  try {
    const title = formData.get("title") as string;
    const excerpt = formData.get("excerpt") as string;
    const body = formData.get("body") as string;
    const category = formData.get("category") as string;
    const authorName = formData.get("authorName") as string;
    const isEditing = formData.get("isEditing") === "true";
    const slug = formData.get("slug") as string;
    const imageFile = formData.get("coverImageFile") as File | null;

    // Validation
    if (!title || !excerpt || !body) {
      return { error: "Title, excerpt, and body are required" };
    }

    let coverImagePath = "";

    // Handle image upload
    if (imageFile && imageFile.size > 0) {
      const fileName = `${Date.now()}-${title.toLowerCase().replace(/\s+/g, "-")}.jpg`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("story-covers")
        .upload(fileName, imageFile, {
          upsert: false,
          contentType: imageFile.type,
        });

      if (uploadError) {
        console.error("Image upload error:", uploadError);
        return { error: "Failed to upload image" };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("story-covers")
        .getPublicUrl(uploadData.path);

      coverImagePath = urlData.publicUrl;
    }

    // Generate slug from title if creating new story
    const storySlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    if (isEditing) {
      // Update existing story
      const { error: updateError } = await supabase
        .from("blog_posts")
        .update({
          title,
          excerpt,
          body_md: body,
          category,
          author_name: authorName,
          ...(coverImagePath && { cover_image_path: coverImagePath }),
          updated_at: new Date().toISOString(),
        })
        .eq("slug", storySlug);

      if (updateError) {
        console.error("Update error:", updateError);
        return { error: "Failed to update story" };
      }
    } else {
      // Create new story
      const { error: insertError } = await supabase.from("blog_posts").insert({
        slug: storySlug,
        title,
        excerpt,
        body_md: body,
        cover_image_path: coverImagePath,
        author_name: authorName,
        category,
        status: "published",
        published_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      });

      if (insertError) {
        console.error("Insert error:", insertError);
        return { error: "Failed to create story" };
      }
    }

    redirect("/admin/stories");
  } catch (error) {
    console.error("Error saving story:", error);
    return { error: "An error occurred while saving the story" };
  }
}

export async function deleteStoryAction(slug: string): Promise<void> {
  try {
    const { error } = await supabase.from("blog_posts").delete().eq("slug", slug);

    if (error) {
      console.error("Delete error:", error);
      throw new Error("Failed to delete story");
    }
  } catch (error) {
    console.error("Error deleting story:", error);
    throw error;
  }
}
