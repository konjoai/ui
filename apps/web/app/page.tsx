import { ProjectGrid } from "./_components/ProjectGrid";
import { Hero } from "./_components/Hero";
import { LiveTicker } from "./_components/LiveTicker";
import { DesignPreview } from "./_components/DesignPreview";
import { Footer } from "./_components/Footer";

export default function HomePage() {
  return (
    <main className="aurora-konjo relative min-h-screen overflow-x-clip">
      <div className="aurora-konjo-bg" aria-hidden />
      <Hero />
      <LiveTicker />
      <DesignPreview />
      <ProjectGrid />
      <Footer />
    </main>
  );
}
