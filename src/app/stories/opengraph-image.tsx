import {
  renderShareCard,
  shareCardAlt,
  shareCardContentType,
  shareCardSize,
} from "@/lib/share-card-image";

export const alt = shareCardAlt("stories");
export const size = shareCardSize;
export const contentType = shareCardContentType;

export default function Image() {
  return renderShareCard("stories");
}
