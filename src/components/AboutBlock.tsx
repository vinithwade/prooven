import Reveal from "./Reveal";
import { BOOKING_URL } from "@/lib/links";

export default function AboutBlock() {
  return (
    <section
      id="about"
      className="bg-black text-white border-t border-white/10 px-6 md:px-10 py-20 md:py-28"
    >
      <div className="mx-auto max-w-[1400px] grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-20 items-start">
        <Reveal className="md:col-span-7">
          <h2 className="display-tight text-4xl md:text-6xl lg:text-[72px] font-semibold">
            We are an{" "}
            <span className="font-serif italic font-normal">
              AI&nbsp;Marketing
            </span>
            <br />
            Powerhouse.
          </h2>
        </Reveal>

        <Reveal delay={120} className="md:col-span-5">
          <p className="text-sm md:text-base leading-relaxed text-white/80 max-w-md">
            Welcome to Prooven. We&apos;re an AI-native marketing partner built
            for brands, founders and operators who demand impact. We craft work
            that moves people. Through sharp ideas, deep collaboration and a
            proprietary AI stack, we deliver creative that cuts through.
            Strategy-driven, culturally tuned-in, and relentlessly creative —
            we turn ambition into action.
          </p>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 link-underline text-xs font-medium uppercase tracking-[0.22em]"
          >
            Let&apos;s talk →
          </a>
        </Reveal>
      </div>
    </section>
  );
}
