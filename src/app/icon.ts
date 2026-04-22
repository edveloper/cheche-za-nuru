import { readFile } from "fs/promises";
import path from "path";

export const contentType = "image/png";
export const size = {
  width: 512,
  height: 512,
};

export default async function Icon() {
  const iconPath = path.join(process.cwd(), "public", "logo", "czn-logo.png");
  const buffer = await readFile(iconPath);

  return new Response(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
