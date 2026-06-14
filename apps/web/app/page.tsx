import { Hero } from "./_components/Hero";
import { LiveTicker } from "./_components/LiveTicker";
import { ConstellationMap } from "./_components/ConstellationMap";
import { ActivityFeed } from "./_components/ActivityFeed";
import { ProductMarquee } from "./_components/ProductMarquee";
import { PhilosophySection } from "./_components/PhilosophySection";
import { TerminalSection } from "./_components/TerminalSection";
import { LiveDemo } from "./_components/LiveDemo";
import { BenchmarkSection } from "./_components/BenchmarkSection";
import { InferenceHeatmap } from "./_components/InferenceHeatmap";
import { TokenVelocity } from "./_components/TokenVelocity";
import { ProductLeaderboard } from "./_components/ProductLeaderboard";
import { SignalMonitor } from "./_components/SignalMonitor";
import { DesignPreview } from "./_components/DesignPreview";
import { ProjectGrid } from "./_components/ProjectGrid";
import { CTASection } from "./_components/CTASection";
import { Footer } from "./_components/Footer";
import { WelcomeBack } from "./_components/WelcomeBack";
import { SystemPulse } from "./_components/SystemPulse";
import { PipelineTrace } from "./_components/PipelineTrace";
import { ChangelogFeed } from "./_components/ChangelogFeed";
import { DemoChat } from "./_components/DemoChat";
import { StatCounters } from "./_components/StatCounters";

export default function HomePage() {
  return (
    <main className="aurora-konjo relative min-h-screen overflow-x-clip">
      <div className="aurora-konjo-bg" aria-hidden />
      <WelcomeBack />
      <Hero />
      <SystemPulse />
      <LiveTicker />
      <ConstellationMap />
      <ActivityFeed />
      <ProductMarquee />
      <PhilosophySection />
      <TerminalSection />
      <PipelineTrace />
      <LiveDemo />
      <DemoChat />
      <BenchmarkSection />
      <InferenceHeatmap />
      <TokenVelocity />
      <ProductLeaderboard />
      <SignalMonitor />
      <ChangelogFeed />
      <DesignPreview />
      <ProjectGrid />
      <StatCounters />
      <CTASection />
      <Footer />
    </main>
  );
}
