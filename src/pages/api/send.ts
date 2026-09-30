import type { NextApiRequest, NextApiResponse } from "next";

// Umami is proxied through this origin so ad blockers don't drop it. A plain
// rewrite makes cloud.umami.is see the EC2 box's IP, so every visitor lands in
// us-east-1 (Ashburn). Umami's /api/send accepts an `ip` in the payload and
// trusts it over its own header sniffing, so inject the real client IP here.
const UMAMI_ENDPOINT = process.env.UMAMI_ENDPOINT ?? "https://cloud.umami.is/api/send";

// Headers the tracker sets that Umami expects to receive untouched.
const FORWARD_HEADERS = [
  "user-agent",
  "accept-language",
  "x-umami-cache",
  "x-umami-website-id",
  "x-umami-hostname",
] as const;

function header(req: NextApiRequest, name: string): string | undefined {
  const value = req.headers[name];
  return Array.isArray(value) ? value[0] : value;
}

// Cloudflare sets cf-connecting-ip on every request it proxies; the ALB then
// appends its own hop to x-forwarded-for, so the client is the first entry.
function clientIp(req: NextApiRequest): string | undefined {
  const cf = header(req, "cf-connecting-ip")?.trim();
  if (cf) return cf;
  return header(req, "x-forwarded-for")?.split(",")[0]?.trim() || undefined;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end();
  }

  let body: Record<string, unknown>;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : { ...req.body };
  } catch {
    return res.status(400).end();
  }

  const ip = clientIp(req);
  const payload = body.payload as Record<string, unknown> | undefined;
  if (ip && payload && typeof payload === "object") {
    body.payload = { ...payload, ip };
  }

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  for (const name of FORWARD_HEADERS) {
    const value = header(req, name);
    if (value) headers[name] = value;
  }

  try {
    const upstream = await fetch(UMAMI_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    const text = await upstream.text();
    res.status(upstream.status);
    res.setHeader(
      "Content-Type",
      upstream.headers.get("content-type") ?? "application/json",
    );
    return res.send(text);
  } catch {
    return res.status(502).end();
  }
}
