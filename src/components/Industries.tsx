import Reveal from "./Reveal";
import { BOOKING_URL } from "@/lib/links";

const industries = [
  { label: "Product", tagline: "Launch with intent.", size: "lg" },
  { label: "Fashion", tagline: "Story over surface.", size: "md" },
  { label: "Hospitality", tagline: "Places, not chains.", size: "md" },
  { label: "Gym & Fitness", tagline: "Built for the work.", size: "md" },
  { label: "Health & Beauty", tagline: "Care, made culture.", size: "lg" },
  { label: "Real Estate", tagline: "Sell the feeling.", size: "sm" },
  { label: "Automotive", tagline: "Move people.", size: "md" },
  { label: "Construction", tagline: "Hard work, soft brand.", size: "sm" },
  { label: "Tourism", tagline: "Reasons to go.", size: "lg" },
];

// Bento sizing: lg = 2 col, md = 1 col, sm = 1 col
const colSpan = (s: string) =>
  s === "lg" ? "md:col-span-2" : "md:col-span-1";

export default function Industries() {
  return (
    <section
      id="industries"
      className="bg-black text-white border-t border-white/10 px-6 md:px-10 py-12 md:py-16"
    >
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 md:mb-10">
            <div>
              <div className="text-[10px] md:text-xs uppercase tracking-[0.22em] text-white/50 mb-2">
                Industries / 09
              </div>
              <h2 className="display-tight text-3xl md:text-5xl lg:text-[52px] font-semibold max-w-3xl">
                Built for{" "}
                <span className="font-serif italic font-normal">
                  ambitious
                </span>{" "}
                operators.
              </h2>
            </div>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline text-xs uppercase tracking-[0.22em] self-start md:self-end"
            >
              Book a call about yours →
            </a>
          </div>
        </Reveal>

        {/* Bento grid — tile heights driven by vh so the whole section fits ~80vh */}
        <div className="industries-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3">
          {industries.map((it, i) => (
            <Reveal
              key={it.label}
              delay={i * 50}
              className={colSpan(it.size)}
            >
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="industry-tile relative block h-full overflow-hidden rounded-md border border-white/15"
              >
                <div
                  className={`relative flex flex-col justify-between p-4 md:p-5 ${
                    it.size === "lg"
                      ? "min-h-[120px] md:min-h-[17vh]"
                      : it.size === "sm"
                      ? "min-h-[100px] md:min-h-[14vh]"
                      : "min-h-[110px] md:min-h-[16vh]"
                  }`}
                >
                  {/* Top row: number + arrow */}
                  <div className="flex items-start justify-between">
                    <span className="industry-num font-mono text-[10px] tracking-[0.22em]">
                      {String(i + 1).padStart(2, "0")} / 09
                    </span>
                    <span className="industry-arrow text-base">↗</span>
                  </div>

                  {/* Bottom block: name + tagline */}
                  <div>
                    <h3
                      className={`industry-title display-tight font-semibold tracking-tight ${
                        it.size === "lg"
                          ? "text-2xl md:text-3xl lg:text-4xl"
                          : it.size === "sm"
                          ? "text-xl md:text-2xl"
                          : "text-2xl md:text-3xl"
                      }`}
                    >
                      {it.label}
                    </h3>
                    <p className="industry-tag mt-1 font-serif italic text-xs md:text-sm">
                      {it.tagline}
                    </p>
                  </div>

                  {/* Sweep fill (CSS-driven) */}
                  <span aria-hidden className="industry-sweep" />
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
