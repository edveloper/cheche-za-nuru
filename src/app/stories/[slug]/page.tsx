import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContentImage } from "@/components/content-image";
import { CtaBand } from "@/components/cta-band";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import { getStoryPostBySlug } from "@/lib/story-content";
import { toTitleCase } from "@/lib/title-case";

type StoryPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: StoryPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getStoryPostBySlug(slug);

  if (!post) {
    return {};
  }

  const path = `/stories/${post.slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: path },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: path,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "article",
      publishedTime: post.publishedAtIso ?? undefined,
      ...(post.coverImagePath ? { images: [post.coverImagePath] } : {}),
    },
  };
}

export default async function StoryPostPage({ params }: StoryPostPageProps) {
  const { slug } = await params;
  const post = await getStoryPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const paragraphs = post.body
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAtIso ?? undefined,
          author: { "@type": "Person", name: post.authorName },
          publisher: {
            "@type": "NGO",
            name: siteConfig.name,
            logo: absoluteUrl(siteConfig.logoPath),
          },
          image: post.coverImagePath ? absoluteUrl(post.coverImagePath) : undefined,
          mainEntityOfPage: absoluteUrl(`/stories/${post.slug}`),
        }}
      />

      <article className="article">
        <header className="article-header">
          <p className="section-label">Story</p>
          <h1>{toTitleCase(post.title)}</h1>
          <p className="article-lede">{post.excerpt}</p>
          <p className="meta-line">
            {[post.authorName, post.publishedAt].filter(Boolean).join(" · ")}
          </p>
        </header>

        {post.coverImagePath ? (
          <ContentImage
            src={post.coverImagePath}
            alt=""
            preload
            sizes="(max-width: 900px) 100vw, 900px"
            className="article-cover"
          />
        ) : null}

        <div className="article-body">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>

      <CtaBand
        heading="Help Write the Next One"
        body="Every story here starts with a fee paid, a clinic held or a season played."
      />
    </>
  );
}
