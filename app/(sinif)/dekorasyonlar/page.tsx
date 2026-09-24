import type { Metadata } from "next";
import { DecorPage } from "@/components/school/pages/decor";
import { titles } from "@/lib/routes";

export const metadata: Metadata = { title: titles.decor };

export default function Page() {
  return <DecorPage />;
}
