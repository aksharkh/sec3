import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { MeridianLoader } from "@/components/meridian/MeridianLoader";
import { MeridianNav } from "@/components/meridian/MeridianNav";
import { MeridianFooter } from "@/components/meridian/MeridianFooter";
import { PageTransition } from "@/components/providers/PageTransition";
import { BookingModal } from "@/components/overlays/BookingModal";
import { SearchPalette } from "@/components/overlays/SearchPalette";
import { CookieBanner } from "@/components/overlays/CookieBanner";
import { Toaster } from "@/components/overlays/Toaster";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { InteractiveFX } from "@/components/providers/InteractiveFX";

const sans = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const serif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
  themeColor: "#fbfaf7",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" id="top" className={`${sans.variable} ${serif.variable} ${mono.variable} antialiased`}>
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
        <MeridianLoader />
        <PageTransition />
        <ScrollProgress />
        <InteractiveFX />
        <MeridianNav />
        <main id="main">{children}</main>
        <MeridianFooter />
        <BookingModal />
        <SearchPalette />
        <CookieBanner />
        <Toaster />
      </body>
    </html>
  );
}
