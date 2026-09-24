import { SchoolProvider } from "@/components/school/state";
import { AppShell } from "@/components/school/shell";

export default function ClassroomLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SchoolProvider>
      <AppShell>{children}</AppShell>
    </SchoolProvider>
  );
}
