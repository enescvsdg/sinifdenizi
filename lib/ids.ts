type RandomSource = {
  getRandomValues(array: Uint8Array<ArrayBuffer>): Uint8Array<ArrayBuffer>;
  randomUUID?(): string;
};

/**
 * Random RFC 4122 version 4 ID. crypto.randomUUID exists only on HTTPS or
 * localhost; getRandomValues also works when a school serves the app over
 * plain HTTP on its own network.
 */
export function createId(source: RandomSource = globalThis.crypto): string {
  if (typeof source.randomUUID === "function") return source.randomUUID();
  const bytes = source.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const pairs = Array.from(bytes, (b) => b.toString(16).padStart(2, "0"));
  const hex = pairs.join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
