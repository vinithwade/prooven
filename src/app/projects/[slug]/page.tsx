import { notFound } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CTAScript from "@/components/CTAScript";
import Reveal from "@/components/Reveal";
import { getProject, projects } from "@/lib/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found · Prooven" };
  return {
    title: `${project.title} — ${project.client} · Prooven`,
    description: project.brief.slice(0, 160),
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const nextIndex =
    (projects.findIndex((p) => p.slug === project.slug) + 1) % projects.length;
  const next = projects[nextIndex];

  return (
    <main className="min-h-screen bg-black text-white">
      <Nav />

      {/* Title block */}
      <section className="px-6 md:px-10 pt-32 md:pt-40 pb-10 md:pb-14">
        <div className="mx-auto max-w-[1700px]">
          <Reveal>
            <div className="text-xs md:text-sm uppercase tracking-[0.22em] text-white/60">
              {project.client}
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="display-tight mt-6 md:mt-8 text-5xl md:text-7xl lg:text-[88px] font-semibold max-w-5xl">
              {project.title}
            </h1>
          </Reveal>
        </div>
      </section>

      {/* Hero video */}
      <section className="px-6 md:px-10">
        <div className="mx-auto max-w-[1700px]">
          <Reveal>
            <div
              className="relative w-full aspect-[16/9] rounded-md overflow-hidden bg-neutral-900"
              style={{ background: project.heroGradient }}
            >
              <video
                className="absolute inset-0 h-full w-full object-cover"
                src={project.video}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Brief + sidebar */}
      <section className="px-6 md:px-10 py-20 md:py-28">
        <div className="mx-auto max-w-[1700px] grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          <Reveal className="md:col-span-7">
            <h2 className="display-tight text-4xl md:text-5xl lg:text-[64px] font-semibold mb-6 md:mb-10">
              The brief.
            </h2>
            <p className="text-base md:text-lg text-white/80 leading-relaxed max-w-3xl">
              {project.brief}
            </p>
          </Reveal>

          <Reveal delay={120} className="md:col-span-4 md:col-start-9">
            <dl className="space-y-6 md:space-y-8">
              <Item label="Client" value={project.client} />
              <Item label="Industry" value={project.industry} />
              <Item label="Year" value={project.year} />
              <div>
                <dt className="font-mono text-xs uppercase tracking-[0.18em] text-white/55 mb-3">
                  Services
                </dt>
                <dd>
                  <ul className="space-y-2">
                    {project.services.map((s) => (
                      <li
                        key={s}
                        className="font-mono text-sm md:text-base text-white"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>

      {/* Next project teaser */}
      <section className="px-6 md:px-10 py-20 md:py-28 border-t border-white/10">
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <div className="text-[10px] md:text-xs uppercase tracking-[0.22em] text-white/45 mb-10 md:mb-14">
              Next project
            </div>
          </Reveal>

          <Link
            href={`/projects/${next.slug}`}
            className="group block proj-card"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-14 items-center">
              {/* Compact video preview */}
              <Reveal delay={80} className="md:col-span-5">
                <div
                  className="relative aspect-[4/5] md:aspect-[4/5] rounded-md overflow-hidden bg-neutral-900"
                  style={{ background: next.cardGradient }}
                >
                  <video
                    className="proj-media absolute inset-0 h-full w-full object-cover"
                    src={next.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                  <div className="proj-arrow absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 md:h-14 md:w-14 rounded-full bg-white text-black flex items-center justify-center text-lg md:text-xl">
                    ↗
                  </div>
                </div>
              </Reveal>

              {/* Title + meta */}
              <Reveal delay={140} className="md:col-span-7">
                <div className="font-mono text-[10px] md:text-xs uppercase tracking-[0.22em] text-white/55 mb-4 md:mb-6">
                  {next.client} · {next.industry}
                </div>
                <h3 className="display-tight text-4xl md:text-6xl lg:text-[88px] font-semibold mb-6 md:mb-10 transition-transform duration-500 group-hover:-translate-x-1">
                  {next.title}
                </h3>
                <span className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.22em]">
                  <span className="label-underline">View project</span>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/40 transition-all duration-500 group-hover:bg-white group-hover:text-black group-hover:border-white">
                    →
                  </span>
                </span>
              </Reveal>
            </div>
          </Link>
        </div>
      </section>

      <CTAScript />
      <Footer />
    </main>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-xs uppercase tracking-[0.18em] text-white/55 mb-2">
        {label}
      </dt>
      <dd className="font-mono text-sm md:text-base text-white">{value}</dd>
    </div>
  );
}
