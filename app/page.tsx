import { Hero } from "@/components/home/Hero";
import { FrameworkMarquee } from "@/components/home/FrameworkMarquee";
import { Problem } from "@/components/home/Problem";
import { OverlapMap } from "@/components/home/OverlapMap";
import { Services } from "@/components/home/Services";
import { Process } from "@/components/home/Process";
import { Stats } from "@/components/home/Stats";
import { Industries } from "@/components/home/Industries";
import { Testimonials } from "@/components/home/Testimonials";
import { ReadinessCheck } from "@/components/home/ReadinessCheck";
import { Insights } from "@/components/home/Insights";
import { FinalCTA } from "@/components/home/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <FrameworkMarquee />
      <Problem />
      <OverlapMap />
      <Services />
      <Process />
      <Stats />
      <Industries />
      <Testimonials />
      <ReadinessCheck />
      <Insights />
      <FinalCTA />
    </>
  );
}
