'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { createClient, configured } from '@/lib/supabase/server';
import { requireSession } from '@/lib/session';
import {
  announcementSchema,
  classSchema,
  credentialsSchema,
  studentSchema,
  taskSchema,
  uuid,
} from '@/lib/validation';
export type Result = { error?: string; success?: string };
const str = (f: FormData, k: string) => String(f.get(k) || '');
function fail(error: unknown): Result {
  return {
    error:
      error instanceof z.ZodError
        ? 'Alanları kontrol edin. Eksik veya geçersiz bilgi var.'
        : error instanceof Error
          ? error.message
          : 'İşlem tamamlanamadı. Lütfen yeniden deneyin.',
  };
}
export async function authenticate(_: Result, form: FormData): Promise<Result> {
  if (!configured())
    return { error: 'Bağlantı henüz kurulmadı. Kurulum için README dosyasını izleyin.' };
  const parsed = credentialsSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: 'Geçerli bir e-posta ve en az 8 karakterli şifre girin.' };
  const db = await createClient();
  const { email, password, role } = parsed.data;
  if (str(form, 'mode') === 'register') {
    const name = str(form, 'name').trim();
    if (name.length < 2 || name.length > 100) return { error: 'Adınızı ve soyadınızı girin.' };
    const site = process.env.NEXT_PUBLIC_SITE_URL;
    if (!site) return { error: 'Hesap oluşturma için site adresi yapılandırılmalı.' };
    const { error } = await db.auth.signUp({
      email,
      password,
      options: { data: { name, role }, emailRedirectTo: `${site}/auth/confirm` },
    });
    if (error) return { error: 'Hesap oluşturulamadı. Bilgileri kontrol edip yeniden deneyin.' };
    return {
      success: 'E-postanıza gelen bağlantıyla hesabınızı doğrulayın, ardından giriş yapın.',
    };
  }
  const { data, error } = await db.auth.signInWithPassword({ email, password });
  if (error) return { error: 'E-posta veya şifre hatalı; e-posta doğrulamanızı da kontrol edin.' };
  const { data: profile } = await db
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single();
  if (!profile || profile.role !== role) {
    await db.auth.signOut();
    return { error: 'Hesabınıza uygun öğretmen veya veli girişini seçin.' };
  }
  redirect('/panel');
}
export async function signOut() {
  const db = await createClient();
  await db.auth.signOut();
  redirect('/giris');
}
export async function mutate(_: Result, form: FormData): Promise<Result> {
  const { db, user } = await requireSession('teacher');
  try {
    const action = str(form, 'action');
    let error: { message: string } | null = null;
    if (action === 'class') {
      const values = classSchema.parse({
        name: str(form, 'name'),
        grade: str(form, 'grade'),
        show_names: form.has('show_names'),
      });
      const id = str(form, 'id');
      ({ error } = id
        ? await db.from('classes').update(values).eq('id', uuid.parse(id)).select('id').single()
        : await db.from('classes').insert({ ...values, teacher_id: user.id }));
    } else if (action === 'student') {
      const values = studentSchema.parse(Object.fromEntries(form));
      const id = str(form, 'id');
      if (id) {
        const { class_id, ...editable } = values;
        void class_id;
        ({ error } = await db
          .from('students')
          .update(editable)
          .eq('id', uuid.parse(id))
          .select('id')
          .single());
      } else {
        ({ error } = await db.from('students').insert(values));
      }
    } else if (action === 'delete-student') {
      const id = uuid.parse(str(form, 'id'));
      const { data: student } = await db
        .from('students')
        .select('photo_path')
        .eq('id', id)
        .single();
      if (!student) throw new Error('Öğrenci bulunamadı.');
      if (student.photo_path) {
        const deleted = await db.storage.from('student-photos').remove([student.photo_path]);
        if (deleted.error) throw new Error('Fotoğraf silinemedi; öğrenci kaydı korundu.');
      }
      ({ error } = await db.from('students').delete().eq('id', id).select('id').single());
    } else if (action === 'photo') {
      const id = uuid.parse(str(form, 'id'));
      const file = form.get('photo');
      if (!(file instanceof File) || !file.size || file.size > 3 * 1024 * 1024)
        throw new Error('En fazla 3 MB boyutunda fotoğraf seçin.');
      const bytes = Buffer.from(await file.arrayBuffer());
      const ext = bytes.subarray(0, 3).equals(Buffer.from([255, 216, 255]))
        ? 'jpg'
        : bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
          ? 'png'
          : bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP'
            ? 'webp'
            : null;
      if (!ext) throw new Error('Yalnızca JPEG, PNG veya WebP fotoğraf yükleyin.');
      const { data: student, error: readError } = await db
        .from('students')
        .select('photo_path')
        .eq('id', id)
        .single();
      if (readError) throw new Error('Öğrenci bulunamadı.');
      const path = `${user.id}/${id}/${randomUUID()}.${ext}`;
      const upload = await db.storage.from('student-photos').upload(path, bytes, {
        contentType: ext === 'jpg' ? 'image/jpeg' : `image/${ext}`,
        upsert: false,
      });
      if (upload.error) throw new Error('Fotoğraf yüklenemedi.');
      const saved = await db
        .from('students')
        .update({ photo_path: path })
        .eq('id', id)
        .select('id')
        .single();
      if (saved.error) {
        await db.storage.from('student-photos').remove([path]);
        throw new Error('Fotoğraf kaydedilemedi.');
      }
      if (student.photo_path) await db.storage.from('student-photos').remove([student.photo_path]);
    } else if (action === 'task') {
      const values = taskSchema.parse({
        ...Object.fromEntries(form),
        student_ids: form.getAll('student_ids'),
      });
      ({ error } = await db.rpc('save_task', {
        p_id: str(form, 'id') ? uuid.parse(str(form, 'id')) : null,
        p_class: values.class_id,
        p_title: values.title,
        p_description: values.description,
        p_type: values.type,
        p_xp: values.xp_reward,
        p_feed: values.feed_reward,
        p_due: values.due_date || null,
        p_students: values.student_ids,
      }));
    } else if (action === 'approve') {
      ({ error } = await db.rpc('approve_assignment', { p_id: uuid.parse(str(form, 'id')) }));
    } else if (action === 'delete-task') {
      ({ error } = await db.rpc('delete_task', { p_id: uuid.parse(str(form, 'id')) }));
    } else if (action === 'link') {
      ({ error } = await db.rpc('link_parent', {
        p_student: uuid.parse(str(form, 'id')),
        p_email: z.email().parse(str(form, 'email')),
      }));
      if (error)
        throw new Error(
          'Doğrulanmış veli hesabı bulunamadı veya bağlantı kurulamadı. Velinin önce kayıt olup e-postasını doğrulaması gerekir.',
        );
    } else if (action === 'unlink') {
      ({ error } = await db.rpc('unlink_parent', {
        p_student: uuid.parse(str(form, 'id')),
        p_parent: uuid.parse(str(form, 'parent_id')),
      }));
    } else if (action === 'announcement') {
      const values = announcementSchema.parse({
        ...Object.fromEntries(form),
        visible_to_parents: form.has('visible_to_parents'),
      });
      ({ error } = await db.from('announcements').insert({ ...values, teacher_id: user.id }));
    } else throw new Error('Geçersiz işlem.');
    if (error)
      throw new Error(
        'İşlem kaydedilemedi. Yetkilerinizi ve alanları kontrol edin. Onaylanmış görevler değiştirilemez.',
      );
    revalidatePath('/panel');
    return { success: 'Kaydedildi.' };
  } catch (error) {
    return fail(error);
  }
}
