import { hasSupabaseConfig, readFromSupabase } from "@/lib/supabase-rest";

// Public pages only ever show content published through the admin. There is
// deliberately no hardcoded fallback: an empty section is better than an
// invented story.

export type StoryPost = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverImagePath: string;
  authorName: string;
  category: string;
  publishedAt: string;
  publishedAtIso: string | null;
};

export type VoiceSnippet = {
  displayName: string;
  roleLabel: string;
  location: string;
  quote: string;
};

export type StoryGalleryImage = {
  src: string;
  alt: string;
  caption: string;
};

export type StoryGallery = {
  slug: string;
  title: string;
  excerpt: string;
  storyDate: string;
  coverImagePath: string;
  layoutStyle: "editorial" | "mosaic" | "stacked";
  images: StoryGalleryImage[];
};

export type VideoStory = {
  slug: string;
  title: string;
  summary: string;
  videoPath: string;
  thumbnailPath: string;
  durationLabel: string;
};

type BlogPostRecord = {
  slug: string;
  title: string;
  excerpt: string;
  cover_image_path: string;
  body_md: string;
  author_name: string;
  published_at: string | null;
};

type VoiceSubmissionRecord = {
  display_name: string;
  role_label: string;
  location: string;
  quote: string;
  approved_at: string | null;
};

type StoryGalleryRecord = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  story_date: string | null;
  cover_image_path: string;
  layout_style: "editorial" | "mosaic" | "stacked";
};

type StoryGalleryItemRecord = {
  gallery_id: string;
  image_path: string;
  caption: string;
  alt_text: string;
  sort_order: number;
};

type VideoStoryRecord = {
  slug: string;
  title: string;
  summary: string;
  video_path: string;
  thumbnail_path: string;
  duration_seconds: number | null;
};

function resolveMediaPath(path: string, fallbackPath = "") {
  if (!path) {
    return fallbackPath;
  }

  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/")) {
    return path;
  }

  return `/${path}`;
}

function formatDate(value: string | null, options?: Intl.DateTimeFormatOptions) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", options).format(date);
}

function formatDuration(durationSeconds: number | null) {
  if (!durationSeconds || durationSeconds <= 0) {
    return "Video";
  }

  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export async function getStoryPosts(): Promise<StoryPost[]> {
  if (!hasSupabaseConfig()) {
    return [];
  }

  try {
    const posts = await readFromSupabase<BlogPostRecord[]>(
      "blog_posts",
      [
        "select=slug,title,excerpt,cover_image_path,body_md,author_name,published_at",
        "status=eq.published",
        "order=published_at.desc.nullslast",
      ].join("&"),
      { cache: "public" },
    );

    return posts.map((post) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      body: post.body_md || post.excerpt || "",
      coverImagePath: resolveMediaPath(post.cover_image_path),
      authorName: post.author_name || "Cheche Za Nuru",
      category: "Story",
      publishedAt: formatDate(post.published_at, {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      publishedAtIso: post.published_at,
    }));
  } catch (error) {
    console.error("[Story Content] Error fetching story posts:", error);
    return [];
  }
}

export async function getVoiceSnippets(): Promise<VoiceSnippet[]> {
  if (!hasSupabaseConfig()) {
    return [];
  }

  try {
    const voices = await readFromSupabase<VoiceSubmissionRecord[]>(
      "voice_submissions",
      [
        "select=display_name,role_label,location,quote,approved_at",
        "status=eq.approved",
        "order=approved_at.desc.nullslast",
      ].join("&"),
      { cache: "public" },
    );

    return voices.map((voice) => ({
      displayName: voice.display_name,
      roleLabel: voice.role_label,
      location: voice.location,
      quote: voice.quote,
    }));
  } catch (error) {
    console.error("[Story Content] Error fetching voices:", error);
    return [];
  }
}

export async function getStoryGalleries(): Promise<StoryGallery[]> {
  if (!hasSupabaseConfig()) {
    return [];
  }

  try {
    const galleries = await readFromSupabase<StoryGalleryRecord[]>(
      "story_galleries",
      [
        "select=id,slug,title,excerpt,story_date,cover_image_path,layout_style",
        "status=eq.published",
        "order=published_at.desc.nullslast",
      ].join("&"),
      { cache: "public" },
    );

    if (!galleries.length) {
      return [];
    }

    const galleryIds = galleries.map((gallery) => gallery.id).join(",");
    const items = await readFromSupabase<StoryGalleryItemRecord[]>(
      "story_gallery_items",
      [
        "select=gallery_id,image_path,caption,alt_text,sort_order",
        `gallery_id=in.(${galleryIds})`,
        "order=sort_order.asc",
      ].join("&"),
      { cache: "public" },
    );

    return galleries
      .map((gallery) => {
        const images = items
          .filter((item) => item.gallery_id === gallery.id && item.image_path)
          .map((item) => ({
            src: resolveMediaPath(item.image_path),
            alt: item.alt_text || gallery.title,
            caption: item.caption,
          }));

        return {
          slug: gallery.slug,
          title: gallery.title,
          excerpt: gallery.excerpt,
          storyDate: formatDate(gallery.story_date, {
            month: "long",
            year: "numeric",
          }),
          coverImagePath: resolveMediaPath(gallery.cover_image_path, images[0]?.src ?? ""),
          layoutStyle: gallery.layout_style,
          images,
        } satisfies StoryGallery;
      })
      .filter((gallery) => gallery.images.length > 0);
  } catch (error) {
    console.error("[Story Content] Error fetching galleries:", error);
    return [];
  }
}

export async function getVideoStories(): Promise<VideoStory[]> {
  if (!hasSupabaseConfig()) {
    return [];
  }

  try {
    const videos = await readFromSupabase<VideoStoryRecord[]>(
      "video_stories",
      [
        "select=slug,title,summary,video_path,thumbnail_path,duration_seconds",
        "status=eq.published",
        "order=published_at.desc.nullslast",
      ].join("&"),
      { cache: "public" },
    );

    return videos
      .filter((video) => video.video_path)
      .map((video) => ({
        slug: video.slug,
        title: video.title,
        summary: video.summary,
        videoPath: resolveMediaPath(video.video_path),
        thumbnailPath: resolveMediaPath(video.thumbnail_path),
        durationLabel: formatDuration(video.duration_seconds),
      }));
  } catch (error) {
    console.error("[Story Content] Error fetching videos:", error);
    return [];
  }
}

export async function getStoryPostBySlug(slug: string) {
  const posts = await getStoryPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}

export async function getStoryGalleryBySlug(slug: string) {
  const galleries = await getStoryGalleries();
  return galleries.find((gallery) => gallery.slug === slug) ?? null;
}
