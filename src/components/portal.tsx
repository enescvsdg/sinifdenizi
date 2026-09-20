import Link from 'next/link';
import Image from 'next/image';
import {
  Waves,
  LayoutDashboard,
  Users,
  BookOpen,
  ChartNoAxesCombined,
  Shell,
  ArrowUpRight,
  Plus,
  Bell,
  LogOut,
  ChevronRight,
  GraduationCap,
  Fish,
  Check,
  Flame,
  Star,
  Lock,
  MessageCircle,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { Aquarium } from './aquarium';
import { ActionForm } from './action-form';
import { signOut } from '@/app/actions';
import {
  fishTypes,
  fishNames,
  taskTypes,
  summarize,
  initials,
  unlocks,
  type PortalData,
  type Student,
  type Task,
} from '@/lib/domain';
type Params = { view?: string; class?: string; child?: string; student?: string };
type Props = {
  data: PortalData;
  profile: { name: string; role: 'teacher' | 'parent' };
  params: Params;
  demo?: boolean;
  links?: { parent_id: string; student_id: string }[];
};
const views = [
  ['overview', 'Genel bakış', LayoutDashboard],
  ['aquarium', 'Sınıf akvaryumu', Fish],
  ['students', 'Öğrenciler', Users],
  ['tasks', 'Görevler', BookOpen],
  ['rewards', 'Başarılar', Shell],
  ['reports', 'Raporlar', ChartNoAxesCombined],
  ['notes', 'Duyurular', MessageCircle],
] as const;
const titles: Record<string, string> = {
  overview: 'Her gün, biraz daha ileri.',
  aquarium: 'Bir sınıf. Kocaman bir deniz.',
  students: 'Her öğrencinin bir hikâyesi var.',
  tasks: 'Küçük görevler, büyük keşifler.',
  rewards: 'Çabanın en güzel karşılığı.',
  reports: 'Gelişimi birlikte izleyelim.',
  notes: 'Sınıftan güzel haberler.',
};
function Hidden({ name, value }: { name: string; value: string }) {
  return <input type="hidden" name={name} value={value} />;
}
function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="empty">
      <Waves size={32} />
      <p>{children}</p>
    </div>
  );
}
function Avatar({ student }: { student: Student }) {
  return (
    <span className="avatar">
      {student.photo_url ? (
        <Image src={student.photo_url} width={85} height={85} unoptimized alt="" />
      ) : (
        initials(student.name)
      )}
    </span>
  );
}
function SectionTitle({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {children}
    </div>
  );
}
function Metrics({ data }: { data: PortalData }) {
  const stats = summarize(data);
  return (
    <div className="metrics">
      {[
        [Users, data.students.length, 'Deniz dostu', 'Birlikte büyüyen bir sınıf'],
        [BookOpen, data.tasks.length, 'Sınıf görevi', `${stats.pending} öğrenci görevi bekliyor`],
        [
          ChartNoAxesCombined,
          `%${stats.participation}`,
          'Katılım oranı',
          'En az bir görev tamamlayan',
        ],
        [Flame, stats.feed, 'Kazanılan yem', `${stats.completed} tamamlanan görev`],
      ].map(([Icon, value, label, note], i) => {
        const I = Icon as typeof Users;
        return (
          <div className="metric" key={i}>
            <div className={`metric-icon tone-${i}`}>
              <I size={20} />
            </div>
            <span className="muted">{label as string}</span>
            <strong>{value as string | number}</strong>
            <small>{note as string}</small>
          </div>
        );
      })}
    </div>
  );
}
function StudentFields({ classId, student }: { classId: string; student?: Student }) {
  return (
    <>
      <Hidden name="action" value="student" />
      <Hidden name="class_id" value={classId} />
      {student && <Hidden name="id" value={student.id} />}
      <label>
        Ad soyad
        <input name="name" required minLength={2} maxLength={100} defaultValue={student?.name} />
      </label>
      <label>
        Öğrenci numarası <span className="muted">(isteğe bağlı)</span>
        <input name="student_number" maxLength={30} defaultValue={student?.student_number || ''} />
      </label>
      <label>
        Deniz dostu
        <select name="fish_type" defaultValue={student?.fish_type || 'clown'}>
          {fishTypes.map((f) => (
            <option key={f} value={f}>
              {fishNames[f]}
            </option>
          ))}
        </select>
      </label>
    </>
  );
}
function TaskFields({
  classId,
  students,
  task,
  assigned,
}: {
  classId: string;
  students: Student[];
  task?: Task;
  assigned?: string[];
}) {
  return (
    <>
      <Hidden name="action" value="task" />
      <Hidden name="class_id" value={classId} />
      {task && <Hidden name="id" value={task.id} />}
      <label>
        Görev başlığı
        <input name="title" required minLength={2} maxLength={120} defaultValue={task?.title} />
      </label>
      <label>
        Açıklama
        <textarea name="description" maxLength={2000} defaultValue={task?.description} />
      </label>
      <div className="fields">
        <label>
          Tür
          <select name="type" defaultValue={task?.type || 'ödev'}>
            {taskTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label>
          Son tarih
          <input name="due_date" type="date" defaultValue={task?.due_date || ''} />
        </label>
      </div>
      <div className="fields">
        <label>
          XP ödülü
          <input
            type="number"
            name="xp_reward"
            min={1}
            max={500}
            defaultValue={task?.xp_reward || 40}
            required
          />
        </label>
        <label>
          Yem ödülü
          <input
            type="number"
            name="feed_reward"
            min={0}
            max={100}
            defaultValue={task?.feed_reward ?? 10}
            required
          />
        </label>
      </div>
      <fieldset>
        <legend>Atanacak öğrenciler</legend>
        <p className="muted small">
          Yeni görevlerde tüm sınıf seçilidir. İstenmeyen seçimleri kaldırabilirsiniz.
        </p>
        <div className="checkbox-list">
          {students.map((s) => (
            <label key={s.id}>
              <input
                type="checkbox"
                name="student_ids"
                value={s.id}
                defaultChecked={!assigned || assigned.includes(s.id)}
              />
              {s.name}
            </label>
          ))}
        </div>
      </fieldset>
    </>
  );
}
export function Portal({ data, profile, params, demo = false, links = [] }: Props) {
  const parent = profile.role === 'parent';
  const child = data.students.find((s) => s.id === params.child) || data.students[0];
  const classroom =
    data.classes.find((c) => c.id === (parent ? child?.class_id : params.class)) || data.classes[0];
  const students = data.students.filter((s) =>
    parent ? s.id === child?.id : s.class_id === classroom?.id,
  );
  const studentIds = new Set(students.map((s) => s.id));
  const assignments = data.assignments.filter((a) => studentIds.has(a.student_id));
  const tasks = data.tasks.filter((t) =>
    parent ? assignments.some((a) => a.task_id === t.id) : t.class_id === classroom?.id,
  );
  const scoped: PortalData = {
    ...data,
    students,
    tasks,
    assignments,
    announcements: data.announcements.filter(
      (a) => a.class_id === classroom?.id && (!parent || a.visible_to_parents),
    ),
    badges: data.badges.filter((b) => studentIds.has(b.student_id)),
  };
  const requested = params.view || 'overview';
  const view = views.some((v) => v[0] === requested) ? requested : 'overview';
  const allowedView =
    parent && !['overview', 'tasks', 'rewards', 'reports', 'notes', 'aquarium'].includes(view)
      ? 'overview'
      : view;
  const base = demo ? '/demo' : '/panel';
  const url = (v: string, extra: Record<string, string> = {}) =>
    `${base}?${new URLSearchParams({ view: v, ...(classroom ? { class: classroom.id } : {}), ...(parent && child ? { child: child.id } : {}), ...extra })}`;
  const nextUnlock = unlocks.find((u) => u.xp > (classroom?.class_xp || 0));
  const today = new Date();
  const academicYear = today.getMonth() >= 8 ? today.getFullYear() : today.getFullYear() - 1;
  const stats = summarize(scoped);
  const selectedStudent = students.find((s) => s.id === params.student);
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link href={base} className="brand">
          <Waves size={30} /> SınıfDenizi<span className="brand-dot">.</span>
        </Link>
        <span className="brand-tag">ÖĞREN. KAZAN. BÜYÜT.</span>
        <div className="workspace-label">{parent ? 'VELİ ALANI' : 'ÖĞRETMEN ALANI'}</div>
        <nav aria-label="Ana gezinme">
          {views
            .filter((v) => !parent || v[0] !== 'students')
            .map(([key, name, Icon]) => (
              <Link
                key={key}
                href={url(key)}
                className={allowedView === key ? 'active' : ''}
                aria-current={allowedView === key ? 'page' : undefined}
              >
                <Icon size={19} />
                {name}
                {key === 'aquarium' && <span className="nav-new">CANLI</span>}
              </Link>
            ))}
        </nav>
        <div className="sidebar-note">
          <span className="tiny-shell">
            <Shell size={24} />
          </span>
          <strong>Birlikte daha güçlüyüz.</strong>
          <p>Her küçük çaba, denizimizde yeni bir iz bırakır.</p>
        </div>
        <div className="user">
          <span className="avatar">{initials(profile.name)}</span>
          <div>
            <strong>{profile.name}</strong>
            <small>{parent ? 'Veli hesabı' : 'Sınıf öğretmeni'}</small>
          </div>
          {demo ? (
            <Link href="/giris" aria-label="Giriş sayfası">
              <LogOut size={17} />
            </Link>
          ) : (
            <form action={signOut}>
              <button aria-label="Çıkış yap">
                <LogOut size={17} />
              </button>
            </form>
          )}
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            {parent ? 'Çocuğumun yolculuğu' : 'Sınıfım'}
            <ChevronRight size={15} />
            <strong>{views.find((v) => v[0] === allowedView)?.[1]}</strong>
          </div>
          <div className="topbar-right">
            <span className="term">
              {academicYear} – {academicYear + 1} Eğitim Yılı
            </span>
            <Link href={url('notes')} className="notification" aria-label="Duyurular">
              <Bell size={19} />
            </Link>
            <span className="avatar small-avatar">{initials(profile.name)}</span>
          </div>
        </header>
        <main id="main" className="content">
          {demo && (
            <div className="demo-banner">
              <span>ÖRNEK SINIF · Kurgusal veriler, salt okunur önizleme</span>
              <Link href="/demo?role=parent">Veli görünümü</Link>
              <Link href="/demo">Öğretmen görünümü</Link>
              <Link href="/giris">
                Gerçek hesabına geç <ArrowUpRight size={14} />
              </Link>
            </div>
          )}
          <div className="page-title">
            <div>
              <span className="eyebrow">
                {parent
                  ? 'GELİŞİM YOLCULUĞU'
                  : 'MERHABA, ' + profile.name.split(' ')[0].toLocaleUpperCase('tr-TR')}
              </span>
              <h1>
                {parent && child
                  ? `${child.name} büyüyor, denizi güzelleşiyor.`
                  : titles[allowedView]}
              </h1>
              <p className="muted">
                {classroom?.name || 'İlk sınıfını oluşturarak bu yolculuğa başla.'}
              </p>
            </div>
            <div className="page-actions">
              {!parent && classroom && (
                <Link className="button secondary" href={url('aquarium')}>
                  <ExpandIcon /> Akvaryumu aç
                </Link>
              )}
              {!parent && classroom && (
                <Link className="button" href={url('tasks') + '#new-task'}>
                  <Plus size={17} /> Görev oluştur
                </Link>
              )}
            </div>
          </div>
          <div className="class-switch">
            {parent
              ? data.students.map((s) => (
                  <Link
                    className={child?.id === s.id ? 'selected' : ''}
                    key={s.id}
                    href={`${base}?view=${allowedView}&child=${s.id}${demo ? '&role=parent' : ''}`}
                  >
                    {s.name}
                  </Link>
                ))
              : data.classes.map((c) => (
                  <Link
                    className={classroom?.id === c.id ? 'selected' : ''}
                    key={c.id}
                    href={`${base}?view=${allowedView}&class=${c.id}`}
                  >
                    {c.name}
                  </Link>
                ))}
            {!demo && !parent && (
              <details>
                <summary>+ Sınıf oluştur</summary>
                <ActionForm>
                  <Hidden name="action" value="class" />
                  <label>
                    Sınıf adı
                    <input name="name" required maxLength={80} />
                  </label>
                  <label>
                    Sınıf düzeyi
                    <input name="grade" maxLength={30} />
                  </label>
                  <label className="check">
                    <input name="show_names" type="checkbox" />
                    Akvaryum seçim kartında isim göster
                  </label>
                </ActionForm>
              </details>
            )}
          </div>
          {!classroom ? (
            <Empty>
              {parent
                ? 'Öğretmen çocuğunuzun profilini hesabınıza bağladığında gelişimini burada görebilirsiniz.'
                : 'Yukarıdan ilk sınıfınızı oluşturun; ardından öğrencilerinizi ekleyin.'}
            </Empty>
          ) : (
            <>
              {allowedView === 'overview' && (
                <>
                  {parent && child && (
                    <section className="panel student-hero">
                      <Avatar student={child} />
                      <div>
                        <h2>{child.name}</h2>
                        <p>
                          Seviye {child.level} · {child.xp} XP · {child.feed} yem ·{' '}
                          {scoped.badges.length} rozet
                        </p>
                        <progress
                          aria-label="Sonraki seviyeye ilerleme"
                          max={100}
                          value={child.xp % 100}
                        />
                        <small className="muted">
                          Sonraki seviyeye {100 - (child.xp % 100)} XP
                        </small>
                      </div>
                    </section>
                  )}
                  <Metrics data={scoped} />
                  <div className="overview-grid">
                    <section>
                      <SectionTitle title={parent ? 'Çocuğunun deniz dostu' : 'Sınıfımızın denizi'}>
                        <Link href={url('aquarium')}>
                          Denizi keşfet <ArrowUpRight size={15} />
                        </Link>
                      </SectionTitle>
                      <Aquarium
                        students={students}
                        decorLevel={classroom.decor_level}
                        showNames={classroom.show_names || parent}
                      />
                      <div className="ocean-caption">
                        <span>
                          <span className="live-dot" />{' '}
                          {unlocks[classroom.decor_level]?.name || 'Deniz çayırları'}
                        </span>
                        <span>Her başarı, denizimize hayat verir.</span>
                      </div>
                    </section>
                    <aside className="goal-card">
                      <span className="eyebrow">BİRLİKTE BAŞARIYORUZ</span>
                      <h2>Sıradaki keşif</h2>
                      <div className="treasure-art">
                        <Shell size={82} strokeWidth={1.1} />
                        <span>✦</span>
                      </div>
                      <span className="pill warm">
                        {nextUnlock ? 'SINIF HEDEFİ' : 'TÜM KEŞİFLER AÇILDI'}
                      </span>
                      <h3>{nextUnlock?.name || 'Deniz kalesi'}</h3>
                      <p className="muted">
                        {nextUnlock
                          ? 'Birlikte tamamlanan her görev, bizi yeni bir keşfe yaklaştırıyor.'
                          : 'Deniziniz bütün güzellikleriyle parlıyor.'}
                      </p>
                      <div className="progress-label">
                        <strong>{classroom.class_xp.toLocaleString('tr-TR')} XP</strong>
                        <span>/ {nextUnlock?.xp || 9000} XP</span>
                      </div>
                      <progress value={classroom.class_xp} max={nextUnlock?.xp || 9000} />
                      <small>
                        {nextUnlock
                          ? `${nextUnlock.xp - classroom.class_xp} XP daha, yeni bir dünya!`
                          : 'Birlikte başardınız.'}
                      </small>
                    </aside>
                  </div>
                  <div className="lower-grid">
                    <section className="panel">
                      <SectionTitle title="Görev yolculuğu">
                        <Link href={url('tasks')}>
                          Tümünü gör <ArrowUpRight size={15} />
                        </Link>
                      </SectionTitle>
                      {tasks.slice(0, 3).map((t) => (
                        <div key={t.id} className="task-row">
                          <span className="task-icon">
                            <BookOpen size={19} />
                          </span>
                          <div className="grow">
                            <strong>{t.title}</strong>
                            <small>
                              {t.type} ·{' '}
                              {t.due_date
                                ? new Date(t.due_date + 'T12:00:00').toLocaleDateString('tr-TR', {
                                    day: 'numeric',
                                    month: 'long',
                                  })
                                : 'Son tarih yok'}
                            </small>
                          </div>
                          <span className="reward">+{t.xp_reward} XP</span>
                        </div>
                      ))}
                      {!tasks.length && <Empty>Yeni bir görevle ilk keşfi başlatın.</Empty>}
                    </section>
                    <section className="panel">
                      <SectionTitle title="Son güzel gelişmeler" />
                      {assignments
                        .filter((a) => a.status === 'approved')
                        .sort((a, b) => (b.approved_at || '').localeCompare(a.approved_at || ''))
                        .slice(0, 3)
                        .map((a) => {
                          const s = students.find((s) => s.id === a.student_id);
                          return (
                            <div className="activity" key={a.id}>
                              <span className="activity-check">
                                <Check size={16} />
                              </span>
                              <div>
                                <strong>{s?.name}</strong>
                                <p>{tasks.find((t) => t.id === a.task_id)?.title}</p>
                                <small>Yeni bir adım daha attı.</small>
                              </div>
                            </div>
                          );
                        })}
                      {!stats.completed && <Empty>İlk başarı hikâyeniz burada görünecek.</Empty>}
                    </section>
                  </div>
                </>
              )}
              {allowedView === 'aquarium' && (
                <>
                  <Aquarium
                    students={students}
                    decorLevel={classroom.decor_level}
                    showNames={classroom.show_names || parent}
                  />
                  <p className="muted small">
                    Tam ekran, dokunmatik seçim ve klavyeyle balık seçimi desteklenir. Fotoğraflar
                    akvaryumda gösterilmez.
                  </p>
                  {!demo && !parent && (
                    <details className="panel">
                      <summary>Sınıf ve görünürlük ayarları</summary>
                      <ActionForm>
                        <Hidden name="action" value="class" />
                        <Hidden name="id" value={classroom.id} />
                        <label>
                          Sınıf adı
                          <input name="name" defaultValue={classroom.name} required />
                        </label>
                        <label>
                          Düzey
                          <input name="grade" defaultValue={classroom.grade} />
                        </label>
                        <label className="check">
                          <input
                            type="checkbox"
                            name="show_names"
                            defaultChecked={classroom.show_names}
                          />
                          Seçilen balığın kartında öğrenci adını göster
                        </label>
                      </ActionForm>
                    </details>
                  )}
                </>
              )}
              {allowedView === 'students' && !parent && (
                <>
                  {!demo && (
                    <details className="panel composer">
                      <summary>
                        <Plus size={18} /> Öğrenci ekle
                      </summary>
                      <ActionForm>
                        <StudentFields classId={classroom.id} />
                      </ActionForm>
                    </details>
                  )}
                  <section className="panel">
                    <SectionTitle title={`${students.length} öğrenci · Her biri eşsiz`} />
                    <div className="table-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>Öğrenci</th>
                            <th>Deniz dostu</th>
                            <th>Seviye</th>
                            <th>XP / Yem</th>
                            <th>Profil</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((s) => (
                            <tr key={s.id}>
                              <td>
                                <span className="student-name">
                                  <Avatar student={s} />
                                  <strong>{s.name}</strong>
                                </span>
                              </td>
                              <td>{fishNames[s.fish_type]}</td>
                              <td>
                                <span className="pill">Seviye {s.level}</span>
                              </td>
                              <td>
                                {s.xp} / {s.feed}
                              </td>
                              <td>
                                <Link href={url('students', { student: s.id })}>
                                  Görüntüle <ChevronRight size={14} />
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {!students.length && (
                      <Empty>Öğrencilerinizi ekleyin; her birine özel bir deniz dostu seçin.</Empty>
                    )}
                  </section>
                  {selectedStudent && (
                    <section className="panel student-detail">
                      <SectionTitle title={selectedStudent.name}>
                        <Link href={url('students')}>Kapat</Link>
                      </SectionTitle>
                      <div className="student-hero">
                        <Avatar student={selectedStudent} />
                        <div>
                          <h2>{selectedStudent.name}</h2>
                          <p>
                            Seviye {selectedStudent.level} · {selectedStudent.xp} XP ·{' '}
                            {selectedStudent.feed} yem
                          </p>
                          <progress max={100} value={selectedStudent.xp % 100} />
                        </div>
                      </div>
                      <p>
                        {
                          assignments.filter(
                            (a) => a.student_id === selectedStudent.id && a.status === 'approved',
                          ).length
                        }{' '}
                        tamamlanan görev ·{' '}
                        {scoped.badges.filter((b) => b.student_id === selectedStudent.id).length}{' '}
                        rozet
                      </p>
                      {!demo && (
                        <div className="lower-grid">
                          <ActionForm label="Profili güncelle">
                            <StudentFields classId={classroom.id} student={selectedStudent} />
                          </ActionForm>
                          <div>
                            <ActionForm label="Fotoğrafı yükle">
                              <Hidden name="action" value="photo" />
                              <Hidden name="id" value={selectedStudent.id} />
                              <label>
                                Profil fotoğrafı · En fazla 3 MB
                                <input
                                  type="file"
                                  name="photo"
                                  accept="image/jpeg,image/png,image/webp"
                                  required
                                />
                              </label>
                              <p className="muted small">
                                Fotoğraf gizli depoda saklanır. Görüntüleme bağlantıları 5 dakika
                                geçerlidir.
                              </p>
                            </ActionForm>
                            <ActionForm label="Veliyi bağla">
                              <Hidden name="action" value="link" />
                              <Hidden name="id" value={selectedStudent.id} />
                              <label>
                                Doğrulanmış veli hesabının e-postası
                                <input type="email" name="email" required />
                              </label>
                            </ActionForm>
                            {links
                              .filter((l) => l.student_id === selectedStudent.id)
                              .map((l, i) => (
                                <ActionForm
                                  key={l.parent_id}
                                  label={`Veli bağlantısı ${i + 1} — kaldır`}
                                  confirm="Bu velinin öğrenciye erişimini kaldırmak istiyor musunuz?"
                                >
                                  <Hidden name="action" value="unlink" />
                                  <Hidden name="id" value={selectedStudent.id} />
                                  <Hidden name="parent_id" value={l.parent_id} />
                                </ActionForm>
                              ))}
                            <ActionForm
                              label="Öğrenciyi sil"
                              confirm="Öğrenci profili, görev geçmişi ve fotoğrafı silinecek. Devam edilsin mi?"
                            >
                              <Hidden name="action" value="delete-student" />
                              <Hidden name="id" value={selectedStudent.id} />
                            </ActionForm>
                          </div>
                        </div>
                      )}
                    </section>
                  )}
                </>
              )}
              {allowedView === 'tasks' && (
                <>
                  {!demo && !parent && (
                    <details className="panel composer" id="new-task">
                      <summary>
                        <Plus size={18} /> Yeni görev oluştur
                      </summary>
                      {students.length ? (
                        <ActionForm label="Görevi ata">
                          <TaskFields classId={classroom.id} students={students} />
                        </ActionForm>
                      ) : (
                        <p>Görev atamak için önce öğrenci ekleyin.</p>
                      )}
                    </details>
                  )}
                  <div className="task-grid">
                    {tasks.map((t) => {
                      const assigned = assignments.filter((a) => a.task_id === t.id);
                      const complete = assigned.filter((a) => a.status === 'approved').length;
                      return (
                        <article className="panel task-card" key={t.id}>
                          <span className="pill">{t.type}</span>
                          <h2>{t.title}</h2>
                          <p className="muted">{t.description}</p>
                          <div className="task-meta">
                            <span>
                              <Star size={16} />
                              {t.xp_reward} XP
                            </span>
                            <span>
                              <Flame size={16} />
                              {t.feed_reward} yem
                            </span>
                            <span>{t.due_date || 'Son tarih yok'}</span>
                          </div>
                          <div className="progress-label">
                            <span>Tamamlanma</span>
                            <strong>
                              {complete} / {assigned.length}
                            </strong>
                          </div>
                          <progress value={complete} max={assigned.length || 1} />
                          <details>
                            <summary>{parent ? 'Görev durumu' : 'Öğrenciler ve onaylar'}</summary>
                            {assigned.map((a) => (
                              <div className="assignment" key={a.id}>
                                <span>{students.find((s) => s.id === a.student_id)?.name}</span>
                                {a.status === 'approved' ? (
                                  <span className="status">
                                    <Check size={14} /> Onaylandı
                                  </span>
                                ) : parent || demo ? (
                                  <span className="muted">Bekliyor</span>
                                ) : (
                                  <ActionForm label="Tamamlandı · Onayla">
                                    <Hidden name="action" value="approve" />
                                    <Hidden name="id" value={a.id} />
                                  </ActionForm>
                                )}
                              </div>
                            ))}
                          </details>
                          {!demo && !parent && !complete && (
                            <details>
                              <summary>Görevi düzenle</summary>
                              <ActionForm>
                                <TaskFields
                                  classId={classroom.id}
                                  students={students}
                                  task={t}
                                  assigned={assigned.map((a) => a.student_id)}
                                />
                              </ActionForm>
                              <ActionForm
                                label="Görevi sil"
                                confirm="Bu görevi ve bekleyen atamalarını silmek istiyor musunuz?"
                              >
                                <Hidden name="action" value="delete-task" />
                                <Hidden name="id" value={t.id} />
                              </ActionForm>
                            </details>
                          )}
                        </article>
                      );
                    })}
                  </div>
                  {!tasks.length && <Empty>Henüz görev yok. Yeni keşifler burada görünecek.</Empty>}
                </>
              )}
              {allowedView === 'rewards' && (
                <>
                  <section className="panel">
                    <SectionTitle title="Ortak denizimizin keşifleri" />
                    <p className="muted">
                      Sınıfın toplam {classroom.class_xp} XP başarısı, ortak akvaryumu büyütüyor.
                    </p>
                    <div className="unlock-grid">
                      {unlocks.map((u, i) => (
                        <div
                          className={`unlock ${classroom.class_xp >= u.xp ? 'unlocked' : ''}`}
                          key={u.name}
                        >
                          {classroom.class_xp >= u.xp ? <Shell size={32} /> : <Lock size={28} />}
                          <h3>{u.name}</h3>
                          <span>
                            {u.xp} XP · {classroom.class_xp >= u.xp ? 'Açıldı' : 'Kilitli'}
                          </span>
                          <small>Keşif {i + 1}</small>
                        </div>
                      ))}
                    </div>
                  </section>
                  <section className="panel">
                    <SectionTitle title="Bireysel rozetler" />
                    <div className="unlock-grid">
                      {[
                        ['first-task', 'İlk dalış', 1],
                        ['ten-tasks', 'Deniz kaşifi', 10],
                        ['fifty-tasks', 'Okyanus ustası', 50],
                      ].map(([id, name, count]) => (
                        <div className="unlock unlocked" key={id}>
                          <Star size={30} />
                          <h3>{name}</h3>
                          <p>{count} görev tamamla</p>
                          <span>
                            {scoped.badges.filter((b) => b.badge_id === id).length} öğrenci kazandı
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}
              {allowedView === 'reports' && (
                <>
                  <Metrics data={scoped} />
                  <section className="panel">
                    <SectionTitle title="Öğrenci bazında gelişim" />
                    <form className="filter">
                      <Hidden name="view" value="reports" />
                      <Hidden name="class" value={classroom.id} />
                      {parent && child && <Hidden name="child" value={child.id} />}
                      <label>
                        Öğrenci
                        <select name="student" defaultValue={params.student || ''}>
                          <option value="">Tüm öğrenciler</option>
                          {students.map((s) => (
                            <option value={s.id} key={s.id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </label>
                      <button className="button secondary">Uygula</button>
                    </form>
                    <div className="report-list">
                      {students
                        .filter((s) => !params.student || s.id === params.student)
                        .map((s) => {
                          const items = assignments.filter((a) => a.student_id === s.id),
                            completed = items.filter((a) => a.status === 'approved').length;
                          return (
                            <div key={s.id} className="report-row">
                              <span>{s.name}</span>
                              <progress value={completed} max={items.length || 1} />
                              <strong>
                                {completed}/{items.length}
                              </strong>
                              <span>{s.xp} XP</span>
                            </div>
                          );
                        })}
                    </div>
                  </section>
                  <div className="lower-grid">
                    <section className="panel">
                      <SectionTitle title="Son 7 gün · Tamamlanan görevler" />
                      {Array.from({ length: 7 }, (_, i) => {
                        const day = new Date();
                        day.setDate(day.getDate() - 6 + i);
                        const key = day.toISOString().slice(0, 10);
                        const count = assignments.filter(
                          (a) =>
                            a.approved_at?.startsWith(key) &&
                            (!params.student || a.student_id === params.student),
                        ).length;
                        return (
                          <div className="report-row" key={key}>
                            <span>
                              {day.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                            </span>
                            <progress value={count} max={Math.max(1, assignments.length)} />
                            <strong>{count}</strong>
                          </div>
                        );
                      })}
                    </section>
                    <section className="panel">
                      <SectionTitle title="Görev türleri" />
                      {taskTypes.map((type) => (
                        <div className="report-row" key={type}>
                          <span>{type}</span>
                          <progress
                            value={tasks.filter((t) => t.type === type).length}
                            max={tasks.length || 1}
                          />
                          <strong>{tasks.filter((t) => t.type === type).length}</strong>
                        </div>
                      ))}
                    </section>
                  </div>
                </>
              )}
              {allowedView === 'notes' && (
                <>
                  {!demo && !parent && (
                    <details className="panel composer">
                      <summary>
                        <Plus size={18} /> Duyuru paylaş
                      </summary>
                      <ActionForm>
                        <Hidden name="action" value="announcement" />
                        <Hidden name="class_id" value={classroom.id} />
                        <label>
                          Başlık
                          <input name="title" required minLength={2} maxLength={120} />
                        </label>
                        <label>
                          Mesaj
                          <textarea name="body" required minLength={2} maxLength={3000} />
                        </label>
                        <label className="check">
                          <input type="checkbox" name="visible_to_parents" />
                          Velilerle paylaş
                        </label>
                      </ActionForm>
                    </details>
                  )}
                  {scoped.announcements.map((a) => (
                    <article className="panel announcement" key={a.id}>
                      <span className="pill">
                        {a.visible_to_parents ? 'Velilerle paylaşıldı' : 'Yalnızca öğretmen'}
                      </span>
                      <h2>{a.title}</h2>
                      <p>{a.body}</p>
                      <small className="muted">
                        {new Date(a.created_at).toLocaleDateString('tr-TR')}
                      </small>
                    </article>
                  ))}
                  {!scoped.announcements.length && <Empty>Henüz paylaşılmış bir duyuru yok.</Empty>}
                </>
              )}
            </>
          )}
          <footer className="footer">
            <span>
              <Waves size={16} /> SınıfDenizi
            </span>
            <span>Her öğrencinin parladığı bir deniz.</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
function ExpandIcon() {
  return <GraduationCap size={18} />;
}
