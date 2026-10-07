/**
 * Builds the Cheche Za Nuru brand kit from the existing logo PNGs, photos and fonts.
 *
 *   node scripts/brand-kit/generate.mts
 *
 * Writes:
 *   brand-kit/**              the shareable kit (logos, favicons, social, share cards)
 *   src/app/favicon.ico,
 *   src/app/icon.png,
 *   src/app/apple-icon.png    icons the site serves (Next.js file conventions)
 *   public/icons/*            web app manifest icons
 *   public/logo/czn-mark.png  icon mark used by the share cards
 *
 * Re-run after changing a logo, photo, colour or card layout.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { ImageResponse } from "next/dist/compiled/@vercel/og/index.node.js";
import type { ReactElement } from "react";
import sharp from "sharp";

import {
  brand,
  coverCard,
  shareCard,
  shareCardPages,
  storyCard,
  type CardAssets,
} from "../../src/lib/brand-cards.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const kit = join(root, "brand-kit");
const fromRoot = (...parts: string[]) => join(root, ...parts);

async function write(path: string, data: Buffer | string) {
  mkdirSync(dirname(path), { recursive: true });
  // Icons are flat artwork, so a 256-colour palette shrinks them a lot with no visible loss.
  const isIcon = /[\\/](favicons|icons)[\\/]|[\\/]app[\\/](icon|apple-icon)\.png$/.test(path);
  if (isIcon && path.endsWith(".png") && Buffer.isBuffer(data)) {
    data = await sharp(data).png({ palette: true, compressionLevel: 9 }).toBuffer();
  }
  writeFileSync(path, data);
  console.log("  ", path.replace(root, "").replace(/\\/g, "/"));
}

const fonts = [
  { name: "Bricolage", data: readFileSync(fromRoot("assets/fonts/BricolageGrotesque-ExtraBold.ttf")), weight: 800 as const, style: "normal" as const },
  { name: "Figtree", data: readFileSync(fromRoot("assets/fonts/Figtree-Medium.ttf")), weight: 500 as const, style: "normal" as const },
  { name: "Figtree", data: readFileSync(fromRoot("assets/fonts/Figtree-Bold.ttf")), weight: 700 as const, style: "normal" as const },
];

async function render(element: ReactElement, width: number, height: number) {
  const response = new ImageResponse(element, { width, height, fonts });
  return Buffer.from(await response.arrayBuffer());
}

const dataUrl = (buffer: Buffer, mime = "image/png") => `data:${mime};base64,${buffer.toString("base64")}`;

async function photoUrl(publicPath: string, width: number, height: number) {
  const buffer = await sharp(fromRoot("public", publicPath)).resize(width, height, { fit: "cover" }).jpeg({ quality: 82 }).toBuffer();
  return dataUrl(buffer, "image/jpeg");
}

const hex = (colour: string) => ({
  r: parseInt(colour.slice(1, 3), 16),
  g: parseInt(colour.slice(3, 5), 16),
  b: parseInt(colour.slice(5, 7), 16),
  alpha: 1,
});

/** Same shape, new colour: keeps the alpha channel and fills it with a flat colour. */
async function recolour(input: Buffer, colour: string) {
  const { width, height } = await sharp(input).metadata();
  const alpha = await sharp(input).ensureAlpha().extractChannel("alpha").toBuffer();
  return sharp({ create: { width: width!, height: height!, channels: 3, background: hex(colour) } })
    .joinChannel(alpha)
    .png()
    .toBuffer();
}

/** Centres `input` on a square/rect canvas, scaled to `scale` of the shorter side. */
async function place(input: Buffer, width: number, height: number, background: string | null, scale: number) {
  const box = Math.round(Math.min(width, height) * scale);
  const fitted = await sharp(input).resize(box, box, { fit: "inside" }).toBuffer();
  const meta = await sharp(fitted).metadata();
  return sharp({
    create: {
      width,
      height,
      channels: 4,
      background: background ? hex(background) : { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: fitted, left: Math.round((width - meta.width!) / 2), top: Math.round((height - meta.height!) / 2) }])
    .png()
    .toBuffer();
}

function circle(size: number, colour: string) {
  return Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${colour}"/></svg>`,
  );
}

function roundedSquare(size: number, colour: string, radiusRatio = 0.22) {
  const r = Math.round(size * radiusRatio);
  return Buffer.from(`<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${r}" fill="${colour}"/></svg>`);
}

/** ICO container holding PNG images (supported by every current browser and Windows). */
function ico(pngs: { size: number; data: Buffer }[]) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = 6 + pngs.length * 16;
  const entries = pngs.map(({ size, data }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    return entry;
  });
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

console.log("Logos");

const lockupSource = await sharp(fromRoot("public/logo/czn-header-logo.png")).trim().png().toBuffer();
const lockupMeta = await sharp(lockupSource).metadata();
// The icon mark and the wordmark are separated by a fully transparent gap at x = 535–573.
const markRaw = await sharp(lockupSource).extract({ left: 0, top: 0, width: 535, height: lockupMeta.height! }).trim().png().toBuffer();
const wordmark = await sharp(lockupSource)
  .extract({ left: 573, top: 0, width: lockupMeta.width! - 573, height: lockupMeta.height! })
  .trim()
  .png()
  .toBuffer();
const badge = await sharp(fromRoot("public/logo/czn-logo.png")).trim().png().toBuffer();

const markSquare = await place(markRaw, 600, 600, null, 0.92);
await write(join(kit, "logos/czn-mark.png"), markSquare);
await write(fromRoot("public/logo/czn-mark.png"), await sharp(markSquare).resize(400, 400).png().toBuffer());

const markOnCircle = await sharp(circle(1000, brand.paper))
  .composite([{ input: await sharp(markRaw).resize(760, 760, { fit: "inside" }).toBuffer(), gravity: "centre" }])
  .png()
  .toBuffer();
await write(join(kit, "logos/czn-mark-circle.png"), markOnCircle);

await write(join(kit, "logos/czn-badge.png"), badge);
await write(join(kit, "logos/czn-badge-on-paper.png"), await place(badge, 2000, 2000, brand.paper, 0.8));
const badgeCircle = await sharp(circle(1600, brand.paper))
  .composite([{ input: await sharp(badge).resize(1120, 1120, { fit: "inside" }).toBuffer(), gravity: "centre" }])
  .png()
  .toBuffer();
await write(
  join(kit, "logos/czn-badge-on-navy.png"),
  await sharp({ create: { width: 2000, height: 2000, channels: 4, background: hex(brand.navy) } })
    .composite([{ input: badgeCircle, gravity: "centre" }])
    .png()
    .toBuffer(),
);

await write(join(kit, "logos/czn-lockup.png"), lockupSource);
await write(
  join(kit, "logos/czn-lockup-on-paper.png"),
  await sharp({ create: { width: 2000, height: 800, channels: 4, background: hex(brand.paper) } })
    .composite([{ input: await sharp(lockupSource).resize(1700, 600, { fit: "inside" }).toBuffer(), gravity: "centre" }])
    .png()
    .toBuffer(),
);

const wordmarkWhite = await recolour(wordmark, "#ffffff");
await write(join(kit, "logos/czn-wordmark-orange.png"), wordmark);
await write(join(kit, "logos/czn-wordmark-white.png"), wordmarkWhite);
await write(join(kit, "logos/czn-wordmark-navy.png"), await recolour(wordmark, brand.navy));

{
  // Reversed lockup for dark backgrounds: mark on a paper circle, white wordmark.
  const height = 800;
  const circleSize = 560;
  const mark = await sharp(circle(circleSize, brand.paper))
    .composite([{ input: await sharp(markRaw).resize(430, 430, { fit: "inside" }).toBuffer(), gravity: "centre" }])
    .png()
    .toBuffer();
  const words = await sharp(wordmarkWhite).resize(1160, 440, { fit: "inside" }).toBuffer();
  const wordsMeta = await sharp(words).metadata();
  await write(
    join(kit, "logos/czn-lockup-reversed-on-navy.png"),
    await sharp({ create: { width: 2000, height, channels: 4, background: hex(brand.navy) } })
      .composite([
        { input: mark, left: 140, top: (height - circleSize) / 2 },
        { input: words, left: 140 + circleSize + 80, top: Math.round((height - wordsMeta.height!) / 2) },
      ])
      .png()
      .toBuffer(),
  );
}

console.log("Favicons and app icons");

// Small icons sit on a paper tile so the black outlines survive dark browser tabs.
async function appIcon(size: number, { radius = 0.22, scale = 0.84 } = {}) {
  const art = await sharp(markRaw).resize(Math.round(size * scale), Math.round(size * scale), { fit: "inside" }).toBuffer();
  return sharp(roundedSquare(size, brand.paper, radius)).composite([{ input: art, gravity: "centre" }]).png().toBuffer();
}

const icoSizes = [16, 32, 48];
const icoPngs = await Promise.all(icoSizes.map(async (size) => ({ size, data: await appIcon(size, { radius: 0.18, scale: 0.94 }) })));
const favicon = ico(icoPngs);
await write(join(kit, "favicons/favicon.ico"), favicon);
await write(fromRoot("src/app/favicon.ico"), favicon);
for (const { size, data } of icoPngs) {
  await write(join(kit, `favicons/favicon-${size}.png`), data);
}

const icon512 = await appIcon(512);
const icon192 = await appIcon(192);
await write(join(kit, "favicons/icon-512.png"), icon512);
await write(join(kit, "favicons/icon-192.png"), icon192);
await write(fromRoot("src/app/icon.png"), icon512);
await write(fromRoot("public/icons/icon-512.png"), icon512);
await write(fromRoot("public/icons/icon-192.png"), icon192);

// Apple and maskable icons get a full-bleed background; the platform applies its own mask.
const apple = await sharp({ create: { width: 180, height: 180, channels: 4, background: hex(brand.paper) } })
  .composite([{ input: await sharp(markRaw).resize(150, 150, { fit: "inside" }).toBuffer(), gravity: "centre" }])
  .png()
  .toBuffer();
await write(join(kit, "favicons/apple-touch-icon.png"), apple);
await write(fromRoot("src/app/apple-icon.png"), apple);

const maskable = await sharp({ create: { width: 512, height: 512, channels: 4, background: hex(brand.paper) } })
  .composite([{ input: await sharp(markRaw).resize(330, 330, { fit: "inside" }).toBuffer(), gravity: "centre" }])
  .png()
  .toBuffer();
await write(join(kit, "favicons/maskable-512.png"), maskable);
await write(fromRoot("public/icons/maskable-512.png"), maskable);

console.log("Social profile images");

// Profile pictures are cropped to a circle by every platform, so art stays inside it.
await write(join(kit, "social/profile/profile-paper-1080.png"), await place(badge, 1080, 1080, brand.paper, 0.68));
await write(
  join(kit, "social/profile/profile-navy-1080.png"),
  await sharp({ create: { width: 1080, height: 1080, channels: 4, background: hex(brand.navy) } })
    .composite([{ input: await sharp(badgeCircle).resize(860, 860).toBuffer(), gravity: "centre" }])
    .png()
    .toBuffer(),
);
await write(join(kit, "social/profile/profile-mark-1080.png"), await place(markRaw, 1080, 1080, brand.paper, 0.7));
await write(join(kit, "social/profile/profile-linkedin-400.png"), await place(badge, 400, 400, brand.paper, 0.72));

const mark = dataUrl(await sharp(markSquare).resize(300, 300).png().toBuffer());

console.log("Cover images");

const covers = [
  { file: "facebook-cover-1640x624.jpg", width: 1640, height: 624, safeWidth: 1640, safeHeight: 624 },
  { file: "linkedin-banner-1584x396.jpg", width: 1584, height: 396, textSide: "right" as const },
  { file: "x-header-1500x500.jpg", width: 1500, height: 500, safeWidth: 1500, safeHeight: 360, textSide: "right" as const },
  { file: "youtube-banner-2560x1440.jpg", width: 2560, height: 1440, safeWidth: 1546, safeHeight: 423 },
  { file: "whatsapp-business-cover-1600x900.jpg", width: 1600, height: 900 },
  { file: "email-signature-banner-600x150.jpg", width: 600, height: 150 },
];
for (const cover of covers) {
  const assets: CardAssets = { mark, photo: await photoUrl("/images/czn/kibera-children-laughing.jpg", Math.round(cover.width * 0.5), cover.height) };
  const png = await render(
    coverCard({ line: "Sparks of Light", sub: "School, Health and Sport in Kibera" }, assets, cover),
    cover.width,
    cover.height,
  );
  await write(join(kit, "social/covers", cover.file), await sharp(png).jpeg({ quality: 86 }).toBuffer());
}

console.log("Share cards (Open Graph, WhatsApp link previews)");

for (const page of shareCardPages) {
  const assets: CardAssets = { mark, photo: await photoUrl(page.photo, 834, 1008) };
  const png = await render(shareCard(page, assets), 1200, 630);
  await write(join(kit, "share-cards", `share-${page.slug}-1200x630.jpg`), await sharp(png).jpeg({ quality: 84 }).toBuffer());
}

console.log("Stories (WhatsApp status, Instagram and Facebook stories)");

const stories = [
  { file: "story-donate", eyebrow: "Give", title: "Keep a Child in Class This Term", photo: "/images/czn/kibera-children-laughing.jpg", footer: "Donate Today" },
  { file: "story-scholarships", eyebrow: "Nuru Scholars", title: "$50 a Month Covers Fees, Books and Uniform", photo: "/images/czn/rene-with-children.jpg", footer: "Fund a Scholarship" },
  { file: "story-boots", eyebrow: "Our Football Club", title: "Boots, Not Crocs", photo: "/images/czn/kibera-football-club.jpg", footer: "$32 Buys a Pair" },
  { file: "story-clinic", eyebrow: "Afya Kwa Wote", title: "725 Shillings Saved a Life", photo: "/images/czn/doctor-checks-toddler.jpg", footer: "Fund the Clinic Budget" },
];
for (const story of stories) {
  const assets: CardAssets = { mark, photo: await photoUrl(story.photo, 1776, 1800) };
  const png = await render(storyCard(story, assets), 1080, 1920);
  await write(join(kit, "social/stories", `${story.file}-1080x1920.jpg`), await sharp(png).jpeg({ quality: 86 }).toBuffer());
}

console.log("Palette");

{
  const swatches = [
    ["Orange", brand.orange],
    ["Yellow", brand.yellow],
    ["Green", brand.green],
    ["Navy", brand.navy],
    ["Paper", brand.paper],
    ["Cream", brand.cream],
  ];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="400">${swatches
    .map(([, colour], index) => `<rect x="${index * 300}" y="0" width="300" height="400" fill="${colour}"/>`)
    .join("")}</svg>`;
  await write(join(kit, "colours/palette.png"), await sharp(Buffer.from(svg)).png().toBuffer());
}

console.log("Fonts");
for (const file of ["BricolageGrotesque-ExtraBold.ttf", "BricolageGrotesque-SemiBold.ttf", "Figtree-Medium.ttf", "Figtree-Bold.ttf"]) {
  await write(join(kit, "fonts", file), readFileSync(fromRoot("assets/fonts", file)));
}

console.log("Done.");
