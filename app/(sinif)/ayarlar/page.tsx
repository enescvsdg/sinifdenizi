import type { Metadata } from "next";
import { SettingsPage } from "@/components/school/pages/settings";
import { titles } from "@/lib/routes";

export const metadata: Metadata = { title: titles.settings };

export default function Page() {
  return <SettingsPage />;
}
