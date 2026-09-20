import 'server-only';
import { redirect } from 'next/navigation';
import { configured, createClient } from './supabase/server';
export async function requireSession(role?: 'teacher' | 'parent') {
  if (!configured()) redirect('/giris?message=Kurulum%20tamamlanmadı');
  const db = await createClient();
  const {
    data: { user },
    error,
  } = await db.auth.getUser();
  if (error || !user) redirect('/giris');
  const { data: profile, error: profileError } = await db
    .from('profiles')
    .select('id,name,role')
    .eq('id', user.id)
    .single();
  if (profileError || !profile) throw new Error('Hesap profili yüklenemedi.');
  if (role && profile.role !== role) throw new Error('Bu işlem için yetkiniz yok.');
  return { db, user, profile: profile as { id: string; name: string; role: 'teacher' | 'parent' } };
}
