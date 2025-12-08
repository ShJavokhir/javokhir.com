import Head from "next/head";
import Link from "next/link";
import { GetStaticProps } from "next";
import { getAllPosts, PostMeta } from "@/lib/blog";

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

      <main className="min-h-screen bg-[#f8f5f0] text-[#1f1d1a]">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <header className="mb-12">
            <Link
              href="/"
              className="text-sm text-[#3c3832]/60 underline decoration-[#c3bfb7]/50 underline-offset-4 transition hover:text-[#3c3832] hover:decoration-[#a79f95]"
            >
              ← Home
            </Link>
            <h1 className="mt-6 text-4xl text-[#1c1a17]">Blog</h1>
          </header>

          {posts.length === 0 ? (
            <p className="text-[#3c3832]/60">No posts yet.</p>
          ) : (
            <ul className="space-y-8">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}`} className="group block">
                    <article>
                      <h2 className="text-xl text-[#1c1a17] underline decoration-transparent underline-offset-4 transition group-hover:decoration-[#c3bfb7]">
                        {post.title}
                      </h2>
                      <time className="mt-1 block text-sm text-[#3c3832]/60">
                        {formatDate(post.date)}
                      </time>
                      {post.description && (
                        <p className="mt-2 text-[#3c3832]">{post.description}</p>
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
