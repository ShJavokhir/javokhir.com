import Head from "next/head";
import Link from "next/link";
import { GetStaticProps } from "next";
import { getAllPosts, PostMeta } from "@/lib/blog";
import { ThemeToggle } from "@/components/ThemeToggle";

interface Props {
  posts: PostMeta[];
}

export default function Blog({ posts }: Props) {
  return (
    <div>
      <Head>
        <title>Blog — Javokhir Shomuratov</title>
        <meta
          name="description"
          content="Thoughts on building products, engineering, and lessons learned."
        />
      </Head>

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
              <span className="text-text-body underline decoration-link-underline underline-offset-4">
                Blog
              </span>
              <span className="ml-auto">
                <ThemeToggle />
              </span>
            </nav>
            <h1 className="mt-6 text-4xl text-text-primary">Blog</h1>
          </header>

          {posts.length === 0 ? (
            <p className="text-text-muted">No posts yet.</p>
          ) : (
            <ul className="space-y-8">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}`} className="group block">
                    <article>
                      <h2 className="text-xl text-text-primary underline decoration-transparent underline-offset-4 transition group-hover:decoration-link-underline">
                        {post.title}
                      </h2>
                      <time className="mt-1 block text-sm text-text-muted">
                        {formatDate(post.date)}
                      </time>
                      {post.description && (
                        <p className="mt-2 text-text-body">{post.description}</p>
                      )}
                    </article>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const posts = getAllPosts();
  return {
    props: { posts },
  };
};
