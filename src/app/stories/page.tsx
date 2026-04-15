import { ContentImage } from "@/components/content-image";
import { ParallaxImage } from "@/components/parallax-image";
import { PageIntro } from "@/components/page-intro";
import { PageSection } from "@/components/page-section";
import {
  featuredStory,
  pageVisuals,
  stories,
  storiesIntro,
  storyGalleries,
  storyThemes,
  videoHighlights,
  voiceSnippets,
} from "@/data/site";

export default function StoriesPage() {
  return (
    <>
      <PageIntro
        label="Stories"
        title="Stories from the heart of the work."
        body="We share stories so the work remains human, recognizable, and close to the people whose lives give it meaning."
        aside="Here is where updates, voices, blog-style reflections, galleries, and future video stories can live together without losing warmth."
      />

      <section className="section-image-banner">
        <ParallaxImage
          src={pageVisuals.stories.src}
          alt={pageVisuals.stories.alt}
          sizes="100vw"
          className="section-image-banner-card"
          speed={20}
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
        title={featuredStory.title}
        body={featuredStory.summary}
      >
        <article className="reading-panel stories-feature-copy">
          <p className="card-label">{featuredStory.category}</p>
          <p>{featuredStory.detail}</p>
        </article>
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
          {stories.map((story) => (
            <article key={story.title} className="story-post-card">
              <p className="card-label">{story.category}</p>
              <small className="meta-line">{story.date}</small>
              <h3>{story.title}</h3>
              <p>{story.summary}</p>
              <span className="text-link">Read more</span>
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
            <article key={gallery.title} className="gallery-story-grid">
              <div className="gallery-story-copy">
                <p className="card-label">{gallery.date}</p>
                <h3>{gallery.title}</h3>
                <p>{gallery.intro}</p>
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
                <span className="video-story-play" aria-hidden="true">
                  Play
                </span>
              </div>
              <p className="card-label">{video.duration}</p>
              <h3>{video.title}</h3>
              <p>{video.summary}</p>
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
