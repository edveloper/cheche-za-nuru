import Link from "next/link";

import { ContentImage } from "@/components/content-image";
import { PageIntro } from "@/components/page-intro";
import { PageSection } from "@/components/page-section";
import {
  pageVisuals,
  storiesIntro,
  storyThemes,
} from "@/data/site";
import {
  getStoryGalleries,
  getStoryPosts,
  getVideoStories,
  getVoiceSnippets,
} from "@/lib/story-content";

export default async function StoriesPage() {
  const [posts, voiceSnippets, storyGalleries, videoHighlights] = await Promise.all([
    getStoryPosts(),
    getVoiceSnippets(),
    getStoryGalleries(),
    getVideoStories(),
  ]);

  const featuredStory = posts[0] ?? null;
  const recentStories = posts.slice(1).length ? posts.slice(1) : posts;

  return (
    <>
      <PageIntro
        label="Stories"
        title="Stories from the heart of the work."
        body="We share stories so the work remains human, recognizable, and close to the people whose lives give it meaning."
        aside="Here is where updates, voices, blog-style reflections, galleries, and future video stories can live together without losing warmth."
      />

      <section className="section-image-banner">
        <ContentImage
          src={pageVisuals.stories.src}
          alt={pageVisuals.stories.alt}
          sizes="100vw"
          className="section-image-banner-card"
        />
      </section>

      <PageSection
        label="Why Stories Matter"
        title="Stories help keep the work personal, visible, and emotionally honest."
      >
        <div className="reading-grid reading-grid-balanced">
          {storiesIntro.map((item) => (
            <article key={item} className="reading-card">
              <p>{item}</p>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection
        label="Featured Story"
        title={featuredStory?.title ?? "Stories from the work"}
        body={featuredStory?.excerpt ?? "Updates from the work will be featured here as they are published."}
      >
        {featuredStory ? (
          <div className="stories-lead-grid">
            <article className="reading-panel stories-feature-copy">
              <p className="card-label">{featuredStory.category}</p>
              <p>{featuredStory.body.split("\n\n")[0]}</p>
              <Link className="text-link" href={`/stories/${featuredStory.slug}`}>
                Read featured story
              </Link>
            </article>
            <ContentImage
              src={featuredStory.coverImagePath}
              alt={featuredStory.title}
              sizes="(max-width: 900px) 100vw, 44vw"
              className="stories-feature-visual"
            />
          </div>
        ) : null}
      </PageSection>

      <PageSection
        label="Voices"
        title="Short voices often hold the feeling of the work more clearly than a long report."
      >
        <div className="voice-grid">
          {voiceSnippets.map((voice) => (
            <article key={voice.name} className="voice-card">
              <p className="voice-quote">&ldquo;{voice.quote}&rdquo;</p>
              <div className="voice-meta">
                <strong>{voice.name}</strong>
                <span>{voice.role}</span>
              </div>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection
        label="Recent Stories"
        title="Scholarships, outreach, and youth development continue to shape what we share."
      >
        <div className="blog-grid">
          {recentStories.map((story) => (
            <article key={story.slug} className="story-post-card">
              <p className="card-label">{story.category}</p>
              <small className="meta-line">{story.publishedAt}</small>
              <h3>{story.title}</h3>
              <p>{story.excerpt}</p>
              <Link className="text-link" href={`/stories/${story.slug}`}>
                Read more
              </Link>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection
        label="Photo Stories"
        title="A gallery can carry atmosphere, memory, and movement in a way plain updates cannot."
      >
        <div className="stacked-grid">
          {storyGalleries.map((gallery, index) => (
            <article key={gallery.slug} className="gallery-story-grid">
              <div className="gallery-story-copy">
                <p className="card-label">{gallery.storyDate}</p>
                <h3>{gallery.title}</h3>
                <p>{gallery.excerpt}</p>
                <Link className="text-link" href={`/stories/galleries/${gallery.slug}`}>
                  Open gallery
                </Link>
              </div>
              <div className={index % 2 === 0 ? "gallery-collage" : "gallery-collage gallery-collage-alt"}>
                {gallery.images.map((image, imageIndex) => (
                  <figure
                    key={image.src}
                    className={imageIndex === 0 ? "gallery-collage-card gallery-collage-card-large" : "gallery-collage-card"}
                  >
                    <ContentImage
                      src={image.src}
                      alt={image.alt}
                      sizes="(max-width: 900px) 100vw, 24vw"
                    />
                    <figcaption>{image.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection
        label="Video Stories"
        title="Video can hold voice, motion, and environment in a different register."
      >
        <div className="three-column-grid">
          {videoHighlights.map((video) => (
            <article key={video.title} className="video-story-card">
              <div className="video-story-screen">
                {video.thumbnailPath ? (
                  <ContentImage
                    src={video.thumbnailPath}
                    alt={video.title}
                    sizes="(max-width: 900px) 100vw, 30vw"
                    className="video-story-thumbnail"
                  />
                ) : null}
                <span className="video-story-play" aria-hidden="true">
                  Play
                </span>
              </div>
              <p className="card-label">{video.durationLabel}</p>
              <h3>{video.title}</h3>
              <p>{video.summary}</p>
              {video.videoPath ? (
                <a
                  className="text-link"
                  href={video.videoPath}
                  target="_blank"
                  rel="noreferrer"
                >
                  Watch video
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection
        label="What We Share"
        title="Updates, voices, galleries, and video together create a fuller picture of community life."
      >
        <div className="three-column-grid">
          {storyThemes.map((theme) => (
            <article key={theme.title} className="content-card">
              <h3>{theme.title}</h3>
              <p>{theme.body}</p>
            </article>
          ))}
        </div>
      </PageSection>
    </>
  );
}
