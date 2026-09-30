import { Html, Head, Main, NextScript } from "next/document";
import { SITE_URL, SITE_NAME, RSS_PATH } from "@/lib/seo";

const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('theme');
      if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      }
    } catch (e) {}
  })();
`;

export default function Document() {
  return (
    <Html lang="en" suppressHydrationWarning>
      <Head>
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`Writings — ${SITE_NAME}`}
          href={`${SITE_URL}${RSS_PATH}`}
        />
        <script
          defer
          src="/stats/script.js"
          data-website-id="adf1699b-095d-4765-b815-50bdb1b58862"
          data-host-url={SITE_URL}
          data-domains="javokhir.com"
        />
      </Head>
      <body className="antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
