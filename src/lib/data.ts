import 'server-only';
import type { PortalData, Student } from './domain';
import { requireSession } from './session';
export async function loadPortal() {
  const session = await requireSession();
  const { db } = session;
  // PostgREST limits each response. Page in stable key order so reports include
  // more than the default 1,000 assignments in an active classroom.
  async function allRows(table: string, keys: string[]) {
    const rows: Record<string, unknown>[] = [];
    for (let from = 0; ; from += 1000) {
      let query = db
        .from(table)
        .select('*')
        .range(from, from + 999);
      for (const key of keys) query = query.order(key);
      const result = await query;
      if (result.error) return { data: null, error: result.error };
      rows.push(...result.data);
      if (result.data.length < 1000) return { data: rows, error: null };
    }
  }
  const results = await Promise.all([
    allRows('classes', ['created_at', 'id']),
    allRows('students', ['name', 'id']),
    allRows('tasks', ['created_at', 'id']),
    allRows('task_assignments', ['id']),
    allRows('announcements', ['created_at', 'id']),
    allRows('student_badges', ['student_id', 'badge_id']),
    allRows('parent_student_links', ['parent_id', 'student_id']),
  ]);
  if (results.some((r) => r.error))
    throw new Error('Veriler yüklenemedi. Veritabanı kurulumu ve bağlantısını kontrol edin.');
  const students = await Promise.all(
    (results[1].data as Student[]).map(async (s) => {
      if (!s.photo_path) return s;
      const { data } = await db.storage.from('student-photos').createSignedUrl(s.photo_path, 300);
      return { ...s, photo_url: data?.signedUrl };
    }),
  );
  const data = {
    classes: results[0].data,
    students,
    tasks: results[2].data?.reverse(),
    assignments: results[3].data,
    announcements: results[4].data?.reverse(),
    badges: results[5].data,
  } as PortalData;
  return {
    ...session,
    data,
    links: results[6].data as { parent_id: string; student_id: string }[],
  };
}
