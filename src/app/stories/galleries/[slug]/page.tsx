import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContentImage } from "@/components/content-image";
import { siteConfig } from "@/lib/site-config";
import { getStoryGalleryBySlug } from "@/lib/story-content";
import { toTitleCase } from "@/lib/title-case";

type StoryGalleryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: StoryGalleryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const gallery = await getStoryGalleryBySlug(slug);

  if (!gallery) {
    return {};
  }

  const path = `/stories/galleries/${gallery.slug}`;

  return {
    title: gallery.title,
    description: gallery.excerpt,
    alternates: { canonical: path },
    openGraph: {
      title: gallery.title,
      description: gallery.excerpt,
      url: path,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "article",
      ...(gallery.coverImagePath ? { images: [gallery.coverImagePath] } : {}),
    },
  };
}

export default async function StoryGalleryPage({ params }: StoryGalleryPageProps) {
  const { slug } = await params;
  const gallery = await getStoryGalleryBySlug(slug);

  if (!gallery) {
    notFound();
  }

  return (
    <article className="article article-wide">
      <header className="article-header">
        <p className="section-label">Photo Story</p>
        <h1>{toTitleCase(gallery.title)}</h1>
        {gallery.excerpt ? <p className="article-lede">{gallery.excerpt}</p> : null}
        {gallery.storyDate ? <p className="meta-line">{gallery.storyDate}</p> : null}
      </header>

      <div className="gallery-grid">
        {gallery.images.map((image, index) => (
          <figure key={`${image.src}-${index}`} className="gallery-figure">
            <ContentImage
              src={image.src}
              alt={image.alt}
              preload={index === 0}
              sizes="(max-width: 900px) 100vw, 50vw"
              className="gallery-figure-photo"
            />
            {image.caption ? <figcaption>{image.caption}</figcaption> : null}
          </figure>
        ))}
      </div>
    </article>
  );
}
