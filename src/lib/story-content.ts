import {
  featuredStory,
  stories as fallbackStories,
  storyGalleries as fallbackStoryGalleries,
  videoHighlights as fallbackVideoHighlights,
  voiceSnippets as fallbackVoiceSnippets,
} from "@/data/site";
import { hasSupabaseConfig, readFromSupabase } from "@/lib/supabase-rest";

export type StoryPost = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverImagePath: string;
  authorName: string;
  category: string;
  publishedAt: string;
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

const fallbackStoryBodies = new Map<string, string>([
  [
    "50 new scholarships awarded in Kibera and Mathare",
    "This scholarship intake reflects the kind of support that changes the rhythm of daily life for learners and caregivers.\n\nWhen fees, supplies, and encouragement come together, children can remain present in school with greater stability and less uncertainty.\n\nThe deeper impact is not only academic. It is the return of confidence, routine, and the feeling that progress is still possible.",
  ],
  [
    "Mobile clinic reaches 800 families in Turkana County",
    "The outreach mission brought consultations, immunisation support, and practical care closer to families who often have to travel too far for dependable services.\n\nMoments like these matter because they shorten the distance between need and response.\n\nThey also create room for trust, follow-up, and stronger relationships between communities and the people working alongside them.",
  ],
  [
    "Rising Stars League opens its biggest season yet",
    "The opening of a larger season means more children and young people are stepping into structured sport, shared discipline, and a stronger sense of belonging.\n\nSport is part of the foundation's wider work because teamwork, rhythm, and encouragement often become part of how confidence grows.\n\nA strong season is therefore not only about competition. It is about identity, routine, and possibility taking shape together.",
  ],
]);

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

function getFallbackStoryPosts(): StoryPost[] {
  return fallbackStories.map((story, index) => ({
    slug: slugify(story.title),
    title: story.title,
    excerpt: story.summary,
    body:
      fallbackStoryBodies.get(story.title) ??
      `${story.summary}\n\n${featuredStory.detail}`,
    coverImagePath:
      fallbackStoryGalleries[index]?.images[0]?.src ?? fallbackStoryGalleries[0]!.images[0]!.src,
    authorName: "Cheche Za Nuru",
    category: story.category,
    publishedAt: story.date,
  }));
}

function getFallbackVoices(): VoiceSnippet[] {
  return fallbackVoiceSnippets.map((voice) => ({
    displayName: voice.name,
    roleLabel: voice.role,
    location: "",
    quote: voice.quote,
  }));
}

function getFallbackGalleries(): StoryGallery[] {
  return fallbackStoryGalleries.map((gallery, index) => ({
    slug: `photo-story-${index + 1}-${slugify(gallery.title)}`,
    title: gallery.title,
    excerpt: gallery.intro,
    storyDate: gallery.date,
    coverImagePath: gallery.images[0]!.src,
    layoutStyle: index % 2 === 0 ? "editorial" : "stacked",
    images: gallery.images.map((image) => ({
      src: image.src,
      alt: image.alt,
      caption: image.caption,
    })),
  }));
}

function getFallbackVideos(): VideoStory[] {
  return fallbackVideoHighlights.map((video, index) => ({
    slug: `${slugify(video.title)}-${index + 1}`,
    title: video.title,
    summary: video.summary,
    videoPath: "",
    thumbnailPath:
      fallbackStoryGalleries[index]?.images[0]?.src ?? fallbackStoryGalleries[0]!.images[0]!.src,
    durationLabel: video.duration,
  }));
}

export async function getStoryPosts() {
  const fallback = getFallbackStoryPosts();
  if (!hasSupabaseConfig()) {
    return fallback;
  }

  try {
    const posts = await readFromSupabase<BlogPostRecord[]>(
      "blog_posts",
      [
        "select=slug,title,excerpt,cover_image_path,body_md,author_name,published_at",
        "status=eq.published",
        "order=published_at.desc.nullslast",
      ].join("&"),
    );

    if (!posts.length) {
      return fallback;
    }

    return posts.map((post, index) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      body: post.body_md || post.excerpt || fallback[index]?.body || featuredStory.detail,
      coverImagePath: resolveMediaPath(
        post.cover_image_path,
        fallback[index]?.coverImagePath ?? fallback[0]!.coverImagePath,
      ),
      authorName: post.author_name || "Cheche Za Nuru",
      category: "Story",
      publishedAt:
        formatDate(post.published_at, {
          month: "long",
          day: "numeric",
          year: "numeric",
        }) || fallback[index]?.publishedAt || "",
    }));
  } catch {
    return fallback;
  }
}

export async function getVoiceSnippets() {
  const fallback = getFallbackVoices();
  if (!hasSupabaseConfig()) {
    return fallback;
  }

  try {
    const voices = await readFromSupabase<VoiceSubmissionRecord[]>(
      "voice_submissions",
      [
        "select=display_name,role_label,location,quote,approved_at",
        "status=eq.approved",
        "order=approved_at.desc.nullslast",
      ].join("&"),
    );

    if (!voices.length) {
      return fallback;
    }

    return voices.map((voice) => ({
      displayName: voice.display_name,
      roleLabel: voice.role_label,
      location: voice.location,
      quote: voice.quote,
    }));
  } catch {
    return fallback;
  }
}

export async function getStoryGalleries() {
  const fallback = getFallbackGalleries();
  if (!hasSupabaseConfig()) {
    return fallback;
  }

  try {
    const galleries = await readFromSupabase<StoryGalleryRecord[]>(
      "story_galleries",
      [
        "select=id,slug,title,excerpt,story_date,cover_image_path,layout_style",
        "status=eq.published",
        "order=published_at.desc.nullslast",
      ].join("&"),
    );

    if (!galleries.length) {
      return fallback;
    }

    const galleryIds = galleries.map((gallery) => gallery.id).join(",");
    const items = galleryIds
      ? await readFromSupabase<StoryGalleryItemRecord[]>(
          "story_gallery_items",
          [
            "select=gallery_id,image_path,caption,alt_text,sort_order",
            `gallery_id=in.(${galleryIds})`,
            "order=sort_order.asc",
          ].join("&"),
        )
      : [];

    return galleries.map((gallery, index) => {
      const galleryItems = items
        .filter((item) => item.gallery_id === gallery.id)
        .map((item) => ({
          src: resolveMediaPath(
            item.image_path,
            fallback[index]?.images[0]?.src ?? fallback[0]!.images[0]!.src,
          ),
          alt: item.alt_text || gallery.title,
          caption: item.caption,
        }));

      const fallbackImages = fallback[index]?.images ?? fallback[0]!.images;

      return {
        slug: gallery.slug,
        title: gallery.title,
        excerpt: gallery.excerpt,
        storyDate:
          formatDate(gallery.story_date, {
            month: "long",
            year: "numeric",
          }) || fallback[index]?.storyDate || "",
        coverImagePath: resolveMediaPath(
          gallery.cover_image_path,
          fallback[index]?.coverImagePath ?? fallback[0]!.coverImagePath,
        ),
        layoutStyle: gallery.layout_style,
        images: galleryItems.length ? galleryItems : fallbackImages,
      } satisfies StoryGallery;
    });
  } catch {
    return fallback;
  }
}

export async function getVideoStories() {
  const fallback = getFallbackVideos();
  if (!hasSupabaseConfig()) {
    return fallback;
  }

  try {
    const videos = await readFromSupabase<VideoStoryRecord[]>(
      "video_stories",
      [
        "select=slug,title,summary,video_path,thumbnail_path,duration_seconds",
        "status=eq.published",
        "order=published_at.desc.nullslast",
      ].join("&"),
    );

    if (!videos.length) {
      return fallback;
    }

    return videos.map((video, index) => ({
      slug: video.slug,
      title: video.title,
      summary: video.summary,
      videoPath: resolveMediaPath(video.video_path),
      thumbnailPath: resolveMediaPath(
        video.thumbnail_path,
        fallback[index]?.thumbnailPath ?? fallback[0]!.thumbnailPath,
      ),
      durationLabel: formatDuration(video.duration_seconds),
    }));
  } catch {
    return fallback;
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
