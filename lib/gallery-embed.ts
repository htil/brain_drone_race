export function isDirectVideoFileUrl(src: string | undefined): boolean {
  if (!src) return false;
  return /\.(mp4|webm|ogg)(\?|$)/i.test(src);
}

/** Ensure YouTube/Vimeo embeds do not autoplay */
export function embedUrlNoAutoplay(src: string): string {
  try {
    const u = new URL(src);
    if (u.hostname.includes("youtube.com") || u.hostname.includes("youtu.be")) {
      u.searchParams.set("autoplay", "0");
      return u.toString();
    }
    if (u.hostname.includes("vimeo.com")) {
      u.searchParams.set("autoplay", "0");
      return u.toString();
    }
  } catch {
    return src;
  }
  return src;
}
