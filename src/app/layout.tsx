import type { Metadata, Viewport } from "next";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/inter";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BottomNav } from "@/components/NavLinks";
import { PWARegister } from "@/components/PWARegister";
import { Analytics } from "@/components/Analytics";
import { SITE_URL } from "@/lib/utils";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Welcome to Chattanooga — Explore the Scenic City Like a Local", template: "%s · Welcome to Chattanooga" },
  description:
    "A local's guide to Chattanooga, Tennessee: neighborhoods, independent shops and restaurants, family fun, outdoor adventures, the Walnut Street Bridge, events, and the 7-day forecast.",
  applicationName: "Welcome to Chattanooga",
  openGraph: {
    type: "website",
    siteName: "Welcome to Chattanooga",
    images: [{ url: "/images/tennessee-river.jpg", width: 1920, height: 1080, alt: "Downtown Chattanooga, the Walnut Street Bridge, and Lookout Mountain" }],
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/icons/icon-192.png", apple: "/icons/apple-touch-icon.png" },
  appleWebApp: { capable: true, title: "Chattanooga", statusBarStyle: "default" },
};

export const viewport: Viewport = { themeColor: "#1E7B6E", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">
        <a href="#main" className="skip-link">Skip to content</a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="outline-none">{children}</main>
        <SiteFooter />
        <BottomNav />
        <PWARegister />
        <Analytics />
      </body>
    </html>
  );
}
