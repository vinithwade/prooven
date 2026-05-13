"use client";

import { useEffect, useState } from "react";
import { BOOKING_URL } from "@/lib/links";

const menuLinks = [
  { href: "/#about", label: "About" },
  { href: "/#work", label: "Projects" },
  { href: "/#services", label: "Services" },
  { href: "/#industries", label: "Industries" },
  { href: "/#contact", label: "Contact" },
];

type SocialKey = "instagram" | "linkedin";

const socials: { key: SocialKey; label: string; href: string }[] = [
  { key: "instagram", label: "Instagram", href: "#" },
  { key: "linkedin", label: "LinkedIn", href: "#" },
];

function SocialIcon({ name }: { name: SocialKey }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": true,
  } as const;
  switch (name) {
    case "instagram":
      return (
        <svg {...common}>
          <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.897 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.897-.422-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common}>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.063 2.063 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
  }
}

export default function Nav() {
  const [pastHero, setPastHero] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
    const onScroll = () => {
      // Hero section is 135vh — show the centre wordmark once we're past it
      setPastHero(window.scrollY > window.innerHeight * 1.0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Regular header — hidden while menu is open */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color,opacity] duration-300 ${
          open
            ? "opacity-0 pointer-events-none"
            : pastHero
            ? "bg-black/80 backdrop-blur-md border-b border-white/10"
            : "bg-transparent"
        }`}
        style={!open && !pastHero ? { textShadow: "0 1px 6px rgba(0,0,0,0.55)" } : undefined}
      >
        <div className="flex items-center justify-between px-6 py-5 md:px-10 md:py-6">
          <a
            href="/"
            className="text-xs md:text-sm font-medium uppercase tracking-[0.22em] text-white"
          >
            AI Marketing Studio
          </a>

          <a
            href="/"
            className={`hidden md:block absolute left-1/2 -translate-x-1/2 wordmark text-white text-2xl transition-opacity duration-500 ${
              pastHero ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            aria-hidden={!pastHero}
            tabIndex={pastHero ? 0 : -1}
          >
            PROOVEN
          </a>

          <div className="flex items-center gap-6 md:gap-10 text-white">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline text-xs md:text-sm font-medium uppercase tracking-[0.22em]"
            >
              Let&apos;s talk
            </a>
            <button
              onClick={() => setOpen(true)}
              className="text-xs md:text-sm font-medium uppercase tracking-[0.22em] flex items-center gap-2"
              aria-label="Open menu"
              aria-expanded={open}
            >
              <span>Menu</span>
              <span className="flex flex-col gap-[3px]">
                <span className="block h-[1.5px] w-4 bg-white" />
                <span className="block h-[1.5px] w-4 bg-white" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen menu overlay — split layout, fits 100vh, no scroll */}
      <div
        className={`fixed inset-0 z-[60] bg-black text-white transition-opacity duration-500 ${
          open
            ? "opacity-100 pointer-events-auto visible"
            : "opacity-0 pointer-events-none invisible"
        }`}
        aria-hidden={!open}
      >
        <div className="flex flex-col h-screen overflow-hidden">
          {/* Top bar */}
          <div className="shrink-0 flex items-center justify-between px-6 py-5 md:px-10 md:py-6">
            <a
              href="/"
              onClick={() => setOpen(false)}
              className="text-xs md:text-sm font-medium uppercase tracking-[0.22em] text-white"
            >
              AI Marketing Studio
            </a>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="text-xs md:text-sm font-medium uppercase tracking-[0.22em] text-white link-underline"
            >
              Close
            </button>
          </div>

          {/* Main: image | links */}
          <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2">
            {/* LEFT: image with bottom-left wordmark */}
            <div className="relative hidden md:block menu-image overflow-hidden">
              <h2 className="absolute -bottom-1 left-3 md:left-6 wordmark text-white text-[9vw] lg:text-[7.5vw] pointer-events-none select-none">
                PROOVEN
              </h2>
            </div>

            {/* RIGHT: links + lets-talk + footer */}
            <div className="flex flex-col h-full px-6 md:px-10 lg:px-14 pt-2 md:pt-4 pb-6 md:pb-8 min-h-0">
              {/* Link list */}
              <ul className="menu-list shrink-0">
                {menuLinks.map((l, i) => (
                  <li
                    key={l.href}
                    className="border-b border-white/25"
                  >
                    <div
                      style={{
                        transition:
                          "transform 700ms cubic-bezier(0.2,0.7,0.2,1), opacity 700ms cubic-bezier(0.2,0.7,0.2,1)",
                        transitionDelay: open ? `${i * 60 + 160}ms` : "0ms",
                        transform: open ? "translateY(0)" : "translateY(12px)",
                        opacity: open ? 1 : 0,
                      }}
                    >
                      <a
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className="group flex items-center justify-between py-3 md:py-4 lg:py-5"
                      >
                        <span className="font-normal text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-none tracking-tight uppercase">
                          {l.label}
                        </span>
                        <span className="text-base md:text-lg group-hover:translate-x-1 transition-transform">
                          →
                        </span>
                      </a>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Spacer */}
              <div className="flex-1 min-h-0" />

              {/* LET'S TALK right-aligned */}
              <div
                className={`flex justify-end mb-6 md:mb-10 transition-all duration-700 ${
                  open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                }`}
                style={{ transitionDelay: open ? "520ms" : "0ms" }}
              >
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="font-mono text-xs md:text-sm uppercase tracking-[0.3em] label-underline"
                >
                  Let&apos;s talk
                </a>
              </div>

              {/* Footer row */}
              <div
                className={`flex items-end justify-between gap-6 transition-opacity duration-700 ${
                  open ? "opacity-100" : "opacity-0"
                }`}
                style={{ transitionDelay: open ? "660ms" : "0ms" }}
              >
                <div className="text-xs md:text-sm text-white/75 leading-relaxed">
                  <p>At the epicentre of culture &amp; code.</p>
                  <p className="text-white/45 mt-0.5">
                    Prooven © {new Date().getFullYear()}
                  </p>
                </div>
                <div className="flex items-center gap-4 md:gap-5 text-white/80">
                  {socials.map((s) => (
                    <a
                      key={s.key}
                      href={s.href}
                      aria-label={s.label}
                      className="hover:text-white transition-colors"
                    >
                      <SocialIcon name={s.key} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
