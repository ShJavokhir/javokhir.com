import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  EMAIL,
  LOCALE,
  PERSON_ID,
  WEBSITE_ID,
  BLOG_ID,
  SOCIAL_LINKS,
  toIsoMonth,
  toIsoDate,
} from "@/lib/seo";

/**
 * `<` inside authored content could otherwise close the script tag early.
 */
function serialize(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialize(data) }}
    />
  );
}

function graph(nodes: unknown[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}

/**
 * Minimal Person stub so `@id` references resolve on pages other than the
 * homepage — crawlers read each page on its own, so a dangling `@id` would
 * leave the section pages attached to nothing.
 */
function personRef(extra: Record<string, unknown> = {}) {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: SITE_NAME,
    url: SITE_URL,
    ...extra,
  };
}

/** Same idea as `personRef`, for the `isPartOf` links. */
function websiteRef() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: LOCALE,
    publisher: { "@id": PERSON_ID },
  };
}

function blogRef() {
  return {
    "@type": "Blog",
    "@id": BLOG_ID,
    name: `Blog — ${SITE_NAME}`,
    url: `${SITE_URL}/blog`,
    isPartOf: { "@id": WEBSITE_ID },
    author: { "@id": PERSON_ID },
  };
}

interface Crumb {
  name: string;
  path: string;
}

/** Home > Section (> Page). Worth declaring even though the nav is flat. */
function breadcrumb(path: string, trail: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${SITE_URL}${path}#breadcrumb`,
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map(
      (crumb, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: crumb.name,
        item: `${SITE_URL}${crumb.path === "/" ? "" : crumb.path}`,
      })
    ),
  };
}

interface CollectionPageArgs {
  path: string;
  name: string;
  description: string;
  mainEntity: unknown;
}

/** The page node shared by /awards, /projects, /books and /quotes. */
function collectionPage({
  path,
  name,
  description,
  mainEntity,
}: CollectionPageArgs) {
  const url = `${SITE_URL}${path}`;
  return {
    "@type": "CollectionPage",
    "@id": url,
    url,
    name,
    description,
    inLanguage: LOCALE,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": PERSON_ID },
    breadcrumb: { "@id": `${url}#breadcrumb` },
    mainEntity,
  };
}

interface PersonJsonLdProps {
  name?: string;
  url?: string;
  jobTitle?: string;
}

export function PersonJsonLd({
  name = SITE_NAME,
  url = SITE_URL,
  jobTitle = "Founder",
}: PersonJsonLdProps = {}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": PERSON_ID,
        name,
        alternateName: "Javokhir Sh.",
        url,
        jobTitle,
        image: `${SITE_URL}/javokhir.jpg`,
        email: `mailto:${EMAIL}`,
        description: SITE_DESCRIPTION,
        knowsAbout: [
          "Software engineering",
          "Startups",
          "Product design",
          "AI agents",
          "Hackathons",
        ],
        worksFor: {
          "@type": "Organization",
          name: "Raisedash",
          url: "https://raisedash.com",
        },
        address: {
          "@type": "PostalAddress",
          addressRegion: "CA",
          addressCountry: "US",
          addressLocality: "San Francisco Bay Area",
        },
        sameAs: SOCIAL_LINKS.map((link) => link.url),
      }}
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
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name,
        url,
        description,
        inLanguage: LOCALE,
        publisher: { "@id": PERSON_ID },
        author: { "@id": PERSON_ID },
      }}
    />
  );
}

interface AwardsJsonLdProps {
  awards: {
    name: string;
    placement: string;
    issuer: string;
    date: string;
    note?: string;
    project?: string;
    links?: { url: string }[];
    images?: { src: string }[];
  }[];
  description: string;
}

/**
 * schema.org has no first-class "award won" node, so the wins are attached to
 * the Person as `award` strings (the property search engines actually read) and
 * mirrored as an ItemList for the page itself.
 */
export function AwardsJsonLd({ awards, description }: AwardsJsonLdProps) {
  return (
    <JsonLd
      data={graph([
        personRef({
          award: awards.map(
            (award) =>
              `${award.placement} — ${award.name}, ${award.issuer} (${award.date})`
          ),
        }),
        websiteRef(),
        collectionPage({
          path: "/awards",
          name: `Awards — ${SITE_NAME}`,
          description,
          mainEntity: {
            "@type": "ItemList",
            name: `Awards won by ${SITE_NAME}`,
            numberOfItems: awards.length,
            itemListOrder: "https://schema.org/ItemListOrderDescending",
            itemListElement: awards.map((award, i) => {
              // ListItem inherits from Thing, which has no date property — the
              // date rides along in the description instead.
              const itemDescription = [
                award.project && `Project: ${award.project}.`,
                award.note,
                `Awarded by ${award.issuer}, ${award.date}.`,
              ]
                .filter(Boolean)
                .join(" ");
              return {
                "@type": "ListItem",
                position: i + 1,
                name: `${award.name} — ${award.placement}`,
                description: itemDescription,
                ...(award.links?.[0] && { url: award.links[0].url }),
                ...(award.images?.length && {
                  image: award.images.map((photo) => `${SITE_URL}${photo.src}`),
                }),
              };
            }),
          },
        }),
        breadcrumb("/awards", [{ name: "Awards", path: "/awards" }]),
      ])}
    />
  );
}

interface ProjectsJsonLdProps {
  projects: {
    name: string;
    url?: string;
    period?: string;
    description: string[];
    collaborators?: string[];
    images?: { src: string }[];
  }[];
  description: string;
}

export function ProjectsJsonLd({
  projects,
  description,
}: ProjectsJsonLdProps) {
  return (
    <JsonLd
      data={graph([
        personRef(),
        websiteRef(),
        collectionPage({
          path: "/projects",
          name: `Projects — ${SITE_NAME}`,
          description,
          mainEntity: {
            "@type": "ItemList",
            name: `Projects by ${SITE_NAME}`,
            numberOfItems: projects.length,
            itemListOrder: "https://schema.org/ItemListOrderDescending",
            itemListElement: projects.map((project, i) => {
              const dateCreated = toIsoMonth(project.period);
              return {
                "@type": "ListItem",
                position: i + 1,
                item: {
                  "@type": "CreativeWork",
                  name: project.name,
                  description: project.description.join(" "),
                  inLanguage: LOCALE,
                  ...(project.url && { url: project.url }),
                  ...(dateCreated && { dateCreated }),
                  ...(project.images?.length && {
                    image: project.images.map(
                      (shot) => `${SITE_URL}${shot.src}`
                    ),
                  }),
                  creator: [
                    { "@id": PERSON_ID },
                    ...(project.collaborators ?? []).map((name) => ({
                      "@type": "Person",
                      name,
                    })),
                  ],
                },
              };
            }),
          },
        }),
        breadcrumb("/projects", [{ name: "Projects", path: "/projects" }]),
      ])}
    />
  );
}

interface QuotesJsonLdProps {
  quotes: { text: string; author: string }[];
  description: string;
}

export function QuotesJsonLd({ quotes, description }: QuotesJsonLdProps) {
  return (
    <JsonLd
      data={graph([
        personRef(),
        websiteRef(),
        collectionPage({
          path: "/quotes",
          name: `Quotes — ${SITE_NAME}`,
          description,
          mainEntity: {
            "@type": "ItemList",
            name: `Quotes collected by ${SITE_NAME}`,
            numberOfItems: quotes.length,
            itemListOrder: "https://schema.org/ItemListUnordered",
            itemListElement: quotes.map((quote, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "Quotation",
                text: quote.text,
                inLanguage: LOCALE,
                creator: { "@type": "Person", name: quote.author },
              },
            })),
          },
        }),
        breadcrumb("/quotes", [{ name: "Quotes", path: "/quotes" }]),
      ])}
    />
  );
}

interface BooksJsonLdProps {
  books: { title: string; authors: string[]; note?: string }[];
  description: string;
}

export function BooksJsonLd({ books, description }: BooksJsonLdProps) {
  return (
    <JsonLd
      data={graph([
        personRef(),
        websiteRef(),
        collectionPage({
          path: "/books",
          name: `Books — ${SITE_NAME}`,
          description,
          mainEntity: {
            "@type": "ItemList",
            name: `Books recommended by ${SITE_NAME}`,
            numberOfItems: books.length,
            itemListOrder: "https://schema.org/ItemListUnordered",
            itemListElement: books.map((book, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "Book",
                name: book.title,
                ...(book.note && { description: book.note }),
                author: book.authors.map((name) => ({
                  "@type": "Person",
                  name,
                })),
              },
            })),
          },
        }),
        breadcrumb("/books", [{ name: "Books", path: "/books" }]),
      ])}
    />
  );
}

interface BlogJsonLdProps {
  posts: { slug: string; title: string; date: string; description?: string }[];
  description: string;
}

export function BlogJsonLd({ posts, description }: BlogJsonLdProps) {
  return (
    <JsonLd
      data={graph([
        personRef(),
        websiteRef(),
        {
          "@type": "Blog",
          "@id": BLOG_ID,
          url: `${SITE_URL}/blog`,
          name: `Blog — ${SITE_NAME}`,
          description,
          inLanguage: LOCALE,
          isPartOf: { "@id": WEBSITE_ID },
          author: { "@id": PERSON_ID },
          publisher: { "@id": PERSON_ID },
          breadcrumb: { "@id": `${SITE_URL}/blog#breadcrumb` },
          blogPost: posts.map((post) => ({
            "@type": "BlogPosting",
            "@id": `${SITE_URL}/blog/${post.slug}`,
            headline: post.title,
            url: `${SITE_URL}/blog/${post.slug}`,
            ...(post.description && { description: post.description }),
            ...(toIsoDate(post.date) && {
              datePublished: toIsoDate(post.date),
            }),
            author: { "@id": PERSON_ID },
          })),
        },
        breadcrumb("/blog", [{ name: "Blog", path: "/blog" }]),
      ])}
    />
  );
}

interface BlogPostJsonLdProps {
  title: string;
  description?: string;
  publishedTime: string;
  slug: string;
  image?: string;
}

export function BlogPostJsonLd({
  title,
  description,
  publishedTime,
  slug,
  image = `${SITE_URL}/og-image.png`,
}: BlogPostJsonLdProps) {
  const url = `${SITE_URL}/blog/${slug}`;
  const datePublished = toIsoDate(publishedTime);

  return (
    <JsonLd
      data={graph([
        personRef(),
        websiteRef(),
        blogRef(),
        {
          "@type": "BlogPosting",
          "@id": url,
          url,
          mainEntityOfPage: { "@type": "WebPage", "@id": url },
          headline: title,
          description: description || SITE_DESCRIPTION,
          image,
          inLanguage: LOCALE,
          isPartOf: { "@id": BLOG_ID },
          breadcrumb: { "@id": `${url}#breadcrumb` },
          author: { "@id": PERSON_ID },
          publisher: { "@id": PERSON_ID },
          ...(datePublished && { datePublished, dateModified: datePublished }),
        },
        breadcrumb(`/blog/${slug}`, [
          { name: "Blog", path: "/blog" },
          { name: title, path: `/blog/${slug}` },
        ]),
      ])}
    />
  );
}
