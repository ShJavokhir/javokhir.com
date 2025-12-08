import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SEO } from "@/components/SEO";
import { PersonJsonLd, WebsiteJsonLd } from "@/components/JsonLd";

export default function Home() {
  return (
    <div>
      <SEO
        path=""
        description="Developer based in the Bay Area, CA. Building tech products that make a difference. Co-founder of Examy, now building Raisedash."
      />
      <PersonJsonLd />
      <WebsiteJsonLd />

      <main className="min-h-screen bg-page-bg text-text-primary">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <header className="space-y-6">
            <nav className="flex items-center gap-6 text-sm">
              <span className="text-text-body underline decoration-link-underline underline-offset-4">
                Home
              </span>
              <Link
                href="/blog"
                className="text-text-muted underline decoration-transparent underline-offset-4 transition hover:text-text-body hover:decoration-link-underline"
              >
                Blog
              </Link>
              <span className="ml-auto">
                <ThemeToggle />
              </span>
            </nav>

            <h1 className="text-5xl text-text-primary">
              Javokhir Sh.
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-text-body">
              I&apos;m a developer based in the Bay Area, CA. I love building tech products that make a difference. I previously co-founded
              <a
                href="https://examy.me"
                className="mx-1 whitespace-nowrap underline decoration-link-underline/70 underline-offset-4 transition hover:decoration-link-underline-hover"
              >
                Examy
              </a>.
              Today, I spend most of my time building
              <a
                href="https://raisedash.com"
                className="mx-1 whitespace-nowrap underline decoration-link-underline/70 underline-offset-4 transition hover:decoration-link-underline-hover"
              >
                Raisedash
              </a>.
              <br />
              Driving cars is my favorite hobby and therapy session. <br /><br />
              You can reach me at <a href="mailto:hi@javokhir.com" className="underline decoration-link-underline/70 underline-offset-4 transition hover:decoration-link-underline-hover">hi@javokhir.com</a>.
            </p>
          </header>
        </div>
      </main>
    </div>
  );
}
