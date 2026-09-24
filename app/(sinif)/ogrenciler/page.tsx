import type { Metadata } from "next";
import { StudentsPage } from "@/components/school/pages/students";
import { titles } from "@/lib/routes";

export const metadata: Metadata = { title: titles.students };

export default function Page() {
  return <StudentsPage />;
}
