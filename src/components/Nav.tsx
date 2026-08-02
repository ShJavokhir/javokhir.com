import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SECTIONS } from "@/lib/seo";

interface Props {
  /** href of the section the current page belongs to, e.g. "/blog" for a post */
  current?: string;
}

export function Nav({ current }: Props) {
  return (
    <nav
      aria-label="Primary"
      className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm"
    >
      {SECTIONS.map(({ href, label }) =>
        href === current ? (
          <span
            key={href}
            aria-current="page"
            className="text-text-body underline decoration-link-underline underline-offset-4"
          >
            {label}
          </span>
        ) : (
          <Link
            key={href}
            href={href}
            className="text-text-muted underline decoration-transparent underline-offset-4 transition hover:text-text-body hover:decoration-link-underline"
          >
            {label}
          </Link>
        )
      )}
      <span className="ml-auto">
        <ThemeToggle />
      </span>
    </nav>
  );
}
