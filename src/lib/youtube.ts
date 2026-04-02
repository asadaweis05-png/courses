/**
 * Extract YouTube video ID from any YouTube URL or plain ID.
 * Supports: youtu.be/ID, youtube.com/watch?v=ID, youtube.com/embed/ID, youtube.com/shorts/ID, or plain ID
 */
export function extractYouTubeId(input: string): string {
  if (!input) return "";
  const trimmed = input.trim();

  // Already a plain ID (11 chars, no slashes or dots)
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);
    // youtu.be/ID
    if (url.hostname === "youtu.be") return url.pathname.slice(1).split("/")[0];
    // youtube.com/watch?v=ID
    if (url.searchParams.get("v")) return url.searchParams.get("v")!;
    // youtube.com/embed/ID or /shorts/ID or /live/ID
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length >= 2 && ["embed", "shorts", "live", "v"].includes(parts[0])) return parts[1];
  } catch {
    // not a URL — return as-is (user might be typing)
  }
  return trimmed;
}
