import type { Metadata } from "next";
import { DashboardPage } from "@/components/school/pages/dashboard";
import { titles } from "@/lib/routes";

export const metadata: Metadata = { title: titles.dashboard };

export default function Page() {
  return <DashboardPage />;
}
