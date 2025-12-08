# SEO TODO

## Completed
- [x] robots.txt
- [x] Dynamic sitemap.xml
- [x] OpenGraph meta tags
- [x] Twitter Card meta tags
- [x] Canonical URLs
- [x] JSON-LD structured data (Person, Website, BlogPosting)
- [x] Meta descriptions on all pages
- [x] Charset and theme-color meta tags

## Next Steps

### High Priority
- [ ] **Add og-image.png** - Create a 1200x630px image at `public/og-image.png` for social sharing
- [ ] **Add favicon** - Create `public/favicon.ico` and `public/apple-touch-icon.png`
- [ ] **Update social links** - Edit `src/components/JsonLd.tsx` with your actual GitHub/Twitter/LinkedIn URLs
- [ ] **Update Twitter handle** - Edit `src/lib/seo.ts` to set your actual Twitter handle

### Medium Priority
- [ ] **Use next/image** - Replace any `<img>` tags with Next.js Image component for optimization
- [ ] **Add RSS feed** - Create `/api/rss` endpoint for blog subscribers
- [ ] **Add 404 page** - Create custom `src/pages/404.tsx` with proper SEO

### Lower Priority
- [ ] **Google Search Console** - Submit sitemap at https://search.google.com/search-console
- [ ] **Bing Webmaster Tools** - Submit sitemap at https://www.bing.com/webmasters
- [ ] **Monitor Core Web Vitals** - Use PageSpeed Insights to track performance
- [ ] **Add breadcrumb schema** - For better search result appearance

## Quick Commands
```bash
# Test sitemap
curl https://javokhir.com/sitemap.xml

# Test robots.txt
curl https://javokhir.com/robots.txt

# Validate structured data
# Visit: https://search.google.com/test/rich-results
```
