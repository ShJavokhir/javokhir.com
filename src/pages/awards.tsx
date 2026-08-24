import { GetStaticProps } from "next";
import Image from "next/image";
import { Nav } from "@/components/Nav";
import { SEO } from "@/components/SEO";
import { AwardsJsonLd } from "@/components/JsonLd";
import { SITE_URL, outboundRel, toIsoMonth } from "@/lib/seo";
import awardsData from "../../content/awards.json";

interface Photo {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface Link {
  label: string;
  url: string;
}

interface Award {
  name: string;
  /** Human-readable result, e.g. "1st place" or "Datadog track winner". */
  placement: string;
  /** Decorative medal for the placement; the text above carries the meaning. */
  medal: string;
  issuer: string;
  date: string;
  /** What we shipped there, when the project has a name worth naming. */
  project?: string;
  note?: string;
  /** Teammates, me excluded. */
  team?: string[];
  links?: Link[];
  images?: Photo[];
}

interface Props {
  awards: Award[];
}

/** Shared by the meta description and the CollectionPage node. */
const DESCRIPTION =
  "Hackathon wins by Javokhir Shomuratov — 1st place at Y Combinator, OdysseyML, MongoDB and Docker/Groq/E2B, plus 2nd worldwide at the Global Best M-Gov Award.";

const linkClass =
  "underline decoration-link-underline/70 underline-offset-4 transition hover:decoration-link-underline-hover";

function formatList(names: string[]): string {
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

function Photos({
  images,
  eager = false,
}: {
  images: Photo[];
  /** The topmost photo on the page is a likely LCP candidate. */
  eager?: boolean;
}) {
  return (
    <ul className="mt-5 flex flex-wrap items-start gap-3">
      {images.map((photo, i) => (
        <li key={photo.src}>
          <a
            href={photo.src}
            target="_blank"
            rel="noreferrer"
            className="block rounded-md ring-1 ring-link-underline/40 transition hover:ring-link-underline-hover"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(max-width: 640px) 60vw, 400px"
              priority={eager && i === 0}
              className="h-32 w-auto rounded-md sm:h-44"
            />
          </a>
        </li>
      ))}
    </ul>
  );
}

function AwardEntry({ award, first }: { award: Award; first: boolean }) {
  const isoDate = toIsoMonth(award.date);

  return (
    <article>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-xl text-text-primary">{award.name}</h2>
        {isoDate ? (
          <time dateTime={isoDate} className="text-sm text-text-muted">
            {award.date}
          </time>
        ) : (
          <span className="text-sm text-text-muted">{award.date}</span>
        )}
      </div>

      <p className="mt-1 text-text-body">
        <span aria-hidden className="mr-1.5">
          {award.medal}
        </span>
        {award.placement}
        <span className="text-text-muted"> &middot; {award.issuer}</span>
      </p>

      {(award.project || award.note) && (
        <p className="mt-2 text-text-body">
          {award.project && <>Built {award.project}. </>}
          {award.note}
        </p>
      )}

      {award.team && award.team.length > 0 && (
        <p className="mt-2 text-sm text-text-muted">
          With {formatList(award.team)}
        </p>
      )}

      {award.links && award.links.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {award.links.map((link) => (
            <li key={link.url}>
              <a
                href={link.url}
                target="_blank"
                rel={outboundRel(link.url)}
                className={`text-text-body ${linkClass}`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}

      {award.images && award.images.length > 0 && (
        <Photos images={award.images} eager={first} />
      )}
    </article>
  );
}

export default function Awards({ awards }: Props) {
  return (
    <div>
      <SEO
        title="Awards"
        description={DESCRIPTION}
        path="/awards"
        image={`${SITE_URL}/awards/og-awards.jpg`}
        imageAlt="Javokhir Shomuratov and his team after winning HackTheStackathon at Y Combinator"
      />
      <AwardsJsonLd awards={awards} description={DESCRIPTION} />

      <main className="min-h-screen bg-page-bg text-text-primary">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <header className="mb-12">
            <Nav current="/awards" />
            <h1 className="mt-6 text-4xl text-text-primary">Awards</h1>
            <p className="mt-3 text-text-muted">
              13x hackathon / coding contest winner. I still think the role of luck is huge
              and anyone can do it. The recent ones:
            </p>
          </header>

          <ul className="divide-y divide-link-underline/40">
            {awards.map((award, i) => (
              <li key={award.name} className="py-8 first:pt-0 last:pb-0">
                <AwardEntry award={award} first={i === 0} />
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
      awards: awardsData as Award[],
    },
  };
};
