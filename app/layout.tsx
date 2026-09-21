import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "SınıfDenizi · Öğren. Kazan. Büyüt.",
  description:
    "Her sınıfın bir denizi var. Öğretmen ve veli için sınıfın gelişim yolculuğu.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
