import { GetServerSideProps } from "next";
import { getAllPosts, PostMeta } from "@/lib/blog";
import { SITE_URL, SITE_NAME, EMAIL, LOCALE, RSS_PATH } from "@/lib/seo";

const DESCRIPTION = `Writings by ${SITE_NAME}.`;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** RFC 822, as RSS requires. Dates are YYYY-MM-DD, pinned to noon UTC. */
function toRfc822(date: string): string | undefined {
  if (!date) return undefined;
  return new Date(`${date}T12:00:00Z`).toUTCString();
}

function renderItem(post: PostMeta): string {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const pubDate = toRfc822(post.date);
  return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>${
        pubDate ? `\n      <pubDate>${pubDate}</pubDate>` : ""
      }${
        post.description
          ? `\n      <description>${escapeXml(post.description)}</description>`
          : ""
      }
      <author>${EMAIL} (${escapeXml(SITE_NAME)})</author>
    </item>`;
}

function generateFeed(posts: PostMeta[]): string {
  const lastBuildDate = toRfc822(posts[0]?.date ?? "");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`Writings — ${SITE_NAME}`)}</title>
    <link>${SITE_URL}/blog</link>
    <description>${escapeXml(DESCRIPTION)}</description>
    <language>${LOCALE.toLowerCase()}</language>
    <atom:link href="${SITE_URL}${RSS_PATH}" rel="self" type="application/rss+xml" />${
      lastBuildDate ? `\n    <lastBuildDate>${lastBuildDate}</lastBuildDate>` : ""
    }${posts.map(renderItem).join("")}
  </channel>
</rss>`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate");
  res.write(generateFeed(getAllPosts()));
  res.end();

  return { props: {} };
};

export default function Rss() {
  return null;
}
