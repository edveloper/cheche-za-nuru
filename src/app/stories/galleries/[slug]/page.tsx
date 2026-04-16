import { notFound } from "next/navigation";

import { ContentImage } from "@/components/content-image";
import { PageIntro } from "@/components/page-intro";
import { PageSection } from "@/components/page-section";
import { getStoryGalleryBySlug } from "@/lib/story-content";

type StoryGalleryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function StoryGalleryPage({ params }: StoryGalleryPageProps) {
  const { slug } = await params;
  const gallery = await getStoryGalleryBySlug(slug);

  if (!gallery) {
    notFound();
  }

  return (
    <>
      <PageIntro
        label="Photo Story"
        title={gallery.title}
        body={gallery.excerpt}
        aside={gallery.storyDate}
      />

      <section className="section-image-banner">
        <ContentImage
          src={gallery.coverImagePath}
          alt={gallery.title}
          sizes="100vw"
          className="section-image-banner-card"
        />
      </section>

      <PageSection
        label="Gallery"
        title="Images can hold context, emotion, and atmosphere at the same time."
      >
        <div className="gallery-collage">
          {gallery.images.map((image, index) => (
            <figure
              key={`${image.src}-${index}`}
              className={index === 0 ? "gallery-collage-card gallery-collage-card-large" : "gallery-collage-card"}
            >
              <ContentImage
                src={image.src}
                alt={image.alt}
                sizes="(max-width: 900px) 100vw, 30vw"
              />
              <figcaption>{image.caption}</figcaption>
            </figure>
          ))}
        </div>
      </PageSection>
    </>
  );
}
