import {
  renderShareCard,
  shareCardAlt,
  shareCardContentType,
  shareCardSize,
} from "@/lib/share-card-image";

export const alt = shareCardAlt("impact");
export const size = shareCardSize;
export const contentType = shareCardContentType;

export default function Image() {
  return renderShareCard("impact");
}
