import Head from "next/head";
import Link from "next/link";
import { GetStaticProps, GetStaticPaths } from "next";
import ReactMarkdown from "react-markdown";
import { getAllSlugs, getPostBySlug, Post } from "@/lib/blog";
import { ThemeToggle } from "@/components/ThemeToggle";

interface Props {
  post: Post;
}

export default function BlogPost({ post }: Props) {
  return (
    <div>
      <Head>
        <title>{post.title} — Javokhir Shomuratov</title>
        {post.description && (
          <meta name="description" content={post.description} />
        )}
      </Head>

      <main className="min-h-screen bg-page-bg text-text-primary">
        <article className="mx-auto max-w-3xl px-6 py-20">
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
                className="text-text-body underline decoration-link-underline underline-offset-4 transition hover:decoration-link-underline-hover"
              >
                Blog
              </Link>
              <span className="ml-auto">
                <ThemeToggle />
              </span>
            </nav>
            <h1 className="mt-6 text-4xl text-text-primary">{post.title}</h1>
            <time className="mt-4 block text-sm text-text-muted">
              {formatDate(post.date)}
            </time>
          </header>

          <div className="prose">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </article>
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

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getAllSlugs();
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.slug as string;
  const post = getPostBySlug(slug);

  if (!post) {
    return { notFound: true };
  }

  return {
    props: { post },
  };
};
