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
- [x] Favicon set + `public/og-image.png`

## Next Steps

### High Priority
- [ ] **Verify social URLs** - `SOCIAL_LINKS` in `src/lib/seo.ts` still holds guessed GitHub and
      LinkedIn paths (`github.com/javokhir`, `linkedin.com/in/javokhir`). These feed both the
      homepage footer and the Person JSON-LD `sameAs`, so fix them in that one place. A wrong
      `sameAs` weakens the entity link rather than strengthening it.

### Medium Priority
- [ ] **Per-page OG images** - `SEO.tsx` accepts `image` + `imageAlt`; only `/awards` passes one
      (`public/awards/og-awards.jpg`, 1200x630 JPEG — LinkedIn skips WebP previews).
      `/projects` and blog posts still fall back to the generic card.
- [ ] **Add RSS feed** - `/blog` has no feed; add one plus a
      `<link rel="alternate" type="application/rss+xml">` in `SEO.tsx`.
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
