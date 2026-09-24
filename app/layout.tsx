import type { Metadata, Viewport } from "next";
import "./globals.css";
const description =
  "Her sınıfın bir denizi var. Öğretmen ve veli için sınıfın gelişim yolculuğu.";
export const metadata: Metadata = {
  // Link previews need absolute image addresses; this is where GitHub Pages
  // serves the site (the base path is added to image addresses by Next.js).
  metadataBase: new URL("https://enescvsdg.github.io"),
  title: {
    default: "SınıfDenizi · Öğren. Kazan. Büyüt.",
    template: "%s · SınıfDenizi",
  },
  description,
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "SınıfDenizi",
    description,
  },
  twitter: { card: "summary_large_image" },
};
export const viewport: Viewport = { themeColor: "#0b6ef3" };
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
