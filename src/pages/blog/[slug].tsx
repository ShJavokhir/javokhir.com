import Head from "next/head";
import Link from "next/link";
import { GetStaticProps, GetStaticPaths } from "next";
import ReactMarkdown from "react-markdown";
import { getAllSlugs, getPostBySlug, Post } from "@/lib/blog";

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

      <main className="min-h-screen bg-[#f8f5f0] text-[#1f1d1a]">
        <article className="mx-auto max-w-3xl px-6 py-20">
          <header className="mb-12">
            <Link
              href="/blog"
              className="text-sm text-[#3c3832]/60 underline decoration-[#c3bfb7]/50 underline-offset-4 transition hover:text-[#3c3832] hover:decoration-[#a79f95]"
            >
              ← Blog
            </Link>
            <h1 className="mt-6 text-4xl text-[#1c1a17]">{post.title}</h1>
            <time className="mt-3 block text-sm text-[#3c3832]/60">
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
