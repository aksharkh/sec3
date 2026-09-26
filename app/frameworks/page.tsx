import type { Metadata } from "next";
import { frameworks } from "@/lib/frameworks";
import { PageHero } from "@/components/page/PageHero";
import { FrameworkExplorer } from "@/components/frameworks/FrameworkExplorer";
import { OverlapMap } from "@/components/home/OverlapMap";
import { ReadinessCheck } from "@/components/home/ReadinessCheck";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Frameworks",
  description: "SOC 2, ISO 27001, FedRAMP, CMMC, PCI DSS, HIPAA, ISO 42001, GDPR, DORA and more — 29 frameworks delivered as one unified program.",
};

export default function FrameworksPage() {
  return (
    <>
      <PageHero
        eyebrow={`(FW—01) ${frameworks.length} frameworks`}
        title={
          <>
            Every framework. <span className="serif text-brand">One method.</span>
          </>
        }
        intro="Security attestations, government authorisations, privacy laws, AI governance and management systems — scoped together, tested once and mapped everywhere."
        actions={
          <>
            <Button href="#book">Find my frameworks</Button>
            <Button href="#assess-once" variant="outline" magnetic={false}>
              See the overlap
            </Button>
          </>
        }
        art="frameworks-hub"
      />
      <FrameworkExplorer items={frameworks} />
      <OverlapMap eyebrow="(FW—02) Assess once" />
      <ReadinessCheck eyebrow="(FW—03) Not sure where to start?" />
      <FinalCTA eyebrow="(FW—04) Start here" />
    </>
  );
}
