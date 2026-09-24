import type { Metadata } from "next";
import { TasksPage } from "@/components/school/pages/tasks";
import { titles } from "@/lib/routes";

export const metadata: Metadata = { title: titles.tasks };

export default function Page() {
  return <TasksPage />;
}
