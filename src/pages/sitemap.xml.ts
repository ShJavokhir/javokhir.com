import { GetServerSideProps } from "next";
import { getAllPosts } from "@/lib/blog";
import { SITE_URL, SECTIONS, latestIsoDate } from "@/lib/seo";
import awardsData from "../../content/awards.json";
import projectsData from "../../content/projects.json";
import quotesData from "../../content/quotes.json";

/** Just the fields the sitemap cares about, across all three content files. */
interface ContentItem {
  date?: string;
  period?: string;
  addedDate?: string;
  images?: { src: string }[];
}

const awards = awardsData as ContentItem[];
const projects = projectsData as ContentItem[];
const quotes = quotesData as ContentItem[];

interface UrlEntry {
  path: string;
  changefreq: string;
  priority: string;
  lastmod?: string;
  /** Absolute image URLs, for Google Images discovery. */
  images?: string[];
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function imageUrls(items: ContentItem[]): string[] {
  return items.flatMap(
    (item) => item.images?.map((image) => `${SITE_URL}${image.src}`) ?? []
  );
}

function renderUrl({ path, changefreq, priority, lastmod, images }: UrlEntry) {
  return `
  <url>
    <loc>${escapeXml(`${SITE_URL}${path}`)}</loc>${
      lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ""
    }
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${(images ?? [])
      .map(
        (url) => `
    <image:image>
      <image:loc>${escapeXml(url)}</image:loc>
    </image:image>`
      )
      .join("")}
  </url>`;
}

function generateSitemap(posts: { slug: string; date: string }[]): string {
  const postDates = posts.map((post) => post.date);

  /**
   * `lastmod` comes from the content itself rather than the build, so a
   * redeploy that changes nothing doesn't tell crawlers everything changed.
   */
  const lastmodByPath: Record<string, string | undefined> = {
    "": latestIsoDate([
      ...postDates,
      ...awards.map((award) => award.date),
      ...projects.map((project) => project.period),
    ]),
    "/awards": latestIsoDate(awards.map((award) => award.date)),
    "/projects": latestIsoDate(projects.map((project) => project.period)),
    "/blog": latestIsoDate(postDates),
    "/quotes": latestIsoDate(quotes.map((quote) => quote.addedDate)),
  };

  const imagesByPath: Record<string, string[] | undefined> = {
    "/awards": imageUrls(awards),
    "/projects": imageUrls(projects),
  };

  const sections: UrlEntry[] = SECTIONS.map((section) => {
    const path = section.href === "/" ? "" : section.href;
    return {
      path,
      changefreq: section.changefreq,
      priority: section.priority,
      lastmod: lastmodByPath[path],
      images: imagesByPath[path],
    };
  });

  const postUrls: UrlEntry[] = posts.map((post) => ({
    path: `/blog/${post.slug}`,
    changefreq: "monthly",
    priority: "0.6",
    lastmod: post.date || undefined,
  }));

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${[
    ...sections,
    ...postUrls,
  ]
    .map(renderUrl)
    .join("")}
</urlset>`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const posts = getAllPosts();
  const sitemap = generateSitemap(posts);

  res.setHeader("Content-Type", "text/xml");
  res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate");
  res.write(sitemap);
  res.end();

  return { props: {} };
};

export default function Sitemap() {
  return null;
}
