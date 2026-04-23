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
    const authorName = formData.get("authorName") as string;
    const isEditing = formData.get("isEditing") === "true";
    const slug = formData.get("slug") as string;
    const imageFile = formData.get("coverImageFile") as File | null;

    console.log("[Story Save] Starting story save:", { title, isEditing, hasImage: !!imageFile });

    // Validation
    if (!title || !excerpt || !body) {
      const validationError = "Title, excerpt, and body are required";
      console.error("[Story Save] Validation error:", validationError);
      return { error: validationError };
    }

    let coverImagePath = "";

    // Handle image upload
    if (imageFile && imageFile.size > 0) {
      console.log("[Story Save] Uploading image:", { name: imageFile.name, size: imageFile.size });

      const fileName = `${Date.now()}-${title.toLowerCase().replace(/\s+/g, "-")}.jpg`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("story-covers")
        .upload(fileName, imageFile, {
          upsert: false,
          contentType: imageFile.type,
        });

      if (uploadError) {
        const uploadErrorMsg = `Image upload failed: ${uploadError.message}`;
        console.error("[Story Save] Upload error:", uploadErrorMsg, uploadError);
        return { error: uploadErrorMsg };
      }

      console.log("[Story Save] Image uploaded successfully:", uploadData.path);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("story-covers")
        .getPublicUrl(uploadData.path);

      coverImagePath = urlData.publicUrl;
      console.log("[Story Save] Image public URL:", coverImagePath);
    } else {
      console.log("[Story Save] No image provided");
    }

    // Generate slug from title if creating new story
    const storySlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    if (isEditing) {
      console.log("[Story Save] Updating existing story:", storySlug);

      // Update existing story
      const { error: updateError } = await supabase
        .from("blog_posts")
        .update({
          title,
          excerpt,
          body_md: body,
          author_name: authorName,
          ...(coverImagePath && { cover_image_path: coverImagePath }),
          updated_at: new Date().toISOString(),
        })
        .eq("slug", storySlug);

      if (updateError) {
        const updateErrorMsg = `Failed to update story: ${updateError.message}`;
        console.error("[Story Save] Update error:", updateErrorMsg, updateError);
        return { error: updateErrorMsg };
      }

      console.log("[Story Save] Story updated successfully");
    } else {
      console.log("[Story Save] Creating new story:", storySlug);

      const insertPayload = {
        slug: storySlug,
        title,
        excerpt,
        body_md: body,
        cover_image_path: coverImagePath || null,
        author_name: authorName,
        status: "published",
        published_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };

      console.log("[Story Save] Insert payload:", insertPayload);

      const { error: insertError } = await supabase
        .from("blog_posts")
        .insert(insertPayload);

      if (insertError) {
        const insertErrorMsg = `Failed to create story: ${insertError.message}`;
        console.error("[Story Save] Insert error:", insertErrorMsg, insertError);
        return { error: insertErrorMsg };
      }

      console.log("[Story Save] Story created successfully");
    }

    console.log("[Story Save] Redirecting to /admin/stories");
    redirect("/admin/stories");
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("[Story Save] Unhandled error:", errorMsg, error);
    return { error: `An error occurred: ${errorMsg}` };
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
