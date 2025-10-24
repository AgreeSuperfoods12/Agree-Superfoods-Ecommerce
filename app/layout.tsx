// app/layout.tsx
import "@/styles/globals.css";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

// Guard against bad env values so metadataBase never crashes
const metadataBase = (() => {
  try {
    return new URL(SITE_URL);
  } catch {
    return undefined;
  }
})();

const siteName = "Phenomena";
const defaultTitle = `${siteName} — Blog & Store`;
const defaultDescription = "Health & wellness insights, product updates, and guides.";

export const metadata: Metadata = {
  metadataBase,
  title: { default: defaultTitle, template: `%s • ${siteName}` },
  description: defaultDescription,
  robots: { index: true, follow: true },

  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName,
    title: defaultTitle,
    description: defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
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
