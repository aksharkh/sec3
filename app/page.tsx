import { Journey } from "@/components/thread/home/Journey";
import { OverlapMap } from "@/components/home/OverlapMap";
import { ThreadCTA } from "@/components/thread/ThreadCTA";

export default function Home() {
  return (
    <>
      <Journey />
      <OverlapMap />
      <ThreadCTA />
    </>
  );
}
