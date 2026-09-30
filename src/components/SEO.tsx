import Head from "next/head";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  TWITTER_HANDLE,
  LOCALE,
  OG_CARD_URL,
  SEOProps,
  getFullTitle,
  getCanonicalUrl,
} from "@/lib/seo";

interface Props extends SEOProps {
  children?: React.ReactNode;
}

/**
 * `max-image-preview:large` is what lets Google show the full-width photo
 * for a result — it matters most on the award and project pages, which are
 * carried by their images.
 */
const INDEXABLE =
  "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

export function SEO({
  title,
  description = SITE_DESCRIPTION,
  path = "",
  type = "website",
  publishedTime,
  image,
  imageAlt,
  noindex = false,
  children,
}: Props) {
  const fullTitle = getFullTitle(title);
  const canonicalUrl = getCanonicalUrl(path);
  const ogImage = image || OG_CARD_URL;
  const ogImageAlt =
    imageAlt || `${SITE_NAME} — ${SITE_URL.replace("https://", "")}`;
  // Dimensions only describe the generated cards; a photo may differ.
  const isGeneratedCard = ogImage.startsWith(OG_CARD_URL);

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? "noindex, follow" : INDEXABLE} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={LOCALE.replace("-", "_")} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={ogImageAlt} />
      {isGeneratedCard && (
        <>
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:type" content="image/png" />
        </>
      )}
      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:creator" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={ogImageAlt} />

      {children}
    </Head>
  );
}
