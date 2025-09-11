// client/src/utils/id.ts
type CryptoWithUUID = Crypto & { randomUUID?: () => string };

export function makeSessionId(): string {
  const c = globalThis.crypto as CryptoWithUUID | undefined;

  // 1) Use crypto.randomUUID if available — call it *on* the object
  if (c?.randomUUID && typeof c.randomUUID === 'function') {
    return c.randomUUID();
  }

  // 2) RFC4122 v4 via getRandomValues (widely supported)
  if (c?.getRandomValues) {
    const bytes = new Uint8Array(16);
    c.getRandomValues(bytes);
    // Set version & variant bits
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }

  // 3) Last-ditch fallback (not a UUID, but good enough for a demo)
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
