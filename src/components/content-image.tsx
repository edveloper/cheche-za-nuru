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
  // Disable optimization only for Supabase images to avoid private IP resolution issues
  const isSupabaseImage = src.includes("efzetksxzvpvbobrxtgj.supabase.co");
  
  return (
    <div className={className ? `${className} content-image-frame` : "content-image-frame"}>
      <Image
        src={src}
        alt={alt}
        fill
        preload={preload}
        quality={quality}
        unoptimized={isSupabaseImage}
        sizes={sizes}
        className="content-image"
        style={{ objectFit: "cover" }}
      />
    </div>
  );
}
