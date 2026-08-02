import { GetStaticProps } from "next";
import { Nav } from "@/components/Nav";
import { SEO } from "@/components/SEO";
import { BooksJsonLd } from "@/components/JsonLd";
import booksData from "../../content/books.json";

interface Book {
  title: string;
  /** Every credited author, in cover order. */
  authors: string[];
  /** Why it stuck, when there's something worth saying. */
  note?: string;
}

interface Props {
  books: Book[];
}

/** Shared by the meta description and the CollectionPage node. */
const DESCRIPTION =
  "Books Javokhir Shomuratov keeps recommending — on decision-making, selling and focus, from Annie Duke, Nassim Nicholas Taleb, Charlie Munger, Chris Voss and others.";

function formatAuthors(authors: string[]): string {
  if (authors.length === 1) return authors[0];
  return `${authors.slice(0, -1).join(", ")} and ${authors[authors.length - 1]}`;
}

export default function Books({ books }: Props) {
  return (
    <div>
      <SEO title="Books" description={DESCRIPTION} path="/books" />
      <BooksJsonLd books={books} description={DESCRIPTION} />

      <main className="min-h-screen bg-page-bg text-text-primary">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <header className="mb-12">
            <Nav current="/books" />
            <h1 className="mt-6 text-4xl text-text-primary">Books</h1>
            <p className="mt-3 text-text-muted">
              My favorite books.
            </p>
          </header>

          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {books.map((book) => (
              <li
                key={book.title}
                className="rounded-md border border-link-underline/40 bg-card-surface px-6 py-5"
              >
                <h2 className="text-lg leading-snug text-text-primary">
                  {book.title}
                </h2>
                <p className="mt-2 text-sm text-text-muted">
                  By {formatAuthors(book.authors)}
                </p>
                {book.note && (
                  <p className="mt-3 text-text-body leading-relaxed">
                    {book.note}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  return {
    props: {
      books: booksData as Book[],
    },
  };
};
