import type { Metadata } from "next";
import { ReportsPage } from "@/components/school/pages/reports";
import { titles } from "@/lib/routes";

export const metadata: Metadata = { title: titles.reports };

export default function Page() {
  return <ReportsPage />;
}
