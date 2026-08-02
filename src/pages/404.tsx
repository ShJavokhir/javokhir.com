import Link from "next/link";
import Head from "next/head";
import { Nav } from "@/components/Nav";

export default function NotFound() {
  return (
    <div>
      <Head>
        <title>Page not found — Javokhir Shomuratov</title>
        <meta name="robots" content="noindex" />
      </Head>

      <main className="min-h-screen bg-page-bg text-text-primary">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <header className="mb-12">
            <Nav />
            <h1 className="mt-6 text-4xl text-text-primary">Page not found</h1>
            <p className="mt-3 text-text-muted">
              This page doesn&apos;t exist, or it moved.
            </p>
          </header>

          <Link
            href="/"
            className="text-text-body underline decoration-link-underline underline-offset-4 transition hover:decoration-link-underline-hover"
          >
            Back home
          </Link>
        </div>
      </main>
    </div>
  );
}
