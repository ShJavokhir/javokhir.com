import Image from "next/image";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { SEO } from "@/components/SEO";
import { PersonJsonLd, WebsiteJsonLd } from "@/components/JsonLd";
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

export default function Home() {
  return (
    <div>
      <SEO path="" />
      <PersonJsonLd />
      <WebsiteJsonLd />

      <main className="min-h-screen bg-page-bg text-text-primary">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <header>
            <Nav current="/" />
            <div className="mt-8 flex items-center gap-5">
              <Image
                src="/javokhir.jpg"
                alt="Javokhir Shomuratov"
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
            <Item>
              I design complex, scalable architectures, and I&apos;m a little
              addicted to getting the UI/UX right
            </Item>
            <Item>
              Founder mindset, generalist by choice. I never picked one thing to
              be forever. When something new matters, I go all the way in until
              I can actually do it &mdash; staying unlocked is the plan.
            </Item>
            <Item>
              <Link href="/awards" className={linkClass}>
                13x hackathon / coding contest winner
              </Link>{" "}
              <span aria-hidden>&#127941;</span>{" "}
              (I still think the role of luck is huge and anyone can do it)
            </Item>
            <Item>W2 history? 3 months at a fast food restaurant</Item>
            <Item>
              Part-time ethical hacker &mdash; found a real vuln at a US public
              company
            </Item>
            <Item>
              I like reverse-engineering how successful people actually got there
            </Item>
            <Item>
              <Link href="/books" className={linkClass}>
                Favorite books?
              </Link>{" "}
              Thinking in Bets, The Mom Test, SPIN Selling
            </Item>
            <Item>Hobby? canyon drives, sim racing, hiking, cooking, audiobooks</Item>
            <Item>&ldquo;Car guy&rdquo; (812, 296 GTB, SF90 XX, Senna, GT3 RS)</Item>
          </ul>

          <footer className="mt-14 border-t border-link-underline/40 pt-8">
            <p className="text-text-body">
              Reach me at{" "}
              <a href={`mailto:${EMAIL}`} className={linkClass}>
                {EMAIL}
              </a>
              .
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
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
          </footer>
        </div>
      </main>
    </div>
  );
}
