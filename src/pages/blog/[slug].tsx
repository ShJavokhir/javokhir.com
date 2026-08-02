import { GetStaticProps, GetStaticPaths } from "next";
import ReactMarkdown from "react-markdown";
import { getAllSlugs, getPostBySlug, Post } from "@/lib/blog";
import { Nav } from "@/components/Nav";
import { SEO } from "@/components/SEO";
import { BlogPostJsonLd } from "@/components/JsonLd";
import { SITE_DESCRIPTION, formatDisplayDate } from "@/lib/seo";

interface Props {
  post: Post;
}

export default function BlogPost({ post }: Props) {
  return (
    <div>
      <SEO
        title={post.title}
        description={post.description || SITE_DESCRIPTION}
        path={`/blog/${post.slug}`}
        type="article"
        publishedTime={post.date}
      />
      <BlogPostJsonLd
        title={post.title}
        description={post.description}
        publishedTime={post.date}
        slug={post.slug}
      />

      <main className="min-h-screen bg-page-bg text-text-primary">
        <article className="mx-auto max-w-3xl px-6 py-20">
          <header className="mb-12">
            <Nav current="/blog" />
            <h1 className="mt-6 text-4xl text-text-primary">{post.title}</h1>
            <time
              dateTime={post.date}
              className="mt-4 block text-sm text-text-muted"
            >
              {formatDisplayDate(post.date)}
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
