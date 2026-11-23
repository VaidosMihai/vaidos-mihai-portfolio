const ALLOWED_PROTOCOLS = new Set(["https:"]);

/**
 * Validates external URLs so only explicit HTTPS URLs can be bound to anchor hrefs.
 * Returns null if the URL is malformed or uses an unsafe scheme (e.g. javascript:, data:).
 */
export function getSafeExternalUrl(rawUrl: string | undefined): string | null {
  if (!rawUrl) return null;
  try {
    const parsed = new URL(rawUrl);
    if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * Validates FormSubmit AJAX endpoints strictly to clean HTTPS formsubmit.co/ajax/* URLs.
 */
export function getSafeFormSubmitUrl(rawUrl: string | undefined): string | null {
  if (!rawUrl) return null;
  try {
    const parsed = new URL(rawUrl.trim());
    if (parsed.protocol !== "https:") return null;
    if (parsed.hostname.toLowerCase() !== "formsubmit.co") return null;
    if (parsed.username || parsed.password || parsed.port || parsed.search || parsed.hash) {
      return null;
    }
    if (!parsed.pathname.startsWith("/ajax/") || parsed.pathname.slice(6).trim().length === 0) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}
