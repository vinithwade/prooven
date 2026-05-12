import Reveal from "./Reveal";
import LocalTime from "./LocalTime";
import SocialIcon, { socials } from "./SocialIcon";
import { BOOKING_URL } from "@/lib/links";

const quickLinks = [
  { href: "/#about", label: "About" },
  { href: "/#work", label: "Projects" },
  { href: "/#services", label: "Services" },
  { href: "/#industries", label: "Industries" },
  { href: "/#contact", label: "Contact" },
];

const otherLinks = [
  { href: "#", label: "Careers" },
  { href: "#", label: "Press" },
  { href: "#", label: "Journal" },
];

export default function Footer() {
  return (
    <footer
      id="contact"
      className="bg-black text-white border-t border-white/10 px-6 md:px-10 pt-20 md:pt-28 pb-8"
    >
      <div className="mx-auto max-w-[1700px]">
        {/* CTA */}
        <Reveal>
          <div className="text-[10px] md:text-xs uppercase tracking-[0.22em] text-white/50">
            Let&apos;s build / 2026
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="display-tight mt-5 text-5xl sm:text-6xl md:text-[6.4vw] lg:text-[5.6vw] font-semibold md:whitespace-nowrap">
            Have a brand worth{" "}
            <span className="font-serif italic font-normal">prooving</span>?
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-black hover:bg-white/90 transition-colors"
          >
            Book a 60-min call
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black text-white text-xs">
              →
            </span>
          </a>
        </Reveal>

        {/* Massive wordmark */}
        <div className="mt-24 md:mt-32">
          <Reveal>
            <a
              href="#top"
              aria-label="Back to top"
              className="block wordmark text-white text-[18vw] md:text-[20vw] lg:text-[19vw] leading-[0.82] tracking-[-0.05em] select-none"
              style={{ fontWeight: 800 }}
            >
              PROOVEN
            </a>
          </Reveal>
        </div>

        {/* Divider */}
        <div className="mt-4 border-t border-white/20" />

        {/* 4-column info grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-14 mt-12 md:mt-16">
          {/* Hyderabad */}
          <Reveal>
            <h3 className="text-base font-semibold mb-3">Hyderabad</h3>
            <div className="text-sm text-white/70">
              <LocalTime timeZone="Asia/Kolkata" />
            </div>
            <a
              href="mailto:hello@prooven.ai"
              className="mt-3 inline-block text-sm text-white/85 link-underline"
            >
              hello@prooven.ai
            </a>
          </Reveal>

          {/* New York */}
          <Reveal delay={60}>
            <h3 className="text-base font-semibold mb-3">New York</h3>
            <div className="text-sm text-white/70">
              <LocalTime timeZone="America/New_York" />
            </div>
            <a
              href="mailto:hello@prooven.ai"
              className="mt-3 inline-block text-sm text-white/85 link-underline"
            >
              hello@prooven.ai
            </a>
          </Reveal>

          {/* Quick links */}
          <Reveal delay={120}>
            <h3 className="text-base font-semibold mb-3">Quick links</h3>
            <ul className="space-y-2">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-white/85 link-underline"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Other links */}
          <Reveal delay={180}>
            <h3 className="text-base font-semibold mb-3">Other links</h3>
            <ul className="space-y-2">
              {otherLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-white/85 link-underline"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Socials row */}
        <Reveal>
          <div className="mt-14 md:mt-20 flex items-center gap-5 md:gap-6 text-white">
            {socials.map((s) => (
              <a
                key={s.key}
                href={s.href}
                aria-label={s.label}
                className="text-white/85 hover:text-white transition-colors"
              >
                <SocialIcon name={s.key} size={22} />
              </a>
            ))}
          </div>
        </Reveal>

        {/* Brand statement */}
        <Reveal>
          <p className="mt-12 md:mt-16 max-w-2xl text-sm text-white/55 leading-relaxed">
            Prooven is an AI-native marketing studio building strategy-driven,
            culturally tuned-in, and relentlessly creative work for ambitious
            brands. At the epicentre of culture &amp; code.
          </p>
        </Reveal>

        {/* Bottom strip */}
        <div className="mt-12 md:mt-16 flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-t border-white/15 pt-6 text-[10px] uppercase tracking-[0.22em] text-white/45">
          <span>© {new Date().getFullYear()} Prooven Studio</span>
          <span>Currently booking Q3 2026</span>
        </div>
      </div>
    </footer>
  );
}
