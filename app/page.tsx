import { MeridianHero } from "@/components/meridian/home/MeridianHero";
import {
  FrameworkBand,
  Perspective,
  Capabilities,
  Approach,
  FrameworkDirectory,
  Voices,
  Journal,
  ClosingCTA,
} from "@/components/meridian/home/Sections";
import { OverlapMap } from "@/components/home/OverlapMap";

export default function Home() {
  return (
    <>
      <MeridianHero />
      <FrameworkBand />
      <Perspective />
      <Capabilities />
      <Approach />
      <FrameworkDirectory />
      <OverlapMap />
      <Voices />
      <Journal />
      <ClosingCTA />
    </>
  );
}
