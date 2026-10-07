import { ContentImage } from "@/components/content-image";
import type { Photo } from "@/data/site";

type PageIntroProps = {
  label: string;
  title: string;
  body: string;
  photo?: Pick<Photo, "src" | "alt">;
};

export function PageIntro({ label, title, body, photo }: PageIntroProps) {
  return (
    <section className={photo ? "page-intro page-intro-with-photo" : "page-intro"}>
      <div className="page-intro-main">
        <p className="section-label">{label}</p>
        <h1>{title}</h1>
        <p className="page-intro-body">{body}</p>
      </div>
      {photo ? (
        <ContentImage
          src={photo.src}
          alt={photo.alt}
          preload
          sizes="(max-width: 900px) 100vw, 50vw"
          className="page-intro-photo"
        />
      ) : null}
    </section>
  );
}
