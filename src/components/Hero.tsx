"use client";

import { useEffect, useRef } from "react";

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const wordmarkRef = useRef<HTMLHeadingElement | null>(null);
  const hintRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let raf = 0;
    let maxP = 0;
    const update = () => {
      raf = 0;
      const sec = sectionRef.current;
      const card = cardRef.current;
      const wm = wordmarkRef.current;
      const hint = hintRef.current;
      if (!sec || !card) return;
      const rect = sec.getBoundingClientRect();
      const total = sec.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      const raw = total > 0 ? scrolled / total : 0;
      // Ease-out cubic — expansion is fast in the first half of the scroll
      const eased = 1 - Math.pow(1 - raw, 3);
      // Monotonic: only ever increase. Scrolling back up won't shrink the card.
      if (eased > maxP) maxP = eased;
      const p = maxP;
      card.style.setProperty("--p", String(p));
      if (wm) {
        // Wordmark stays fully white; just a tiny rise as the card expands
        wm.style.transform = `translateY(${p * 6}px)`;
      }
      if (hint) {
        hint.style.opacity = String(
          Math.max(0, Math.min(1 - raw * 6, 1 - p * 6))
        );
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative w-full bg-black"
      style={{ height: "135vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Centered video card that expands on scroll */}
        <div
          ref={cardRef}
          className="hero-video-card absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden ring-1 ring-white/10 bg-black"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover"
            src="/showreel.mp4"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15 pointer-events-none" />
        </div>

        {/* Scroll hint */}
        <div
          ref={hintRef}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/60 text-[10px] tracking-[0.3em] uppercase font-mono pointer-events-none"
        >
          <span>Scroll</span>
          <span className="block h-6 w-px bg-white/50 animate-pulse" />
        </div>

        {/* Frosted-glass strip behind the bottom-left wordmark */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[18vw] md:h-[14vw] lg:h-[13vw] pointer-events-none z-[5]"
          style={{
            backdropFilter: "blur(18px) saturate(120%)",
            WebkitBackdropFilter: "blur(18px) saturate(120%)",
            background:
              "linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.20) 55%, rgba(0,0,0,0) 100%)",
            maskImage:
              "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage:
              "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
          }}
        />

        {/* Big bottom-left wordmark */}
        <h1
          ref={wordmarkRef}
          className="absolute bottom-3 md:bottom-4 left-4 md:left-6 wordmark text-white text-[16vw] md:text-[12vw] lg:text-[11vw] pointer-events-none select-none z-10"
          style={{
            willChange: "transform",
            textShadow: "0 2px 24px rgba(0,0,0,0.55)",
          }}
        >
          PROOVEN
        </h1>
      </div>
    </section>
  );
}
