import { HaloHero } from "@/components/halo/home/HaloHero";
import {
  ChipBand,
  Statement,
  ServiceBento,
  ProcessStepper,
  FrameworkTabs,
  OverlapCard,
  Numbers,
  StoryCards,
  InsightCards,
  HaloCTA,
} from "@/components/halo/home/Sections";

export default function Home() {
  return (
    <>
      <HaloHero />
      <ChipBand />
      <Statement />
      <ServiceBento />
      <ProcessStepper />
      <FrameworkTabs />
      <OverlapCard />
      <Numbers />
      <StoryCards />
      <InsightCards />
      <HaloCTA />
    </>
  );
}
