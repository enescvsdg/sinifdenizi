import type { MetadataRoute } from "next";

export const dynamic = "force-static";

/**
 * Install details for phones and tablets. Addresses are relative to the
 * manifest itself, so they stay right under any base path (GitHub Pages
 * serves the app from /sinifdenizi/).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SınıfDenizi",
    short_name: "SınıfDenizi",
    description:
      "Her sınıfın bir denizi var. Öğretmen ve veli için sınıfın gelişim yolculuğu.",
    lang: "tr",
    start_url: "./",
    scope: "./",
    display: "standalone",
    background_color: "#f4f8fc",
    theme_color: "#0b6ef3",
    icons: [
      { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
