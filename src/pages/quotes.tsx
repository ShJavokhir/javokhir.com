import { GetStaticProps } from "next";
import { useMemo, useState } from "react";
import { Nav } from "@/components/Nav";
import { SEO } from "@/components/SEO";
import { QuotesJsonLd } from "@/components/JsonLd";
import { formatDisplayDate, toIsoDate } from "@/lib/seo";
import quotesData from "../../content/quotes.json";

interface Quote {
  text: string;
  author: string;
  addedDate: string;
}

interface Props {
  quotes: Quote[];
}

/** Shared by the meta description and the CollectionPage node. */
const DESCRIPTION =
  "Quotes Javokhir Shomuratov keeps coming back to — on business, storytelling and decision-making, from Naval Ravikant, Charlie Munger, Alfred Adler and others.";

export default function Quotes({ quotes }: Props) {
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);

  const authors = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const q of quotes) {
      counts[q.author] = (counts[q.author] || 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [quotes]);

  const filtered = selectedAuthor
    ? quotes.filter((q) => q.author === selectedAuthor)
    : quotes;

  return (
    <div>
      <SEO title="Quotes" description={DESCRIPTION} path="/quotes" />
      <QuotesJsonLd quotes={quotes} description={DESCRIPTION} />

      <main className="min-h-screen bg-page-bg text-text-primary">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <header className="mb-12">
            <Nav current="/quotes" />
            <h1 className="mt-6 text-4xl text-text-primary">Quotes</h1>
            <p className="mt-3 text-text-muted">
              These are some of my favorite quotes from others. Paraphrasing may
              differ from the original wording.
            </p>
          </header>

          <div className="mb-8 flex flex-wrap gap-2">
            {authors.map(([author, count]) => (
              <button
                key={author}
                onClick={() =>
                  setSelectedAuthor(selectedAuthor === author ? null : author)
                }
                className={`rounded-md border px-3 py-1 text-sm transition ${
                  selectedAuthor === author
                    ? "border-text-primary bg-text-primary text-page-bg"
                    : "border-link-underline/40 text-text-muted hover:border-link-underline-hover hover:text-text-body"
                }`}
              >
                {author}
                {count > 1 && (
                  <span className="ml-1.5 opacity-50">{count}</span>
                )}
              </button>
            ))}
          </div>

          <div className="columns-1 gap-5 sm:columns-2">
            {filtered.map((quote, i) => (
              <figure
                key={i}
                className="group relative mb-5 break-inside-avoid rounded-md border border-link-underline/40 bg-card-surface px-6 py-5"
              >
                <blockquote>
                  <p className="text-text-body leading-relaxed">
                    &ldquo;{quote.text}&rdquo;
                  </p>
                </blockquote>
                <figcaption className="mt-3 text-sm text-text-muted">
                  {quote.author}
                </figcaption>
                <time
                  dateTime={toIsoDate(quote.addedDate)}
                  className="pointer-events-none absolute right-3 top-3 rounded bg-page-bg px-2 py-0.5 text-xs text-text-muted opacity-0 transition-opacity group-hover:opacity-100"
                >
                  {formatDisplayDate(quote.addedDate, "short")}
                </time>
              </figure>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  return {
    props: {
      quotes: quotesData as Quote[],
    },
  };
};
