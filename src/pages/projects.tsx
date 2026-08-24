import { GetStaticProps } from "next";
import Image from "next/image";
import { Nav } from "@/components/Nav";
import { SEO } from "@/components/SEO";
import { ProjectsJsonLd } from "@/components/JsonLd";
import { outboundRel, toIsoMonth } from "@/lib/seo";
import projectsData from "../../content/projects.json";

interface Screenshot {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface Project {
  name: string;
  url?: string;
  /** Omitted when I don't remember the dates well enough to claim them. */
  period?: string;
  note?: string;
  description: string[];
  collaborators?: string[];
  images?: Screenshot[];
}

interface Props {
  projects: Project[];
}

/** Shared by the meta description and the CollectionPage node. */
const DESCRIPTION =
  "Projects built by Javokhir Shomuratov — YC World, Y Combinator as a city you can walk, YC Atlas, GoldCall, Quant Alpha, joinedanthropic.com, startups.rip and more.";

function formatList(names: string[]): string {
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

function Screenshots({
  images,
  eager = false,
}: {
  images: Screenshot[];
  /** The topmost screenshot on the page is a likely LCP candidate. */
  eager?: boolean;
}) {
  return (
    <ul className="mt-5 flex flex-wrap items-start gap-3">
      {images.map((shot, i) => (
        <li key={shot.src}>
          <a
            href={shot.src}
            target="_blank"
            rel="noreferrer"
            className="block rounded-md ring-1 ring-link-underline/40 transition hover:ring-link-underline-hover"
          >
            <Image
              src={shot.src}
              alt={shot.alt}
              width={shot.width}
              height={shot.height}
              sizes="(max-width: 640px) 60vw, 400px"
              priority={eager && i === 0}
              className="h-28 w-auto rounded-md sm:h-36"
            />
          </a>
        </li>
      ))}
    </ul>
  );
}

function ProjectEntry({ project, first }: { project: Project; first: boolean }) {
  const isoMonth = toIsoMonth(project.period);

  return (
    <article>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-xl text-text-primary">
          {project.url ? (
            <a
              href={project.url}
              target="_blank"
              rel={outboundRel(project.url)}
              className="underline decoration-link-underline/70 underline-offset-4 transition hover:decoration-link-underline-hover"
            >
              {project.name}
            </a>
          ) : (
            project.name
          )}
        </h2>
        {project.period &&
          (isoMonth ? (
            <time dateTime={isoMonth} className="text-sm text-text-muted">
              {project.period}
            </time>
          ) : (
            <span className="text-sm text-text-muted">{project.period}</span>
          ))}
      </div>

      {project.note && (
        <p className="mt-1 text-sm text-text-muted">{project.note}</p>
      )}

      <div className="mt-3 space-y-3 text-text-body">
        {project.description.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {project.collaborators && project.collaborators.length > 0 && (
        <p className="mt-3 text-sm text-text-muted">
          With {formatList(project.collaborators)}
        </p>
      )}

      {project.images && project.images.length > 0 && (
        <Screenshots images={project.images} eager={first} />
      )}
    </article>
  );
}

export default function Projects({ projects }: Props) {
  return (
    <div>
      <SEO title="Projects" description={DESCRIPTION} path="/projects" />
      <ProjectsJsonLd projects={projects} description={DESCRIPTION} />

      <main className="min-h-screen bg-page-bg text-text-primary">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <header className="mb-12">
            <Nav current="/projects" />
            <h1 className="mt-6 text-4xl text-text-primary">Projects</h1>
            <p className="mt-3 text-text-muted">
              Some of what I&apos;ve built, newest first.
            </p>
          </header>

          <ul className="divide-y divide-link-underline/40">
            {projects.map((project, i) => (
              <li key={project.name} className="py-8 first:pt-0 last:pb-0">
                <ProjectEntry project={project} first={i === 0} />
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  return {
    props: {
      projects: projectsData as Project[],
    },
  };
};
