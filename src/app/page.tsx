import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import AboutBlock from "@/components/AboutBlock";
import ProjectsGrid from "@/components/ProjectsGrid";
import Expertise from "@/components/Expertise";
import Industries from "@/components/Industries";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Nav />
      <Hero />
      <AboutBlock />
      <ProjectsGrid />
      <Expertise />
      <Industries />
      <Footer />
    </main>
  );
}
