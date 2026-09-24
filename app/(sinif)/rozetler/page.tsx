import type { Metadata } from "next";
import { BadgesPage } from "@/components/school/pages/badges";
import { titles } from "@/lib/routes";

export const metadata: Metadata = { title: titles.badges };

export default function Page() {
  return <BadgesPage />;
}
