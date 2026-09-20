import { Portal } from '@/components/portal';
import { demoData } from '@/lib/demo';
export default async function Demo({
  searchParams,
}: {
  searchParams: Promise<{
    view?: string;
    class?: string;
    child?: string;
    student?: string;
    role?: string;
  }>;
}) {
  const params = await searchParams;
  const parent = params.role === 'parent' || Boolean(params.child);
  const data = parent
    ? {
        ...demoData,
        students: demoData.students.slice(0, 2),
        assignments: demoData.assignments.filter((a) =>
          ['demo-0', 'demo-1'].includes(a.student_id),
        ),
      }
    : demoData;
  return (
    <Portal
      data={data}
      params={params}
      profile={{
        name: parent ? 'Ayşe Yılmaz' : 'Selin Öğretmen',
        role: parent ? 'parent' : 'teacher',
      }}
      demo
    />
  );
}
