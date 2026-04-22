import { NextResponse } from "next/server";
import { getStoryPosts } from "@/lib/story-content";

export async function GET() {
  try {
    const stories = await getStoryPosts();
    return NextResponse.json({ stories });
  } catch (error) {
    console.error("Failed to fetch stories:", error);
    return NextResponse.json(
      { error: "Failed to fetch stories" },
      { status: 500 }
    );
  }
}
