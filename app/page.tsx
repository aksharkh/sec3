import { Split } from "@/components/atlas/home/Split";
import { StoryRegister, InsightBriefs, AtlasCTA } from "@/components/atlas/home/Lower";
import { OverlapMap } from "@/components/home/OverlapMap";

export default function Home() {
  return (
    <div className="pt-[var(--header)]">
      <Split />
      <OverlapMap />
      <StoryRegister />
      <InsightBriefs />
      <AtlasCTA />
    </div>
  );
}
