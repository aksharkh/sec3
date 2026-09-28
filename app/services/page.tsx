import type { Metadata } from "next";
import { PageHero } from "@/components/page/PageHero";
import { ServiceRows } from "@/components/services/ServiceRows";
import { Process } from "@/components/home/Process";
import { StoriesRail } from "@/components/home/StoriesRail";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Services",
  description: "Compliance advisory, audit readiness, unified audits, security testing and continuous compliance, one team, one program.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="What we do"
        title={
          <>
            Five services. <span className="em text-brand">One program.</span>
          </>
        }
        intro="Strategy, readiness, audit, testing and year-round operation, delivered by one team so nothing gets lost between vendors."
        actions={<Button href="#book">Book an assessment</Button>}
        art="services-hub"
      />
      <ServiceRows />
      <Process eyebrow="How it works" />
      <StoriesRail eyebrow="Results" />
      <FinalCTA eyebrow="Start here" />
    </>
  );
}
