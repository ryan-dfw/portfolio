/** "/shots/x01.webp" → "/shots/x01_thumb.webp" (made by `npm run shots`). */
export const thumbOf = (src: string) => src.replace(/(\.[a-z0-9]+)$/i, "_thumb$1");
