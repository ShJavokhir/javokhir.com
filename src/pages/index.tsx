import Head from "next/head";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Javokhir Shomuratov</title>
        {/* <meta
          name="description"
          content="Personal home page of Javokhir — a concise introduction and short biography."
        /> */}
      </Head>

      <main className="min-h-screen bg-[#f8f5f0] text-[#1f1d1a]">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <header className="space-y-5">
            
            <h1 className="text-5xl text-[#1c1a17]">
              Javokhir Sh.
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-[#3c3832]">
              I’m a developer based in the Bay Area, CA. I love building tech products that make a difference. I previously co-founded
              <a
                href="https://examy.me"
                className="mx-1 whitespace-nowrap underline decoration-[#c3bfb7]/70 underline-offset-4 transition hover:decoration-[#a79f95]"
              >
                Examy
              </a>.
              Today, I spend most of my time building 
              <a
                href="https://raisedash.com"
                className="mx-1 whitespace-nowrap underline decoration-[#c3bfb7]/70 underline-offset-4 transition hover:decoration-[#a79f95]"
              >
                Raisedash
              </a>. 
              <br />
              Driving cars is my favorite hobby and therapy session. <br /><br />
              You can reach me at <a href="mailto:hi@javokhir.com" className="text-[#007bff]">hi@javokhir.com</a>.
            </p>
          </header>          
        </div>
      </main>
    </div>
  );
}
