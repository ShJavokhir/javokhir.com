import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo";

interface PersonJsonLdProps {
  name?: string;
  url?: string;
  jobTitle?: string;
}

export function PersonJsonLd({
  name = SITE_NAME,
  url = SITE_URL,
  jobTitle = "Software Developer",
}: PersonJsonLdProps = {}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url,
    jobTitle,
    sameAs: [
      "https://github.com/javokhir",
      "https://twitter.com/javokhir_sh",
      "https://linkedin.com/in/javokhir",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface BlogPostJsonLdProps {
  title: string;
  description?: string;
  publishedTime: string;
  slug: string;
}

export function BlogPostJsonLd({
  title,
  description,
  publishedTime,
  slug,
}: BlogPostJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: description || SITE_DESCRIPTION,
    author: {
      "@type": "Person",
      name: SITE_NAME,
      url: SITE_URL,
    },
    datePublished: publishedTime,
    url: `${SITE_URL}/blog/${slug}`,
    publisher: {
      "@type": "Person",
      name: SITE_NAME,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface WebsiteJsonLdProps {
  name?: string;
  url?: string;
  description?: string;
}

export function WebsiteJsonLd({
  name = SITE_NAME,
  url = SITE_URL,
  description = SITE_DESCRIPTION,
}: WebsiteJsonLdProps = {}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    description,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
