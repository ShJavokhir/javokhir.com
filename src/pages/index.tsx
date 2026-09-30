import { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { SEO } from "@/components/SEO";
import { HomeJsonLd } from "@/components/JsonLd";
import { getLastModified } from "@/lib/lastmod";
import { EMAIL, SOCIAL_LINKS } from "@/lib/seo";

const linkClass =
  "underline decoration-link-underline/70 underline-offset-4 transition hover:decoration-link-underline-hover";

function Item({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span aria-hidden className="select-none text-text-muted">
        &mdash;
      </span>
      <span>{children}</span>
    </li>
  );
}

interface Props {
  dateModified: string | null;
}

export default function Home({ dateModified }: Props) {
  return (
    <div>
      <SEO path="" />
      <HomeJsonLd dateModified={dateModified ?? undefined} />

      <main className="min-h-screen bg-page-bg text-text-primary">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <header>
            <Nav current="/" />
            <div className="mt-8 flex items-center gap-5">
              <Image
                src="/javokhir.jpg"
                alt="Javokhir Sh."
                width={640}
                height={640}
                sizes="80px"
                priority
                className="h-20 w-20 shrink-0 rounded-full object-cover ring-1 ring-link-underline/40"
              />
              <h1 className="text-5xl text-text-primary">Javokhir Sh.</h1>
            </div>
          </header>

          <ul className="mt-10 space-y-3 text-lg leading-relaxed text-text-body">
            <Item>10+ years in tech, based in the SF Bay Area</Item>
            <Item>All in on entrepreneurship</Item>
            <Item>
              I design complex, scalable architectures, and I&apos;m a little
              addicted to getting the UI/UX right
            </Item>
            <Item>
              <Link href="/awards" className={linkClass}>
                14x hackathon / coding contest winner
              </Link>{" "}
              <span aria-hidden>&#127941;</span>
            </Item>
            <Item>
              Part-time ethical hacker &mdash; found a real vuln at a US public
              company
            </Item>
            <Item>
              I like reverse-engineering how successful people actually got
              there
            </Item>
            <Item>
              <Link href="/books" className={linkClass}>
                Favorite books?
              </Link>{" "}
              Thinking in Bets, The Mom Test, SPIN Selling
            </Item>
            <Item>
              Hobby? canyon drives, sim racing, hiking, cooking, audiobooks
            </Item>
          </ul>

          <aside className="mt-12 rounded-md border border-link-underline/40 bg-card-surface px-6 py-5">
            <h2 className="text-xs uppercase tracking-widest text-text-muted">
              Fun fact
            </h2>
            <p className="mt-2 leading-relaxed text-text-body">
              I was born in Khorezm, the same small region as{" "}
              <a
                href="https://en.wikipedia.org/wiki/Al-Khwarizmi"
                target="_blank"
                rel="nofollow noopener noreferrer"
                className={linkClass}
              >
                Al-Khwarizmi
              </a>
              , the father of algebra. He popularized the numerals we use today,
              and the word &ldquo;algorithm&rdquo; comes from his name.
            </p>
          </aside>

          <footer className="mt-14 border-t border-link-underline/40 pt-8">
            <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
              <p className="text-text-body">
                Reach me at{" "}
                <a href={`mailto:${EMAIL}`} className={linkClass}>
                  {EMAIL}
                </a>
                .
              </p>
              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                {SOCIAL_LINKS.map(({ label, url }) => (
                  <li key={label}>
                    <a
                      href={url}
                      target="_blank"
                      rel="me noreferrer"
                      className="text-text-muted underline decoration-transparent underline-offset-4 transition hover:text-text-body hover:decoration-link-underline"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  return {
    // `undefined` isn't serializable as a prop.
    props: { dateModified: getLastModified()[""] ?? null },
  };
};
