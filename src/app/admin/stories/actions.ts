"use server";

export async function createStoryAction(formData: FormData) {
  // TODO: Implement story creation
  console.log("Creating story...", formData);
  return { success: true };
}

export async function deleteStoryAction(slug: string) {
  // TODO: Implement story deletion
  console.log("Deleting story:", slug);
  return { success: true };
}
