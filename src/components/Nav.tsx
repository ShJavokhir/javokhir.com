import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SECTIONS } from "@/lib/seo";

/** Shared link styling, so the "Other" trigger reads like the real links. */
const ACTIVE =
  "text-text-body underline decoration-link-underline underline-offset-4";
const IDLE =
  "text-text-muted underline decoration-transparent underline-offset-4 transition hover:text-text-body hover:decoration-link-underline";

const PRIMARY = SECTIONS.filter((section) => section.group === "primary");
const MORE = SECTIONS.filter((section) => section.group === "more");

interface Props {
  /** href of the section the current page belongs to, e.g. "/blog" for a post */
  current?: string;
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform ${open ? "rotate-180" : ""}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/**
 * The sections that don't earn a top-level slot. Closes on outside click and
 * Escape; navigating unmounts the nav, so no route listener is needed.
 */
function OtherMenu({ current }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const holdsCurrent = MORE.some((section) => section.href === current);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: Event) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls="nav-other"
        onClick={() => setOpen((value) => !value)}
        className={`flex cursor-pointer items-center gap-1 ${
          holdsCurrent ? ACTIVE : IDLE
        }`}
      >
        Other
        <Chevron open={open} />
      </button>

      <ul
        id="nav-other"
        hidden={!open}
        className="absolute left-0 top-full z-10 mt-2 min-w-36 rounded-lg border border-link-underline/60 bg-card-surface py-1 shadow-lg shadow-black/5"
      >
        {MORE.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              aria-current={href === current ? "page" : undefined}
              onClick={() => setOpen(false)}
              className={`block px-3 py-1.5 transition hover:bg-page-bg hover:text-text-body ${
                href === current ? "text-text-body" : "text-text-muted"
              }`}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Nav({ current }: Props) {
  return (
    <nav
      aria-label="Primary"
      className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm"
    >
      {PRIMARY.map(({ href, label }) =>
        href === current ? (
          <span key={href} aria-current="page" className={ACTIVE}>
            {label}
          </span>
        ) : (
          <Link key={href} href={href} className={IDLE}>
            {label}
          </Link>
        )
      )}

      <OtherMenu current={current} />

      <span className="ml-auto">
        <ThemeToggle />
      </span>
    </nav>
  );
}
