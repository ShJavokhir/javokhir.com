import Head from "next/head";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  TWITTER_HANDLE,
  SEOProps,
  getFullTitle,
  getCanonicalUrl,
} from "@/lib/seo";

interface Props extends SEOProps {
  children?: React.ReactNode;
}

export function SEO({
  title,
  description = SITE_DESCRIPTION,
  path = "",
  type = "website",
  publishedTime,
  image,
  children,
}: Props) {
  const fullTitle = getFullTitle(title);
  const canonicalUrl = getCanonicalUrl(path);
  const ogImage = image || `${SITE_URL}/og-image.png`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      {publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {children}
    </Head>
  );
}
