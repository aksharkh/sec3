import { Hero } from "@/components/home/Hero";
import { Problem } from "@/components/home/Problem";
import { FrameworkMarquee } from "@/components/home/FrameworkMarquee";
import { OverlapMap } from "@/components/home/OverlapMap";
import { ControlMatrix } from "@/components/home/ControlMatrix";
import { Services } from "@/components/home/Services";
import { Process } from "@/components/home/Process";
import { LetterPortal } from "@/components/home/LetterPortal";
import { Stats } from "@/components/home/Stats";
import { Industries } from "@/components/home/Industries";
import { StoriesRail } from "@/components/home/StoriesRail";
import { ReadinessCheck } from "@/components/home/ReadinessCheck";
import { Insights } from "@/components/home/Insights";
import { FinalCTA } from "@/components/home/FinalCTA";
import { FlowThread } from "@/components/ui/FlowThread";

export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <FlowThread dark />
      <FrameworkMarquee />
      <OverlapMap />
      <ControlMatrix />
      <Services />
      <Process />
      <LetterPortal />
      <Stats />
      <FlowThread />
      <Industries />
      <StoriesRail />
      <ReadinessCheck />
      <Insights />
      <FinalCTA />
    </>
  );
}
