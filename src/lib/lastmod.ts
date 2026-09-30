import { getAllPosts } from "@/lib/blog";
import { latestIsoDate } from "@/lib/seo";
import awardsData from "../../content/awards.json";
import projectsData from "../../content/projects.json";
import quotesData from "../../content/quotes.json";

/**
 * Per-section "last changed" dates, derived from the content itself rather
 * than the build — so a redeploy that changes nothing doesn't tell crawlers
 * everything changed. Shared by the sitemap and the homepage ProfilePage.
 */
export function getLastModified(): Record<string, string | undefined> {
  const postDates = getAllPosts().map((post) => post.date);
  const awardDates = (awardsData as { date?: string }[]).map((a) => a.date);
  const projectDates = (projectsData as { period?: string }[]).map((p) => p.period);
  const quoteDates = (quotesData as { addedDate?: string }[]).map((q) => q.addedDate);

  return {
    "": latestIsoDate([...postDates, ...awardDates, ...projectDates]),
    "/awards": latestIsoDate(awardDates),
    "/projects": latestIsoDate(projectDates),
    "/blog": latestIsoDate(postDates),
    "/quotes": latestIsoDate(quoteDates),
  };
}
