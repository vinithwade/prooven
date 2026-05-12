import Reveal from "./Reveal";
import { BOOKING_URL } from "@/lib/links";

export default function CTAScript() {
  return (
    <section className="bg-black text-white py-24 md:py-32 px-6 md:px-10 border-t border-white/10">
      <div className="mx-auto max-w-[1400px] flex flex-col items-center text-center gap-8">
        <Reveal>
          <h2 className="font-script text-5xl md:text-7xl lg:text-[88px] leading-none">
            Let&apos;s do something different…
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono tracking-[0.3em] text-xs uppercase label-underline"
          >
            Let&apos;s talk
          </a>
        </Reveal>
      </div>
    </section>
  );
}
