export type Project = {
  slug: string;
  title: string;
  client: string;
  industry: string;
  year: string;
  services: string[];
  brief: string;
  heroGradient: string;
  cardGradient: string;
  video: string;
};

export const projects: Project[] = [
  {
    slug: "re-launch-velocity",
    title: "Re-launch Velocity",
    client: "Lumen Activewear",
    industry: "Fashion",
    year: "2026",
    services: ["Strategy", "Branding", "Videography", "Photography", "Social Media", "Advertising"],
    brief:
      "When Lumen briefed us to relaunch their hero training collection, we knew it had to feel cinematic — not catalogue. We built a six-week sprint pairing real athletes with our AI creative pipeline, generating 4,200 paid variants and a hero film that played in fourteen markets. Strategy met performance. Story met scale. CAC down 41%. ROAS at 6.3×.",
    heroGradient:
      "linear-gradient(135deg, #1a1a1a 0%, #3a3a3a 45%, #d1d1d1 100%)",
    cardGradient:
      "linear-gradient(135deg, #1a1a1a 0%, #3a3a3a 45%, #737373 100%)",
    video: "/videos/Strategy-and-Art-Direction-1.mp4",
  },
  {
    slug: "slow-brewed",
    title: "Slow Brewed",
    client: "Stratos Coffee",
    industry: "Hospitality",
    year: "2026",
    services: ["Strategy", "Branding", "Videography", "Social Media"],
    brief:
      "Stratos was scaling from one brewbar to twelve and needed a story that travelled with them. We shot a quiet documentary-led campaign across three cities, layered an always-on social system over it, and let the rituals — not the product — do the talking. 38M organic reach in six weeks. Net new accounts up 12.4%.",
    heroGradient:
      "linear-gradient(135deg, #0f0f0f 0%, #2a2a2a 40%, #b8b8b8 100%)",
    cardGradient:
      "linear-gradient(135deg, #0f0f0f 0%, #2a2a2a 40%, #a8a8a8 100%)",
    video: "/videos/Social-Media-Management-1.mp4",
  },
  {
    slug: "generative-halo",
    title: "Generative Halo",
    client: "Halo Beauty",
    industry: "Health & Beauty",
    year: "2026",
    services: ["Branding", "3D & CGI", "Websites", "Strategy"],
    brief:
      "Halo wanted an identity that wasn't fixed. We built a generative brand system — every product drop spawns its own visual language through our custom diffusion pipeline, then renders into a real-time three.js site. Beauty that mutates, but never breaks. Site dwell time up 3.1×.",
    heroGradient:
      "linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 45%, #e0e0e0 100%)",
    cardGradient:
      "linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 45%, #c2c2c2 100%)",
    video: "/videos/3D-Video-GIF.mp4",
  },
  {
    slug: "pinecrest-stays",
    title: "Pinecrest Stays",
    client: "Pinecrest Hotels",
    industry: "Hospitality",
    year: "2026",
    services: ["Photography", "Videography", "Websites", "Strategy"],
    brief:
      "Pinecrest needed to feel less like a chain and more like a place. We rebuilt their site from scratch, shot 47 properties in 11 weeks and let each one keep its own voice. Bookings up 31%. Average stay up 1.4 nights. Direct revenue up 22% — taken back from the OTAs.",
    heroGradient:
      "linear-gradient(135deg, #111 0%, #2e2e2e 40%, #a0a0a0 100%)",
    cardGradient:
      "linear-gradient(135deg, #111 0%, #2e2e2e 40%, #8a8a8a 100%)",
    video: "/videos/Photography-Service.mp4",
  },
  {
    slug: "vector-drive",
    title: "Vector Drive",
    client: "Vector Auto",
    industry: "Automotive",
    year: "2026",
    services: ["Advertising", "3D & CGI", "Videography", "Performance"],
    brief:
      "Launching an EV against incumbents three times the budget. We compressed an eight-week creative cycle into two using our AI variant engine, then ran the campaign on a live optimization loop. CAC down 41%. ROAS at 6.3×. The smallest player in the segment held its own against the biggest.",
    heroGradient:
      "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 40%, #888 100%)",
    cardGradient:
      "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 40%, #666 100%)",
    video: "/videos/Advertising_short-1.mp4",
  },
  {
    slug: "field-notes",
    title: "Field Notes",
    client: "Field & Foundry",
    industry: "Product",
    year: "2026",
    services: ["Branding", "Packaging", "Photography", "Social Media"],
    brief:
      "Field & Foundry built a workwear line for people who actually wear it. We crafted the brand from soil up — name, identity, packaging, and a campaign shot across three farms in two countries. No models, no studios. Real hands, real dirt, real fit. Launch sold through in 11 days.",
    heroGradient:
      "linear-gradient(135deg, #161616 0%, #383838 40%, #b0b0b0 100%)",
    cardGradient:
      "linear-gradient(135deg, #161616 0%, #383838 40%, #9c9c9c 100%)",
    video: "/videos/Branding-Services-GIF-2.mp4",
  },
];

export const projectFilters = [
  "All projects",
  "Product",
  "Fashion",
  "Hospitality",
  "Gym & Fitness",
  "Health & Beauty",
  "Real Estate",
  "Automotive",
  "Construction",
  "Tourism",
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
