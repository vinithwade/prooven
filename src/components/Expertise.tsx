"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

const services = [
  {
    title: "Videography",
    desc: "Story-led films, brand documentaries, product launches.",
    video: "/videos/Videography-Service-1.mp4",
  },
  {
    title: "Photography",
    desc: "Editorial, campaign and lifestyle, end to end.",
    video: "/videos/Photography-Service.mp4",
  },
  {
    title: "Social Media",
    desc: "Always-on creative, content systems, community.",
    video: "/videos/Social-Media-Management-1.mp4",
  },
  {
    title: "Branding",
    desc: "Identity systems built to live everywhere.",
    video: "/videos/Branding-Services-GIF-2.mp4",
  },
  {
    title: "Graphic Design",
    desc: "Print, packaging, editorial, environmental.",
    video: "/videos/Design-Gif.mp4",
  },
  {
    title: "Advertising",
    desc: "Paid creative tested with AI at the volume of attention.",
    video: "/videos/Advertising_short-1.mp4",
  },
  {
    title: "Websites",
    desc: "High-performance sites in Next.js, headless & immersive.",
    video: "/videos/Websites-Services-Video-GIF.mp4",
  },
  {
    title: "3D & CGI",
    desc: "Generative visuals, product CGI, virtual production.",
    video: "/videos/3D-Video-GIF.mp4",
  },
  {
    title: "Strategy",
    desc: "Brand, channel and AI-stack strategy. Research-led.",
    video: "/videos/Strategy-and-Art-Direction-1.mp4",
  },
];

export default function Expertise() {
  const [active, setActive] = useState(0);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    itemRefs.current.forEach((el, idx) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) setActive(idx);
          });
        },
        {
          // Fire when the item crosses the middle 10% band of the viewport
          rootMargin: "-45% 0px -45% 0px",
          threshold: 0,
        }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <section
      id="services"
      className="bg-black text-white border-t border-white/10 px-6 md:px-10 py-20 md:py-28"
    >
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
            <div>
              <div className="text-[10px] md:text-xs uppercase tracking-[0.22em] text-white/50 mb-3">
                Our Expertise / 09
              </div>
              <h2 className="display-tight text-4xl md:text-6xl lg:text-[68px] font-semibold max-w-3xl">
                A full studio,{" "}
                <span className="font-serif italic font-normal">amplified</span>{" "}
                by AI.
              </h2>
            </div>
            <p className="md:max-w-sm text-white/70 text-sm md:text-base">
              Nine disciplines under one roof — combined with proprietary AI
              tooling that compresses timelines without flattening craft.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-14 lg:gap-20 items-start">
          {/* LEFT: tall scrolling list of services */}
          <ul className="md:col-span-7 border-t border-white/15">
            {services.map((s, i) => {
              const isActive = active === i;
              return (
                <li
                  key={s.title}
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  className="border-b border-white/15 min-h-[28vh] md:min-h-[32vh] flex items-center py-6 md:py-8"
                >
                  <div
                    className={`w-full transition-all duration-500 ${
                      isActive
                        ? "opacity-100 translate-x-0"
                        : "opacity-40 -translate-x-2"
                    }`}
                  >
                    <div className="flex items-baseline gap-5 md:gap-8">
                      <span
                        className={`font-mono text-xs md:text-sm transition-colors duration-500 ${
                          isActive ? "text-white/70" : "text-white/30"
                        }`}
                      >
                        0{i + 1}
                      </span>
                      <h3 className="display-tight text-4xl md:text-5xl lg:text-7xl font-semibold tracking-tight">
                        {s.title}
                      </h3>
                    </div>
                    <p
                      className={`mt-3 md:mt-4 ml-9 md:ml-14 text-sm md:text-base text-white/70 max-w-md transition-opacity duration-500 ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {s.desc}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* RIGHT: sticky video preview — pins as the list scrolls past */}
          <div className="hidden md:block md:col-span-5 md:sticky md:top-24 md:self-start">
            <div className="relative aspect-[4/5] rounded-md overflow-hidden bg-neutral-900 ring-1 ring-white/10">
              {services.map((s, i) => (
                <video
                  key={s.title}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                    active === i ? "opacity-100" : "opacity-0"
                  }`}
                  src={s.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20 pointer-events-none" />

              <div className="absolute left-5 top-5 right-5 flex items-start justify-between font-mono text-[11px] tracking-[0.25em] uppercase text-white/80">
                <span>{String(active + 1).padStart(2, "0")} / 09</span>
                <span>Prooven · Service</span>
              </div>

              <div className="absolute left-5 right-5 bottom-5 md:left-7 md:right-7 md:bottom-7">
                <div className="text-[10px] md:text-xs uppercase tracking-[0.22em] text-white/55 mb-2">
                  Now showing
                </div>
                <h3 className="display-tight text-2xl md:text-3xl lg:text-4xl font-semibold">
                  {services[active].title}
                </h3>
                <p className="mt-2 text-xs md:text-sm text-white/70 max-w-sm">
                  {services[active].desc}
                </p>
              </div>

              {/* Progress dots */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-[-28px] hidden md:flex items-center gap-1.5">
                {services.map((_, i) => (
                  <span
                    key={i}
                    className={`block h-[3px] rounded-full transition-all duration-500 ${
                      active === i ? "w-6 bg-white" : "w-3 bg-white/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
