import type { Metadata } from "next";
import { WelcomePage } from "@/components/school/pages/welcome";

export const metadata: Metadata = { title: "Hoş geldiniz" };

export default function Page() {
  return <WelcomePage />;
}
