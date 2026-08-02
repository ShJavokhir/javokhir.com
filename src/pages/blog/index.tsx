import Link from "next/link";
import { GetStaticProps } from "next";
import { getAllPosts, PostMeta } from "@/lib/blog";
import { Nav } from "@/components/Nav";
import { SEO } from "@/components/SEO";
import { BlogJsonLd } from "@/components/JsonLd";
import { formatDisplayDate } from "@/lib/seo";

interface Props {
  posts: PostMeta[];
}

/** Shared by the meta description and the Blog node. */
const DESCRIPTION =
  "Writing by Javokhir Shomuratov on building products, engineering and security — including a first-hand account of the React2Shell (CVE-2025-55182) incident.";

export default function Blog({ posts }: Props) {
  return (
    <div>
      <SEO title="Blog" description={DESCRIPTION} path="/blog" />
      <BlogJsonLd posts={posts} description={DESCRIPTION} />

      <main className="min-h-screen bg-page-bg text-text-primary">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <header className="mb-12">
            <Nav current="/blog" />
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
                      <time
                        dateTime={post.date}
                        className="mt-1 block text-sm text-text-muted"
                      >
                        {formatDisplayDate(post.date)}
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

export const getStaticProps: GetStaticProps<Props> = async () => {
  const posts = getAllPosts();
  return {
    props: { posts },
  };
};
