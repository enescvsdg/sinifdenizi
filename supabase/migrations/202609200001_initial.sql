-- All application requests use the caller's JWT. No service-role key is needed.
create table public.profiles (
 id uuid primary key references auth.users on delete cascade,
 role text not null check(role in ('teacher','parent')),
 name text not null check(char_length(name) between 1 and 100)
);
create function public.handle_new_user() returns trigger language plpgsql security definer set search_path='' as $$
begin
 insert into public.profiles(id,role,name) values(new.id,
 case when new.raw_user_meta_data->>'role'='teacher' then 'teacher' else 'parent' end,
 left(coalesce(nullif(new.raw_user_meta_data->>'name',''),'Kullanıcı'),100));
 return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create table public.classes (
 id uuid primary key default gen_random_uuid(), teacher_id uuid not null references public.profiles,
 name text not null check(char_length(name) between 1 and 80), grade text not null default '',
 class_xp integer not null default 0 check(class_xp>=0), decor_level integer not null default 0,
 show_names boolean not null default false, created_at timestamptz not null default now()
);
create table public.students (
 id uuid primary key default gen_random_uuid(), class_id uuid not null references public.classes on delete cascade,
 name text not null check(char_length(name) between 2 and 100), student_number text,
 photo_path text, fish_type text not null default 'clown' check(fish_type in ('clown','blue-tang','yellow-tang','butterfly','lionfish','puffer','seahorse','manta','turtle','shark','octopus','jellyfish')),
 fish_variant text not null default 'original', xp integer not null default 0 check(xp>=0), feed integer not null default 0 check(feed>=0),
 level integer generated always as (1+xp/100) stored,
 created_at timestamptz not null default now()
);
create table public.parent_student_links (
 parent_id uuid not null references public.profiles on delete cascade,
 student_id uuid not null references public.students on delete cascade,
 primary key(parent_id,student_id)
);
create table public.tasks (
 id uuid primary key default gen_random_uuid(), class_id uuid not null references public.classes on delete cascade,
 teacher_id uuid not null references public.profiles, title text not null check(char_length(title) between 2 and 120),
 description text not null default '' check(char_length(description)<=2000),
 type text not null check(type in ('ödev','okuma','davranış','katılım','proje','diğer')),
 xp_reward integer not null check(xp_reward between 1 and 500), feed_reward integer not null check(feed_reward between 0 and 100),
 due_date date, created_at timestamptz not null default now(), unique(id,class_id)
);
-- Composite foreign keys prohibit cross-class assignments even outside the UI.
alter table public.students add constraint students_id_class_unique unique(id,class_id);
create table public.task_assignments (
 id uuid primary key default gen_random_uuid(), task_id uuid not null, student_id uuid not null, class_id uuid not null,
 status text not null default 'pending' check(status in ('pending','completed','approved')),
 completed_at timestamptz, approved_at timestamptz,
 foreign key(task_id,class_id) references public.tasks(id,class_id) on delete cascade,
 foreign key(student_id,class_id) references public.students(id,class_id) on delete cascade,
 unique(task_id,student_id)
);
create table public.badges(id text primary key,name text not null,rule integer not null);
insert into public.badges values('first-task','İlk dalış',1),('ten-tasks','Deniz kaşifi',10),('fifty-tasks','Okyanus ustası',50);
create table public.student_badges(student_id uuid references public.students on delete cascade,badge_id text references public.badges,earned_at timestamptz not null default now(),primary key(student_id,badge_id));
create table public.class_unlocks(class_id uuid references public.classes on delete cascade,unlock_key integer not null,unlocked_at timestamptz not null default now(),primary key(class_id,unlock_key));
create table public.announcements (
 id uuid primary key default gen_random_uuid(),class_id uuid not null references public.classes on delete cascade,
 teacher_id uuid not null references public.profiles,title text not null check(char_length(title) between 2 and 120),
 body text not null check(char_length(body) between 2 and 3000),visible_to_parents boolean not null default false,created_at timestamptz not null default now()
);
create index on public.classes(teacher_id);
create index on public.students(class_id);
create index on public.parent_student_links(student_id);
create index on public.tasks(class_id);
create index on public.task_assignments(student_id);
create index on public.task_assignments(class_id,status);
create index on public.announcements(class_id);

create function public.is_teacher() returns boolean language sql stable security definer set search_path='' as $$select exists(select 1 from public.profiles where id=auth.uid() and role='teacher')$$;
create function public.owns_class(cid uuid) returns boolean language sql stable security definer set search_path='' as $$select exists(select 1 from public.classes where id=cid and teacher_id=auth.uid())$$;
create function public.can_read_student(sid uuid) returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.students s join public.classes c on c.id=s.class_id where s.id=sid and c.teacher_id=auth.uid())
 or exists(select 1 from public.parent_student_links where student_id=sid and parent_id=auth.uid())$$;
create function public.can_read_class(cid uuid) returns boolean language sql stable security definer set search_path='' as $$
 select public.owns_class(cid) or exists(select 1 from public.students s join public.parent_student_links l on l.student_id=s.id where s.class_id=cid and l.parent_id=auth.uid())$$;

alter table public.profiles enable row level security;
alter table public.classes enable row level security;
alter table public.students enable row level security;
alter table public.parent_student_links enable row level security;
alter table public.tasks enable row level security;
alter table public.task_assignments enable row level security;
alter table public.badges enable row level security;
alter table public.student_badges enable row level security;
alter table public.class_unlocks enable row level security;
alter table public.announcements enable row level security;
create policy profile_read on public.profiles for select to authenticated using(id=auth.uid());
create policy class_read on public.classes for select to authenticated using(public.can_read_class(id));
create policy class_create on public.classes for insert to authenticated with check(teacher_id=auth.uid() and public.is_teacher());
create policy class_edit on public.classes for update to authenticated using(public.owns_class(id)) with check(teacher_id=auth.uid());
create policy student_read on public.students for select to authenticated using(public.can_read_student(id));
create policy student_create on public.students for insert to authenticated with check(public.owns_class(class_id));
create policy student_edit on public.students for update to authenticated using(public.owns_class(class_id)) with check(public.owns_class(class_id));
create policy student_delete on public.students for delete to authenticated using(public.owns_class(class_id));
create policy link_read on public.parent_student_links for select to authenticated using(parent_id=auth.uid() or exists(select 1 from public.students where id=student_id and public.owns_class(class_id)));
create policy task_read on public.tasks for select to authenticated using(public.owns_class(class_id) or exists(select 1 from public.task_assignments a where a.task_id=tasks.id and public.can_read_student(a.student_id)));
create policy assignment_read on public.task_assignments for select to authenticated using(public.can_read_student(student_id));
create policy badge_read on public.badges for select to authenticated using(true);
create policy student_badge_read on public.student_badges for select to authenticated using(public.can_read_student(student_id));
create policy unlock_read on public.class_unlocks for select to authenticated using(public.can_read_class(class_id));
create policy announcement_read on public.announcements for select to authenticated using(public.owns_class(class_id) or (visible_to_parents and public.can_read_class(class_id)));
create policy announcement_create on public.announcements for insert to authenticated with check(public.owns_class(class_id) and teacher_id=auth.uid());

-- Restrict columns: rewards, ownership and role cannot be forged through REST.
revoke all on all tables in schema public from anon,authenticated;
grant select on public.profiles,public.classes,public.students,public.parent_student_links,public.tasks,public.task_assignments,public.badges,public.student_badges,public.class_unlocks,public.announcements to authenticated;
grant insert(teacher_id,name,grade,show_names) on public.classes to authenticated;
grant update(name,grade,show_names) on public.classes to authenticated;
grant insert(class_id,name,student_number,fish_type) on public.students to authenticated;
grant update(name,student_number,fish_type,photo_path) on public.students to authenticated;
grant delete on public.students to authenticated;
grant insert(class_id,teacher_id,title,body,visible_to_parents) on public.announcements to authenticated;

create function public.save_task(p_id uuid,p_class uuid,p_title text,p_description text,p_type text,p_xp integer,p_feed integer,p_due date,p_students uuid[]) returns uuid language plpgsql security definer set search_path='' as $$
declare tid uuid;
begin
 if not public.owns_class(p_class) then raise exception 'Forbidden'; end if;
 if coalesce(cardinality(p_students),0)=0 or cardinality(p_students)>200 or exists(select 1 from unnest(p_students) s where not exists(select 1 from public.students where id=s and class_id=p_class)) then raise exception 'Invalid students'; end if;
 if p_id is null then
  insert into public.tasks(class_id,teacher_id,title,description,type,xp_reward,feed_reward,due_date) values(p_class,auth.uid(),p_title,p_description,p_type,p_xp,p_feed,p_due) returning id into tid;
 else
  perform 1 from public.tasks where id=p_id and class_id=p_class for update;
  if not found then raise exception 'Not found'; end if;
  if exists(select 1 from public.task_assignments where task_id=p_id and status='approved') then raise exception 'Approved task is immutable'; end if;
  update public.tasks set title=p_title,description=p_description,type=p_type,xp_reward=p_xp,feed_reward=p_feed,due_date=p_due where id=p_id;
  delete from public.task_assignments where task_id=p_id and not(student_id=any(p_students));
  tid:=p_id;
 end if;
 insert into public.task_assignments(task_id,student_id,class_id) select tid,s,p_class from unnest(p_students) s on conflict(task_id,student_id) do nothing;
 return tid;
end $$;
create function public.delete_task(p_id uuid) returns void language plpgsql security definer set search_path='' as $$
begin
 perform 1 from public.tasks where id=p_id and public.owns_class(class_id) for update;
 if not found then raise exception 'Forbidden'; end if;
 if exists(select 1 from public.task_assignments where task_id=p_id and status='approved') then raise exception 'Approved task is immutable'; end if;
 delete from public.tasks where id=p_id;
end $$;
create function public.approve_assignment(p_id uuid) returns void language plpgsql security definer set search_path='' as $$
declare a public.task_assignments; t public.tasks; total integer; successes integer;
begin
 -- Lock task before assignment, matching save/delete lock order.
 select t1.* into t from public.tasks t1 join public.task_assignments a1 on a1.task_id=t1.id where a1.id=p_id for update of t1;
 if not found or not public.owns_class(t.class_id) then raise exception 'Forbidden'; end if;
 select * into a from public.task_assignments where id=p_id for update;
 if a.status='approved' then return; end if;
 update public.task_assignments set status='approved',completed_at=coalesce(completed_at,now()),approved_at=now() where id=p_id;
 update public.students set xp=xp+t.xp_reward,feed=feed+t.feed_reward where id=a.student_id;
 update public.classes set class_xp=class_xp+t.xp_reward where id=t.class_id returning class_xp into total;
 update public.classes set decor_level=(select count(*)-1 from unnest(array[0,300,750,1500,2500,4000,6000,9000]) x where x<=total) where id=t.class_id;
 insert into public.class_unlocks(class_id,unlock_key) select t.class_id,ord::integer-1 from unnest(array[0,300,750,1500,2500,4000,6000,9000]) with ordinality as u(x,ord) where x<=total on conflict do nothing;
 select count(*) into successes from public.task_assignments where student_id=a.student_id and status='approved';
 insert into public.student_badges(student_id,badge_id) select a.student_id,id from public.badges where rule<=successes on conflict do nothing;
end $$;
create function public.link_parent(p_student uuid,p_email text) returns void language plpgsql security definer set search_path='' as $$
declare pid uuid;
begin
 if not exists(select 1 from public.students where id=p_student and public.owns_class(class_id)) then raise exception 'Forbidden'; end if;
 select u.id into pid from auth.users u join public.profiles p on p.id=u.id where lower(u.email)=lower(trim(p_email)) and p.role='parent' and u.email_confirmed_at is not null;
 if pid is null then raise exception 'Verified parent account not found'; end if;
 insert into public.parent_student_links values(pid,p_student) on conflict do nothing;
end $$;
create function public.unlink_parent(p_student uuid,p_parent uuid) returns void language plpgsql security definer set search_path='' as $$
begin
 if not exists(select 1 from public.students where id=p_student and public.owns_class(class_id)) then raise exception 'Forbidden'; end if;
 delete from public.parent_student_links where parent_id=p_parent and student_id=p_student;
end $$;
create function public.can_read_photo(path text) returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.students where photo_path=path and public.can_read_student(id))$$;
create function public.can_write_photo(path text) returns boolean language sql stable security definer set search_path='' as $$
 select split_part(path,'/',1)=auth.uid()::text and exists(select 1 from public.students where id::text=split_part(path,'/',2) and public.owns_class(class_id))$$;
create function public.validate_photo_path() returns trigger language plpgsql set search_path='' as $$
begin
 if new.photo_path is not null and (split_part(new.photo_path,'/',2)<>new.id::text or not public.can_write_photo(new.photo_path)) then raise exception 'Invalid photo owner'; end if;
 return new;
end $$;
create trigger student_photo_owner before update of photo_path on public.students for each row execute function public.validate_photo_path();
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('student-photos','student-photos',false,3145728,array['image/jpeg','image/png','image/webp']);
create policy photo_read on storage.objects for select to authenticated using(bucket_id='student-photos' and (public.can_read_photo(name) or public.can_write_photo(name)));
create policy photo_insert on storage.objects for insert to authenticated with check(bucket_id='student-photos' and public.can_write_photo(name));
create policy photo_delete on storage.objects for delete to authenticated using(bucket_id='student-photos' and public.can_write_photo(name));
revoke execute on all functions in schema public from public,anon,authenticated;
grant execute on function public.is_teacher(),public.owns_class(uuid),public.can_read_student(uuid),public.can_read_class(uuid),public.can_read_photo(text),public.can_write_photo(text),public.save_task(uuid,uuid,text,text,text,integer,integer,date,uuid[]),public.delete_task(uuid),public.approve_assignment(uuid),public.link_parent(uuid,text),public.unlink_parent(uuid,uuid) to authenticated;
