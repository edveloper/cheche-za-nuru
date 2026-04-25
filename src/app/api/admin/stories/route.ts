import { NextResponse } from "next/server";
import { readFromSupabase } from "@/lib/supabase-rest";

type BlogPostRecord = {
  slug: string;
  title: string;
  excerpt: string;
  cover_image_path: string;
  body_md: string;
  author_name: string;
  published_at: string | null;
};

export async function GET() {
  try {
    const posts = await readFromSupabase<BlogPostRecord[]>(
      "blog_posts",
      "select=slug,title,excerpt,cover_image_path,body_md,author_name,published_at&order=created_at.desc"
    );

    const stories = posts.map((post) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      body: post.body_md,
      coverImagePath: post.cover_image_path,
      authorName: post.author_name,
      category: "Story",
      publishedAt: post.published_at ?? "",
    }));

    return NextResponse.json({ stories });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load admin stories";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
