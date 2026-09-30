# SEO TODO

## Completed
- [x] robots.txt
- [x] Dynamic sitemap.xml — driven by `SECTIONS`, with `lastmod` derived from content
      (not the build) and `<image:image>` entries for /awards and /projects
- [x] Section order lives in one place (`SECTIONS` in `src/lib/seo.ts`) and drives both the
      nav and the sitemap, so the two can't drift
- [x] OpenGraph + Twitter Card meta tags, incl. `og:locale` and `twitter:creator`
- [x] `robots` meta with `max-image-preview:large` (large photo in results — matters on
      /awards and /projects); `<SEO noindex />` for pages that shouldn't rank
- [x] Canonical URLs
- [x] JSON-LD on every page as a single `@graph`: Person, WebSite, Blog, BlogPosting,
      CollectionPage + ItemList for /awards, /projects and /quotes
- [x] Shared `@id`s (`PERSON_ID`, `WEBSITE_ID`, `BLOG_ID`) with on-page stub nodes, so each
      page's graph resolves standalone instead of pointing at nodes it doesn't define
- [x] BreadcrumbList on /awards, /projects, /quotes, /blog and every post
- [x] Machine-readable dates everywhere — frontmatter is normalised to `YYYY-MM-DD` in
      `src/lib/blog.ts`, and `<time dateTime>` is used on posts, projects and quotes
- [x] Descriptive alt text + `og:image:alt` / `twitter:image:alt`
- [x] Meta descriptions on all pages, shared with the matching JSON-LD node
- [x] Charset and theme-color meta tags
- [x] Custom 404 page (`src/pages/404.tsx`, noindex)
- [x] Favicon set (see the icon TODO below)
- [x] `www.javokhir.com` → apex 308 (`redirects()` in `next.config.ts`)
- [x] RSS feed at `/rss.xml`, advertised site-wide via `<link rel="alternate">`
- [x] Generated social cards (`/api/og`, `/api/og?post=<slug>`) built from the same strings as
      the meta tags, so the card can't go stale like the old hand-exported `og-image.png` did
      ("13x", wrong handle). Photo cards for /awards and /projects (JPEG — LinkedIn skips WebP)
- [x] `ProfilePage` JSON-LD on the homepage, `dateModified` from content (shared with the sitemap
      via `src/lib/lastmod.ts`); full name visible in the homepage footer text
- [x] Removed Create Next App leftovers (`/api/hello`, template SVGs), duplicate charset meta

## Next Steps

### High Priority
- [ ] **Verify social URLs** - `SOCIAL_LINKS` in `src/lib/seo.ts` only lists X; GitHub and
      LinkedIn are commented out until the real URLs are confirmed. These feed both the
      homepage footer and the Person JSON-LD `sameAs`, so fix them in that one place. A wrong
      `sameAs` weakens the entity link rather than strengthening it.

- [ ] **Replace the template icons** - `apple-touch-icon.png` and `android-chrome-*.png` are still
      the Create Next App globe; only `favicon.ico` is custom, and it's 32x32 (Google wants 48px+
      for the icon in search results). Needs the source artwork, then add a `site.webmanifest`.

### Medium Priority
- [ ] **`/quotes` is thin content** - 14 widely-quoted lines from famous people is duplicate
      content everywhere on the web. It's kept at the lowest sitemap priority (0.5) for that
      reason. If it never earns impressions, consider `<SEO noindex />` so it doesn't drag on
      site quality signals.

### Lower Priority
- [ ] **Google Search Console** - Submit sitemap at https://search.google.com/search-console
- [ ] **Bing Webmaster Tools** - Submit sitemap at https://www.bing.com/webmasters
- [ ] **Monitor Core Web Vitals** - Use PageSpeed Insights to track performance

## Quick Commands
```bash
# Test sitemap
curl https://javokhir.com/sitemap.xml

# Test robots.txt
curl https://javokhir.com/robots.txt

# Validate structured data
# Visit: https://search.google.com/test/rich-results
# Visit: https://validator.schema.org
```
