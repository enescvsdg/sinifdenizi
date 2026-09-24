import type { Metadata } from "next";
import { ParentPage } from "@/components/school/pages/parent";
import { titles } from "@/lib/routes";

export const metadata: Metadata = { title: titles.parent };

export default function Page() {
  return <ParentPage />;
}
