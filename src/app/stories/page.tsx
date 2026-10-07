import type { Metadata } from "next";
import Link from "next/link";

import { ContentImage } from "@/components/content-image";
import { CtaBand } from "@/components/cta-band";
import { PageIntro } from "@/components/page-intro";
import { PageSection } from "@/components/page-section";
import { SocialIcon } from "@/components/social-icon";
import { VoiceSubmitForm } from "@/components/voice-submit-form";
import { contactDetails, pageVisuals } from "@/data/site";
import { pageMetadata } from "@/lib/site-config";
import {
  getStoryGalleries,
  getStoryPosts,
  getVideoStories,
  getVoiceSnippets,
} from "@/lib/story-content";
import { toTitleCase } from "@/lib/title-case";

export const metadata: Metadata = pageMetadata({
  title: "Stories",
  description:
    "Updates, photo stories and voices from Cheche Za Nuru's education, health and sport programmes in Kenya.",
  path: "/stories",
});

export default async function StoriesPage() {
  const [posts, voices, galleries, videos] = await Promise.all([
    getStoryPosts(),
    getVoiceSnippets(),
    getStoryGalleries(),
    getVideoStories(),
  ]);

  const hasContent = posts.length || galleries.length || videos.length || voices.length;

  return (
    <>
      <PageIntro
        label="Stories"
        title="From the Field"
        body="Updates, photos and voices from our programmes, written by the people closest to them."
        photo={pageVisuals.stories}
      />

      {!hasContent ? (
        <section className="empty-state">
          <h2>The First Stories Are on Their Way</h2>
          <p>
            We&apos;d rather wait for real ones than fill this page with filler. Until then,
            the day-to-day lives on our socials.
          </p>
          <div className="social-link-row">
            {contactDetails.socials.map((social) => (
              <a
                key={social.label}
                className="social-pill"
                href={social.href}
                target="_blank"
                rel="noreferrer"
              >
                <span className="social-pill-icon" aria-hidden="true">
                  <SocialIcon platform={social.label} />
                </span>
                {social.label}
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {posts.length ? (
        <PageSection label="Updates" title="Latest From Our Programmes">
          <div className="blog-grid">
            {posts.map((story) => (
              <Link key={story.slug} href={`/stories/${story.slug}`} className="story-post-card">
                {story.coverImagePath ? (
                  <div className="story-post-cover">
                    <ContentImage
                      src={story.coverImagePath}
                      alt=""
                      sizes="(max-width: 780px) 100vw, 30vw"
                    />
                  </div>
                ) : null}
                <small className="meta-line">{story.publishedAt}</small>
                <h3>{toTitleCase(story.title)}</h3>
                <p>{story.excerpt}</p>
              </Link>
            ))}
          </div>
        </PageSection>
      ) : null}

      {galleries.length ? (
        <PageSection label="Photo Stories" title="In Pictures">
          <div className="blog-grid">
            {galleries.map((gallery) => (
              <Link
                key={gallery.slug}
                href={`/stories/galleries/${gallery.slug}`}
                className="story-post-card"
              >
                <div className="story-post-cover">
                  <ContentImage
                    src={gallery.coverImagePath}
                    alt=""
                    sizes="(max-width: 780px) 100vw, 30vw"
                  />
                </div>
                <small className="meta-line">
                  {[gallery.storyDate, `${gallery.images.length} photos`]
                    .filter(Boolean)
                    .join(" · ")}
                </small>
                <h3>{toTitleCase(gallery.title)}</h3>
                <p>{gallery.excerpt}</p>
              </Link>
            ))}
          </div>
        </PageSection>
      ) : null}

      {videos.length ? (
        <PageSection label="Video" title="Watch">
          <div className="blog-grid">
            {videos.map((video) => (
              <a
                key={video.slug}
                className="story-post-card"
                href={video.videoPath}
                target="_blank"
                rel="noreferrer"
              >
                {video.thumbnailPath ? (
                  <div className="story-post-cover">
                    <ContentImage
                      src={video.thumbnailPath}
                      alt=""
                      sizes="(max-width: 780px) 100vw, 30vw"
                    />
                  </div>
                ) : null}
                <small className="meta-line">{video.durationLabel}</small>
                <h3>{toTitleCase(video.title)}</h3>
                <p>{video.summary}</p>
              </a>
            ))}
          </div>
        </PageSection>
      ) : null}

      {voices.length ? (
        <PageSection label="Voices" title="In Their Words">
          <div className="voice-grid">
            {voices.map((voice) => (
              <figure key={`${voice.displayName}-${voice.quote}`} className="voice-card">
                <blockquote className="voice-quote">&ldquo;{voice.quote}&rdquo;</blockquote>
                <figcaption className="voice-meta">
                  <strong>{voice.displayName}</strong>
                  <span>{[voice.roleLabel, voice.location].filter(Boolean).join(", ")}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </PageSection>
      ) : null}

      <PageSection
        label="Share Your Story"
        title="Has Our Work Touched Your Life?"
        body="Tell us. With your permission, we may share it here."
      >
        <VoiceSubmitForm />
      </PageSection>

      <CtaBand
        heading="Help Write the Next One"
        body="Every story here starts with a fee paid, a clinic held or a season played."
      />
    </>
  );
}
