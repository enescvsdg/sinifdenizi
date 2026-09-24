import type { Metadata, Viewport } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "SınıfDenizi · Öğren. Kazan. Büyüt.",
    template: "%s · SınıfDenizi",
  },
  description:
    "Her sınıfın bir denizi var. Öğretmen ve veli için sınıfın gelişim yolculuğu.",
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
