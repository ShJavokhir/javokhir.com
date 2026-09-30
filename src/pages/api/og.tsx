import fs from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";
import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/blog";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  TWITTER_HANDLE,
  formatDisplayDate,
} from "@/lib/seo";

// Social cards, rendered from the same strings as the meta tags (post titles,
// `SITE_DESCRIPTION`, the handle) so they don't go stale the way the old
// hand-exported PNG did. The site card's subtitle is the one hand-written line. Takes a post slug rather than
// free text, so nobody can mint a card with arbitrary words next to the photo.
//
//   /api/og             → the site card (name, tagline)
//   /api/og?post=<slug> → a card for that post

const WIDTH = 1200;
const HEIGHT = 630;

const COLORS = {
  background: "#1c1a17",
  primary: "#f5f3ee",
  body: "#d4d0c8",
  muted: "#88857f",
  rule: "#2b2723",
};

// Read once per server process. The font paths are listed in
// `outputFileTracingIncludes` so they survive the standalone build.
const FONT_DIR = path.join(process.cwd(), "node_modules/geist/dist/fonts/geist-sans");
let assets: { regular: Buffer; medium: Buffer; avatar: string } | undefined;

function loadAssets() {
  if (!assets) {
    const avatar = fs.readFileSync(path.join(process.cwd(), "public/javokhir.jpg"));
    assets = {
      regular: fs.readFileSync(path.join(FONT_DIR, "Geist-Regular.ttf")),
      medium: fs.readFileSync(path.join(FONT_DIR, "Geist-Medium.ttf")),
      avatar: `data:image/jpeg;base64,${avatar.toString("base64")}`,
    };
  }
  return assets;
}

/**
 * `SITE_DESCRIPTION` minus what the subtitle already says. If the description
 * is reworded these patterns just stop matching and the full text shows —
 * check the card (`/api/og`) after editing either.
 */
const TAGLINE = SITE_DESCRIPTION.replace(/^Founder at Raisedash\.\s*/, "").replace(
  /,?\s*based in the SF Bay Area/,
  ""
);

/** Satori lays fragments out as a row, so each card is its own column. */
function Column({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {children}
    </div>
  );
}

function Footer({ right }: { right: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        borderTop: `1px solid ${COLORS.rule}`,
        paddingTop: 32,
        fontSize: 26,
      }}
    >
      <span style={{ color: COLORS.body, fontWeight: 500 }}>
        {SITE_URL.replace("https://", "")}
      </span>
      <span style={{ color: COLORS.muted }}>{right}</span>
    </div>
  );
}

function SiteCard({ avatar }: { avatar: string }) {
  return (
    <Column>
      <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={avatar} width={168} height={168} alt="" style={{ borderRadius: 999 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <span style={{ fontSize: 64, fontWeight: 500, color: COLORS.primary }}>
            {SITE_NAME}
          </span>
          <span style={{ fontSize: 28, color: COLORS.muted }}>
            Founder at Raisedash · SF Bay Area
          </span>
        </div>
      </div>
      <div style={{ display: "flex", fontSize: 36, lineHeight: 1.45, color: COLORS.body, maxWidth: 700 }}>
        {TAGLINE}
      </div>
      <Footer right={TWITTER_HANDLE} />
    </Column>
  );
}

function PostCard({
  avatar,
  title,
  description,
  date,
}: {
  avatar: string;
  title: string;
  description?: string;
  date: string;
}) {
  return (
    <Column>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={avatar} width={64} height={64} alt="" style={{ borderRadius: 999 }} />
        <span style={{ fontSize: 28, fontWeight: 500, color: COLORS.primary }}>
          {SITE_NAME}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <span
          style={{
            fontSize: title.length > 40 ? 60 : 72,
            fontWeight: 500,
            lineHeight: 1.1,
            color: COLORS.primary,
          }}
        >
          {title}
        </span>
        {description && (
          <span
            style={{
              fontSize: 30,
              lineHeight: 1.4,
              color: COLORS.muted,
              // Two lines at most; satori honours line clamping.
              display: "block",
              lineClamp: 2,
            }}
          >
            {description}
          </span>
        )}
      </div>
      <Footer right={date ? formatDisplayDate(date) : "Writings"} />
    </Column>
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const slug = typeof req.query.post === "string" ? req.query.post : undefined;
  // Slugs are file names under content/blog; refuse anything that could
  // walk out of it.
  if (slug !== undefined && !/^[a-z0-9-]+$/.test(slug)) {
    res.status(404).end();
    return;
  }
  const post = slug ? getPostBySlug(slug) : undefined;
  if (slug && !post) {
    res.status(404).end();
    return;
  }

  const { regular, medium, avatar } = loadAssets();

  const image = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: "80px 82px 64px",
          background: COLORS.background,
          fontFamily: "Geist",
        }}
      >
        {post ? (
          <PostCard
            avatar={avatar}
            title={post.title}
            description={post.description}
            date={post.date}
          />
        ) : (
          <SiteCard avatar={avatar} />
        )}
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        { name: "Geist", data: regular, weight: 400, style: "normal" },
        { name: "Geist", data: medium, weight: 500, style: "normal" },
      ],
    }
  );

  const png = Buffer.from(await image.arrayBuffer());
  res.setHeader("Content-Type", "image/png");
  // Not `immutable`: the URL stays the same when the tagline or a title changes.
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800");
  res.send(png);
}
