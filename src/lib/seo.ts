export const SITE_URL = "https://javokhir.com";
export const SITE_NAME = "Javokhir Shomuratov";
export const SITE_DESCRIPTION =
  "Founder at Raisedash. 10+ years in tech, based in the SF Bay Area. Generalist by choice, 13x hackathon winner.";
export const TWITTER_HANDLE = "@javokhir_sh";
export const EMAIL = "hi@javokhir.com";
export const LOCALE = "en-US";

/** Stable node ids so every page's JSON-LD describes the same entities. */
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const BLOG_ID = `${SITE_URL}/blog#blog`;

export interface Section {
  href: string;
  label: string;
  /** Sitemap hints. */
  changefreq: string;
  priority: string;
}

/**
 * Every top-level section, most important first. Drives the nav order *and*
 * the sitemap, so crawlers see the same priority the reader does: the awards
 * and projects are the pages worth ranking, quotes are the tail.
 */
export const SECTIONS: Section[] = [
  { href: "/", label: "Home", changefreq: "weekly", priority: "1.0" },
  { href: "/awards", label: "Awards", changefreq: "monthly", priority: "0.9" },
  {
    href: "/projects",
    label: "Projects",
    changefreq: "monthly",
    priority: "0.9",
  },
  { href: "/blog", label: "Blog", changefreq: "weekly", priority: "0.8" },
  { href: "/books", label: "Books", changefreq: "monthly", priority: "0.5" },
  { href: "/quotes", label: "Quotes", changefreq: "monthly", priority: "0.5" },
];

/** Single source of truth for outbound profile links (page footer + Person JSON-LD). */
export const SOCIAL_LINKS = [
  { label: "X", url: "https://x.com/javokhir_sh" },
  { label: "GitHub", url: "https://github.com/javokhir" },
  { label: "LinkedIn", url: "https://linkedin.com/in/javokhir" },
];

export interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  type?: "website" | "article";
  publishedTime?: string;
  image?: string;
  /** Alt text for a page-supplied `image`; the default card has its own. */
  imageAlt?: string;
  /** Keep the page out of the index (404s, thank-you pages, etc.). */
  noindex?: boolean;
}

export function getFullTitle(title?: string): string {
  if (!title) return SITE_NAME;
  return `${title} — ${SITE_NAME}`;
}

export function getCanonicalUrl(path: string = ""): string {
  return `${SITE_URL}${path}`;
}

const MONTHS: Record<string, string> = {
  jan: "01",
  feb: "02",
  mar: "03",
  apr: "04",
  may: "05",
  jun: "06",
  jul: "07",
  aug: "08",
  sep: "09",
  oct: "10",
  nov: "11",
  dec: "12",
};

/**
 * Pull a machine-readable YYYY-MM out of a display period such as
 * "Jun 2026" or "Aug 2021 – Sep 2021" (the start date, i.e. when the
 * work was created). Returns undefined for free-form periods like
 * "Current" or "Previously".
 */
export function toIsoMonth(period?: string): string | undefined {
  const match = period?.match(/([A-Za-z]{3})[a-z]*\s+(\d{4})/);
  if (!match) return undefined;
  const month = MONTHS[match[1].toLowerCase()];
  return month ? `${match[2]}-${month}` : undefined;
}

/**
 * Normalise a human-written date ("March 8, 2026", "12-09-2025") to
 * YYYY-MM-DD. Built from local calendar fields rather than `toISOString()`,
 * which shifts the day for anyone east of UTC.
 */
export function toIsoDate(value?: string): string | undefined {
  if (!value) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;

  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/**
 * Human-readable date built from local calendar fields, so a plain
 * "2025-12-09" (which `new Date` reads as UTC midnight) doesn't render as the
 * 8th for readers in the Americas.
 */
export function formatDisplayDate(
  value?: string,
  month: "long" | "short" = "long"
): string {
  const iso = toIsoDate(value);
  if (!iso) return value ?? "";

  const [year, monthIndex, day] = iso.split("-").map(Number);
  return new Date(year, monthIndex - 1, day).toLocaleDateString("en-US", {
    year: "numeric",
    month,
    day: "numeric",
  });
}

/**
 * Newest date in a list, as YYYY-MM-DD. Month-precision inputs ("Feb 2026")
 * are pinned to the 1st — sitemap `lastmod` wants a full W3C date, and the
 * exact day within the month is not something the content records.
 */
export function latestIsoDate(values: (string | undefined)[]): string | undefined {
  const dates = values
    .map((value) => {
      const iso = toIsoDate(value);
      if (iso) return iso;
      const month = toIsoMonth(value);
      return month ? `${month}-01` : undefined;
    })
    .filter((value): value is string => Boolean(value));

  return dates.length ? dates.sort().at(-1) : undefined;
}
