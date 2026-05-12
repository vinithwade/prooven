"use client";

import Link from "next/link";
import { useState } from "react";
import Reveal from "./Reveal";
import { BOOKING_URL } from "@/lib/links";
import { projects, projectFilters } from "@/lib/projects";

export default function ProjectsGrid() {
  const [active, setActive] = useState("All projects");
  const filtered =
    active === "All projects"
      ? projects
      : projects.filter((p) => p.industry === active);

  return (
    <section
      id="work"
      className="bg-black text-white border-t border-white/10 px-6 md:px-10 py-20 md:py-28"
    >
      <div className="mx-auto max-w-[1700px]">
        <Reveal>
          <h2 className="display-tight text-4xl md:text-6xl lg:text-[68px] font-semibold max-w-4xl">
            We&apos;re building{" "}
            <span className="font-serif italic font-normal">
              cultural moments
            </span>
            .
          </h2>
        </Reveal>

        <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-20">
          <Reveal className="md:col-span-7">
            <p className="text-sm md:text-base text-white/80 leading-relaxed">
              Prooven is the engine room behind ambitious brands and bold
              startups — turning vision into reality with AI-powered
              storytelling and high-performance creative.
            </p>
            <p className="mt-4 text-sm md:text-base text-white/80 leading-relaxed">
              From category leaders to disruptive newcomers, every project is
              fuelled by curiosity, craft and an obsession with what&apos;s
              next. We move fast, think big, and make work that doesn&apos;t
              just get seen — it gets remembered.
            </p>
            <p className="mt-4 text-sm md:text-base text-white/80">
              Explore the work. Feel the impact.
            </p>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 link-underline text-xs uppercase tracking-[0.22em]"
            >
              Get in touch →
            </a>
          </Reveal>
        </div>

        {/* Filter bar */}
        <Reveal className="mt-14 md:mt-20">
          <div className="no-scrollbar overflow-x-auto -mx-6 md:mx-0 px-6 md:px-0">
            <div className="flex items-center gap-7 md:gap-8 whitespace-nowrap text-sm md:text-base">
              <span className="text-white/35">Filter</span>
              {projectFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActive(f)}
                  className={`transition-colors ${
                    active === f
                      ? "text-white"
                      : "text-white/40 hover:text-white/80"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Grid */}
        <div className="mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filtered.map((p, i) => (
            <Reveal key={p.slug} delay={i * 80}>
              <Link href={`/projects/${p.slug}`} className="proj-card group block">
                <div
                  className="relative aspect-[5/4] overflow-hidden rounded-md bg-neutral-900"
                  style={{ background: p.cardGradient }}
                >
                  <video
                    className="proj-media absolute inset-0 h-full w-full object-cover"
                    src={p.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                  <div className="proj-arrow absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-white text-black flex items-center justify-center text-xl">
                    ↗
                  </div>
                </div>
                <div className="mt-4 flex items-end justify-between gap-4">
                  <h3 className="text-lg md:text-xl font-medium tracking-tight">
                    {p.title}
                  </h3>
                  <span className="text-sm text-white/60 text-right">
                    {p.client}
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
