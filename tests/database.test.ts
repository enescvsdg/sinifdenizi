import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import { beforeAll, afterAll, describe, it, expect } from 'vitest';
const db = new PGlite();
const teacher = '11111111-1111-4111-8111-111111111111',
  other = '22222222-2222-4222-8222-222222222222',
  parent = '33333333-3333-4333-8333-333333333333';
const c1 = '44444444-4444-4444-8444-444444444444',
  c2 = '55555555-5555-4555-8555-555555555555';
const s1 = '66666666-6666-4666-8666-666666666666',
  s2 = '77777777-7777-4777-8777-777777777777',
  s3 = '88888888-8888-4888-8888-888888888888';
async function asUser(id: string, sql: string) {
  await db.exec(
    `reset role; select set_config('request.jwt.claim.sub','${id}',false); set role authenticated;`,
  );
  return db.query(sql);
}
beforeAll(async () => {
  await db.exec(`create role anon;create role authenticated;create schema auth;create schema storage;
 create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz,raw_user_meta_data jsonb);
 create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
 grant usage on schema auth,storage,public to authenticated,anon;grant execute on function auth.uid() to authenticated,anon;
 create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
 create table storage.objects(id uuid default gen_random_uuid(),bucket_id text,name text);alter table storage.objects enable row level security;
 grant select,insert,delete on storage.objects to authenticated;`);
  await db.exec(readFileSync('supabase/migrations/202609200001_initial.sql', 'utf8'));
  await db.exec(`insert into auth.users values('${teacher}','teacher@example.test',now(),' {"role":"teacher","name":"Öğretmen"}'),('${other}','other@example.test',now(),'{"role":"teacher","name":"Diğer öğretmen"}'),('${parent}','parent@example.test',now(),'{"role":"parent","name":"Veli"}');
 insert into public.classes(id,teacher_id,name) values('${c1}','${teacher}','3-A'),('${c2}','${other}','3-B');
 insert into public.students(id,class_id,name) values('${s1}','${c1}','Ada Yılmaz'),('${s2}','${c1}','Ege Demir'),('${s3}','${c2}','Elif Kaya');
 insert into public.parent_student_links values('${parent}','${s1}');`);
});
afterAll(async () => {
  await db.close();
});
describe.sequential('PostgreSQL RLS and atomic reward authorization', () => {
  let task: string, assignment: string;
  it('restricts teachers to their own classrooms', async () => {
    const r = await asUser(teacher, 'select * from public.students');
    expect(r.rows).toHaveLength(2);
    const c = await asUser(teacher, 'select * from public.classes');
    expect(c.rows).toHaveLength(1);
  });
  it('restricts a parent to the linked child, excluding classmates', async () => {
    const r = await asUser(parent, 'select id from public.students');
    expect(r.rows).toEqual([{ id: s1 }]);
  });
  it('rejects direct reward and role escalation', async () => {
    await expect(
      asUser(teacher, `update public.students set xp=999 where id='${s1}'`),
    ).rejects.toThrow();
    await expect(
      asUser(parent, `update public.profiles set role='teacher' where id='${parent}'`),
    ).rejects.toThrow();
    await expect(
      asUser(
        teacher,
        `insert into public.classes(teacher_id,name,class_xp) values('${teacher}','Hile',999)`,
      ),
    ).rejects.toThrow();
  });
  it('rejects parent writes and cross-class creation', async () => {
    await expect(
      asUser(parent, `insert into public.students(class_id,name) values('${c1}','Sahte Öğrenci')`),
    ).rejects.toThrow();
    await expect(
      asUser(teacher, `insert into public.students(class_id,name) values('${c2}','Sahte Öğrenci')`),
    ).rejects.toThrow();
  });
  it('atomically creates only same-class assignments', async () => {
    await expect(
      asUser(
        teacher,
        `select public.save_task(null,'${c1}','Görev','Açıklama','ödev',40,10,null,array['${s3}'::uuid])`,
      ),
    ).rejects.toThrow();
    const r = await asUser(
      teacher,
      `select public.save_task(null,'${c1}','Kitap oku','20 sayfa','okuma',300,10,null,array['${s1}'::uuid,'${s2}'::uuid]) as id`,
    );
    task = (r.rows[0] as { id: string }).id;
    const a = await asUser(
      teacher,
      `select id from public.task_assignments where student_id='${s1}'`,
    );
    assignment = (a.rows[0] as { id: string }).id;
  });
  it('lets parents see assigned task text but only their child assignment', async () => {
    expect((await asUser(parent, 'select * from public.tasks')).rows).toHaveLength(1);
    expect((await asUser(parent, 'select * from public.task_assignments')).rows).toHaveLength(1);
  });
  it('rejects parent and foreign teacher approval', async () => {
    await expect(
      asUser(parent, `select public.approve_assignment('${assignment}')`),
    ).rejects.toThrow();
    await expect(
      asUser(other, `select public.approve_assignment('${assignment}')`),
    ).rejects.toThrow();
  });
  it('awards once, records badge and unlock, and locks approved task edits', async () => {
    await asUser(teacher, `select public.approve_assignment('${assignment}')`);
    await asUser(teacher, `select public.approve_assignment('${assignment}')`);
    expect(
      (await asUser(teacher, `select xp,feed,level from public.students where id='${s1}'`)).rows,
    ).toEqual([{ xp: 300, feed: 10, level: 4 }]);
    expect(
      (await asUser(teacher, `select class_xp,decor_level from public.classes where id='${c1}'`))
        .rows,
    ).toEqual([{ class_xp: 300, decor_level: 1 }]);
    expect((await asUser(parent, 'select * from public.student_badges')).rows).toHaveLength(1);
    expect((await asUser(parent, 'select * from public.class_unlocks')).rows).toHaveLength(2);
    await expect(asUser(teacher, `select public.delete_task('${task}')`)).rejects.toThrow();
    await expect(
      asUser(
        teacher,
        `select public.save_task('${task}','${c1}','Değişiklik','','okuma',400,20,null,array['${s1}'::uuid])`,
      ),
    ).rejects.toThrow();
  });
  it('hides unshared announcements from parents', async () => {
    await asUser(
      teacher,
      `insert into public.announcements(class_id,teacher_id,title,body,visible_to_parents) values('${c1}','${teacher}','Özel not','Öğretmen notu',false),('${c1}','${teacher}','Herkese not','Paylaşılan not',true)`,
    );
    expect((await asUser(parent, 'select * from public.announcements')).rows).toHaveLength(1);
  });
  it('protects private photos and prevents parent upload', async () => {
    const path = `${teacher}/${s1}/portrait.jpg`;
    await asUser(
      teacher,
      `insert into storage.objects(bucket_id,name) values('student-photos','${path}')`,
    );
    await asUser(teacher, `update public.students set photo_path='${path}' where id='${s1}'`);
    expect((await asUser(parent, 'select * from storage.objects')).rows).toHaveLength(1);
    expect((await asUser(other, 'select * from storage.objects')).rows).toHaveLength(0);
    await expect(
      asUser(
        parent,
        `insert into storage.objects(bucket_id,name) values('student-photos','${parent}/${s1}/fake.jpg')`,
      ),
    ).rejects.toThrow();
  });
  it('rejects attempts to attach another student photo path', async () => {
    await expect(
      asUser(
        teacher,
        `update public.students set photo_path='${other}/${s3}/portrait.jpg' where id='${s1}'`,
      ),
    ).rejects.toThrow();
    await expect(
      asUser(
        teacher,
        `update public.students set photo_path='${teacher}/${s2}/portrait.jpg' where id='${s1}'`,
      ),
    ).rejects.toThrow();
  });
  it('revokes child and photo access when a teacher removes a parent link', async () => {
    await expect(
      asUser(other, `select public.unlink_parent('${s1}','${parent}')`),
    ).rejects.toThrow();
    await asUser(teacher, `select public.unlink_parent('${s1}','${parent}')`);
    expect((await asUser(parent, 'select * from public.students')).rows).toHaveLength(0);
    expect((await asUser(parent, 'select * from storage.objects')).rows).toHaveLength(0);
    await asUser(teacher, `select public.link_parent('${s1}','parent@example.test')`);
    expect((await asUser(parent, 'select * from public.students')).rows).toHaveLength(1);
  });
  it('denies anonymous data access', async () => {
    await db.exec('reset role;set role anon');
    await expect(db.query('select * from public.students')).rejects.toThrow();
    await expect(db.query(`select public.can_read_student('${s1}')`)).rejects.toThrow();
  });
});
