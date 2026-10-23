export const RECEIPT_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
export const MEDIA_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "application/pdf"];
export const RECEIPT_MAX_BYTES = 8 * 1024 * 1024;
export const MEDIA_MAX_BYTES = 10 * 1024 * 1024;

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "application/pdf": "pdf",
};

export function extensionFor(type: string) {
  return EXT[type] ?? "bin";
}
