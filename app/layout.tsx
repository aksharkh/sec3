import type { Metadata, Viewport } from "next";
import { Inter_Tight, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Cursor } from "@/components/ui/Cursor";
import { Preloader } from "@/components/layout/Preloader";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";

const sans = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
});

const serif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://secureknots.com"),
  title: {
    default: "SecureKnots — Many frameworks. One secure knot.",
    template: "%s — SecureKnots",
  },
  description:
    "Practitioner-led compliance advisory and audit readiness for SOC 2, ISO 27001, FedRAMP, CMMC, PCI DSS, HIPAA, ISO 42001 and 20+ more frameworks. Assess once, comply to many.",
  keywords: ["SOC 2", "ISO 27001", "FedRAMP", "CMMC", "NIST 800-53", "PCI DSS", "HIPAA", "ISO 42001", "compliance consulting", "audit readiness"],
  openGraph: {
    type: "website",
    siteName: "SecureKnots",
    title: "SecureKnots — Many frameworks. One secure knot.",
    description: "Assess once, comply to many. Practitioner-led compliance across 29 frameworks.",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#f3f0e8",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" id="top" className={`${sans.variable} ${serif.variable} ${mono.variable} antialiased`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-ink">
          Skip to content
        </a>
        <SmoothScroll />
        <Preloader />
        <Cursor />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
