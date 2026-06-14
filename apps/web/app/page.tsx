import { Hero } from "./_components/Hero";
import { LiveTicker } from "./_components/LiveTicker";
import { ConstellationMap } from "./_components/ConstellationMap";
import { ActivityFeed } from "./_components/ActivityFeed";
import { PhilosophySection } from "./_components/PhilosophySection";
import { TerminalSection } from "./_components/TerminalSection";
import { DesignPreview } from "./_components/DesignPreview";
import { ProjectGrid } from "./_components/ProjectGrid";
import { Footer } from "./_components/Footer";

export default function HomePage() {
  return (
    <main className="aurora-konjo relative min-h-screen overflow-x-clip">
      <div className="aurora-konjo-bg" aria-hidden />
      <Hero />
      <LiveTicker />
      <ConstellationMap />
      <ActivityFeed />
      <PhilosophySection />
      <TerminalSection />
      <DesignPreview />
      <ProjectGrid />
      <Footer />
    </main>
  );
}
