import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, DM_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { ThreadLoader } from "@/components/thread/ThreadLoader";
import { ThreadRail } from "@/components/thread/ThreadRail";
import { ThreadFooter } from "@/components/thread/ThreadFooter";
import { PageTransition } from "@/components/providers/PageTransition";
import { BookingModal } from "@/components/overlays/BookingModal";
import { SearchPalette } from "@/components/overlays/SearchPalette";
import { CookieBanner } from "@/components/overlays/CookieBanner";
import { Toaster } from "@/components/overlays/Toaster";
import { InteractiveFX } from "@/components/providers/InteractiveFX";

const sans = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  display: "swap",
});

const mono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://secureknots.com"),
  title: {
    default: "SecureKnots | Many frameworks. One secure knot.",
    template: "%s | SecureKnots",
  },
  description:
    "Practitioner-led compliance advisory and audit readiness for SOC 2, ISO 27001, FedRAMP, CMMC, PCI DSS, HIPAA, ISO 42001 and 20+ more frameworks. Assess once, comply to many.",
  keywords: ["SOC 2", "ISO 27001", "FedRAMP", "CMMC", "NIST 800-53", "PCI DSS", "HIPAA", "ISO 42001", "compliance consulting", "audit readiness"],
  openGraph: {
    type: "website",
    siteName: "SecureKnots",
    title: "SecureKnots | Many frameworks. One secure knot.",
    description: "Assess once, comply to many. Practitioner-led compliance across 29 frameworks.",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#f2f1ec",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" id="top" className={`${sans.variable} ${mono.variable} antialiased`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "SecureKnots",
              url: "https://secureknots.com",
              email: "contact@secureknots.com",
              telephone: "+1-302-608-6708",
              address: { "@type": "PostalAddress", streetAddress: "1207 Delaware Ave #749", addressLocality: "Wilmington", addressRegion: "DE", postalCode: "19806", addressCountry: "US" },
              areaServed: ["US", "IN", "EU"],
            }),
          }}
        />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-ivory">
          Skip to content
        </a>
        <SmoothScroll />
        <ThreadLoader />
        <PageTransition />
        <InteractiveFX />
        <ThreadRail />
        <main id="main">{children}</main>
        <ThreadFooter />
        <BookingModal />
        <SearchPalette />
        <CookieBanner />
        <Toaster />
      </body>
    </html>
  );
}
