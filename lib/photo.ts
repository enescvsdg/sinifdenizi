// Photos live in browser storage (about 5 MB per site), so each is stored as a
// small square: a phone photo becomes roughly 10–40 KB instead of megabytes.
export const photoSize = 256;
export const maxPhotoBytes = 10 * 1024 * 1024;
export const photoTypes = ["image/jpeg", "image/png", "image/webp"];

/** Centred square of the source image and the edge length it is drawn at. */
export function photoCrop(width: number, height: number, max = photoSize) {
  const side = Math.min(width, height);
  return {
    sx: (width - side) / 2,
    sy: (height - side) / 2,
    side,
    size: Math.max(1, Math.min(max, side)),
  };
}

/** Browser only: decodes the file and returns a small WebP (or JPEG) data URL. */
export async function shrinkPhoto(file: Blob): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const { sx, sy, side, size } = photoCrop(
      image.naturalWidth,
      image.naturalHeight,
    );
    if (!side) throw new Error("Empty image");
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas unavailable");
    context.fillStyle = "#fff"; // JPEG has no transparency
    context.fillRect(0, 0, size, size);
    context.imageSmoothingQuality = "high";
    context.drawImage(image, sx, sy, side, side, 0, 0, size, size);
    const webp = canvas.toDataURL("image/webp", 0.82);
    // Browsers without a WebP encoder silently return PNG, which is far larger.
    return webp.startsWith("data:image/webp")
      ? webp
      : canvas.toDataURL("image/jpeg", 0.85);
  } finally {
    URL.revokeObjectURL(url);
  }
}
