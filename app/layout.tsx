import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { SignalLoader } from "@/components/signal/SignalLoader";
import { SignalNav } from "@/components/signal/SignalNav";
import { SignalFooter } from "@/components/signal/SignalFooter";
import { PageTransition } from "@/components/providers/PageTransition";
import { BookingModal } from "@/components/overlays/BookingModal";
import { SearchPalette } from "@/components/overlays/SearchPalette";
import { CookieBanner } from "@/components/overlays/CookieBanner";
import { Toaster } from "@/components/overlays/Toaster";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { InteractiveFX } from "@/components/providers/InteractiveFX";

const sans = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
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
  themeColor: "#0d0d0e",
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
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-ink">
          Skip to content
        </a>
        <SmoothScroll />
        <SignalLoader />
        <PageTransition />
        <ScrollProgress />
        <InteractiveFX />
        <SignalNav />
        <main id="main">{children}</main>
        <SignalFooter />
        <BookingModal />
        <SearchPalette />
        <CookieBanner />
        <Toaster />
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
