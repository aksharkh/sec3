import { SignalHero } from "@/components/signal/home/SignalHero";
import {
  FrameworkIndex,
  Statement,
  ServiceConsole,
  ProcessRail,
  StoriesBento,
  InsightsIndex,
  SignalCTA,
} from "@/components/signal/home/Sections";
import { OverlapMap } from "@/components/home/OverlapMap";
import { Stats } from "@/components/home/Stats";
import { Industries } from "@/components/home/Industries";
import { ReadinessCheck } from "@/components/home/ReadinessCheck";

export default function Home() {
  return (
    <>
      <SignalHero />
      <FrameworkIndex />
      <Statement />
      <OverlapMap />
      <ServiceConsole />
      <ProcessRail />
      <Stats />
      <StoriesBento />
      <Industries />
      <InsightsIndex />
      <ReadinessCheck />
      <SignalCTA />
    </>
  );
}
