import Link from "next/link";
import { GetStaticProps } from "next";
import { useMemo, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SEO } from "@/components/SEO";
import quotesData from "../../content/quotes.json";

interface Quote {
  text: string;
  author: string;
  addedDate: string;
}

interface Props {
  quotes: Quote[];
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

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
      <SEO
        title="Quotes"
        description="A collection of quotes that inspire me."
        path="/quotes"
      />

      <main className="min-h-screen bg-page-bg text-text-primary">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <header className="mb-12">
            <nav className="flex items-center gap-6 text-sm">
              <Link
                href="/"
                className="text-text-muted underline decoration-transparent underline-offset-4 transition hover:text-text-body hover:decoration-link-underline"
              >
                Home
              </Link>
              <Link
                href="/blog"
                className="text-text-muted underline decoration-transparent underline-offset-4 transition hover:text-text-body hover:decoration-link-underline"
              >
                Blog
              </Link>
              <span className="text-text-body underline decoration-link-underline underline-offset-4">
                Quotes
              </span>
              <span className="ml-auto">
                <ThemeToggle />
              </span>
            </nav>
            <h1 className="mt-6 text-4xl text-text-primary">Quotes</h1>
            <p className="mt-3 text-text-muted">
              These are some of my favorite quotes from others. Pharaphrasing may be different from the original quote.
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
                <span className="pointer-events-none absolute right-3 top-3 rounded bg-page-bg px-2 py-0.5 text-xs text-text-muted opacity-0 transition-opacity group-hover:opacity-100">
                  {formatDate(quote.addedDate)}
                </span>
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
