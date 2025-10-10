// app/layout.tsx
import "@/styles/globals.css";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import type { Metadata } from "next";

// Use env with a fallback so metadataBase never crashes
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Phenomena — Blog & Store",
    template: "%s • Phenomena",
  },
  description: "Health & wellness insights, product updates, and guides.",
  robots: { index: true, follow: true },

  // Good global defaults (keep type = 'website')
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "Phenomena",
    title: "Phenomena — Blog & Store",
    description: "Health & wellness insights, product updates, and guides.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Phenomena — Blog & Store",
    description: "Health & wellness insights, product updates, and guides.",
  },
  icons: { shortcut: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
