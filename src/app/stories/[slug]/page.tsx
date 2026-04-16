import { notFound } from "next/navigation";

import { ContentImage } from "@/components/content-image";
import { PageIntro } from "@/components/page-intro";
import { PageSection } from "@/components/page-section";
import { getStoryPostBySlug } from "@/lib/story-content";

type StoryPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

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
      <PageIntro
        label={post.category}
        title={post.title}
        body={post.excerpt}
        aside={`${post.authorName} • ${post.publishedAt}`}
      />

      <section className="section-image-banner">
        <ContentImage
          src={post.coverImagePath}
          alt={post.title}
          sizes="100vw"
          className="section-image-banner-card"
        />
      </section>

      <PageSection
        label="Story"
        title="Field reflections, progress, and the everyday shape of support."
      >
        <article className="reading-panel stories-feature-copy">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </article>
      </PageSection>
    </>
  );
}
