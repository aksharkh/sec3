import type { NextConfig } from "next";
import path from "node:path";

// Old WordPress URLs → new structure, so existing search rankings and links survive the relaunch.
const legacy: Record<string, string> = {
  "/about-us": "/about",
  "/contact-us": "/contact",
  "/compliance": "/frameworks",
  "/regulatory-compliance": "/frameworks",
  "/security-testing": "/services/testing",
  "/blog": "/insights",
  "/nist-csf": "/frameworks/nist-csf",
  "/itgc": "/frameworks/itgc",
  "/soc1": "/frameworks/soc-1",
  "/soc2": "/frameworks/soc-2",
  "/soc3": "/frameworks/soc-3",
  "/iso-27001": "/frameworks/iso-27001",
  "/iso-27701": "/frameworks/iso-27701",
  "/iso-42001": "/frameworks/iso-42001",
  "/iso-9001": "/frameworks/iso-9001",
  "/iso-20000": "/frameworks/iso-20000",
  "/iso-22301": "/frameworks/iso-22301",
  "/iso-41001": "/frameworks/iso-41001",
  "/iso-41001-ohs": "/frameworks/iso-45001",
  "/risk-assessment": "/frameworks/pci-risk-assessment",
  "/pci-compliance-services": "/frameworks/pci-dss",
  "/unified-security-audits": "/frameworks/unified-audits",
  "/ccpa": "/frameworks/ccpa",
  "/gdpr": "/frameworks/gdpr",
  "/hipaa": "/frameworks/hipaa",
  "/pdpa": "/frameworks/pdpa",
  "/dpdpa": "/frameworks/dpdpa",
  "/dora": "/frameworks/dora",
  "/sebi-cyber-security-frameworks": "/frameworks/sebi-cscrf",
  "/regulatory-compliance/fedrampfederal-risk-and-authorization-management-program": "/frameworks/fedramp",
  "/regulatory-compliance/stateramp": "/frameworks/stateramp",
  "/regulatory-compliance/cmmc": "/frameworks/cmmc",
  "/regulatory-compliance/itar-international-traffic-in-arms-regulations": "/frameworks/itar",
  "/regulatory-compliance/ear-export-administration-regulations": "/frameworks/ear",
};

const nextConfig: NextConfig = {
  turbopack: { root: path.join(__dirname) },
  async redirects() {
    return Object.entries(legacy).flatMap(([source, destination]) => [
      { source, destination, permanent: true },
      { source: `${source}/`, destination, permanent: true },
    ]);
  },
};

export default nextConfig;
