import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";
import sharp from "sharp";

import { shareCard, shareCardPages } from "@/lib/brand-cards";

export const shareCardSize = { width: 1200, height: 630 };
export const shareCardContentType = "image/jpeg";

const fromRoot = (...parts: string[]) => join(process.cwd(), ...parts);

/**
 * Renders a page's share card (Open Graph / WhatsApp link preview) as a JPEG.
 * JPEG keeps it well under WhatsApp's preview size limit; PNG photos run to ~1 MB.
 */
export async function renderShareCard(slug: string) {
  const page = shareCardPages.find((card) => card.slug === slug) ?? shareCardPages[0]!;

  const [bricolage, figtreeMedium, figtreeBold, mark, photo] = await Promise.all([
    readFile(fromRoot("assets/fonts/BricolageGrotesque-ExtraBold.ttf")),
    readFile(fromRoot("assets/fonts/Figtree-Medium.ttf")),
    readFile(fromRoot("assets/fonts/Figtree-Bold.ttf")),
    readFile(fromRoot("public/logo/czn-mark.png")),
    sharp(fromRoot("public", page.photo)).resize(834, 1008, { fit: "cover" }).jpeg({ quality: 82 }).toBuffer(),
  ]);

  const png = new ImageResponse(
    shareCard(page, {
      mark: `data:image/png;base64,${mark.toString("base64")}`,
      photo: `data:image/jpeg;base64,${photo.toString("base64")}`,
    }),
    {
      ...shareCardSize,
      fonts: [
        { name: "Bricolage", data: bricolage, weight: 800, style: "normal" },
        { name: "Figtree", data: figtreeMedium, weight: 500, style: "normal" },
        { name: "Figtree", data: figtreeBold, weight: 700, style: "normal" },
      ],
    },
  );

  const jpeg = await sharp(Buffer.from(await png.arrayBuffer())).jpeg({ quality: 84 }).toBuffer();

  return new Response(new Uint8Array(jpeg), {
    headers: { "Content-Type": shareCardContentType },
  });
}

export function shareCardAlt(slug: string) {
  const page = shareCardPages.find((card) => card.slug === slug) ?? shareCardPages[0]!;
  return `${page.title}: Cheche Za Nuru Foundation`;
}
