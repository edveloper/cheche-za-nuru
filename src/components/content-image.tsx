import Image from "next/image";

type ContentImageProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  preload?: boolean;
  quality?: 75 | 90 | 100;
};

export function ContentImage({
  src,
  alt,
  sizes,
  className,
  preload = false,
  quality = 100,
}: ContentImageProps) {
  return (
    <div className={className ? `${className} content-image-frame` : "content-image-frame"}>
      <Image
        src={src}
        alt={alt}
        fill
        preload={preload}
        quality={quality}
        sizes={sizes}
        className="content-image"
        style={{ objectFit: "cover" }}
      />
    </div>
  );
}
