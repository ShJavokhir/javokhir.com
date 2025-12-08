export const SITE_URL = "https://javokhir.com";
export const SITE_NAME = "Javokhir Shomuratov";
export const SITE_DESCRIPTION =
  "Developer based in the Bay Area, CA. Building tech products that make a difference.";
export const TWITTER_HANDLE = "@javokhir_sh";

export interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  type?: "website" | "article";
  publishedTime?: string;
  image?: string;
}

export function getFullTitle(title?: string): string {
  if (!title) return SITE_NAME;
  return `${title} — ${SITE_NAME}`;
}

export function getCanonicalUrl(path: string = ""): string {
  return `${SITE_URL}${path}`;
}
