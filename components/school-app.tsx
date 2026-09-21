"use client";
import { useEffect, useState } from "react";
import {
  Waves,
  House,
  Fish as FishIcon,
  Users,
  ClipboardList,
  Award,
  ChartNoAxesCombined,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Plus,
  Bell,
  Search,
  ArrowUpRight,
  Check,
  Lock,
  Star,
  Shell,
  Utensils,
  BookOpen,
  Heart,
  GraduationCap,
  X,
  Menu,
  CheckCheck,
  Sparkles,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";
import Aquarium from "./aquarium";
import Modal from "./modal";
import { StudentForm, TaskForm } from "./forms";
import { Fish, Decor, asset } from "./sprites";
import {
  initialState,
  validState,
  approveTask,
  feedStudents,
  classXp,
  participation,
  level,
  species,
  decorNames,
  decorThresholds,
  type SchoolState,
  type Student,
} from "@/lib/model";
type Page =
  | "aquarium"
  | "dashboard"
  | "students"
  | "tasks"
  | "decor"
  | "badges"
  | "reports"
  | "settings";
const navigation: [Page, string, typeof Waves][] = [
  ["dashboard", "Ana sayfa", House],
  ["aquarium", "Sınıf akvaryumu", FishIcon],
  ["students", "Öğrenciler", Users],
  ["tasks", "Görevler", ClipboardList],
  ["decor", "Dekorasyonlar", Shell],
  ["badges", "Rozetler", Award],
  ["reports", "Raporlar", ChartNoAxesCombined],
];
const storageKey = "sinifdenizi-v2";
function initials(name: string) {
  return name
    .split(" ")
    .map((x) => x[0])
    .slice(0, 2)
    .join("");
}
function Avatar({
  student,
  large = false,
}: {
  student: Student;
  large?: boolean;
}) {
  return (
    <span
      className={`avatar ${large ? "large" : ""}`}
      style={{
        background: ["#daf2f1", "#ffe5d5", "#e6e2fc", "#dcf0ff"][
          student.fish % 4
        ],
      }}
    >
      {student.photo ? (
        <img src={student.photo} alt="" />
      ) : (
        initials(student.name)
      )}
    </span>
  );
}
function Brand() {
  return (
    <div className="brand">
      <span className="brand-mark">
        <Fish type={0} />
        <BookOpen size={30} />
      </span>
      <div>
        Sınıf<span>Denizi</span>
        <small>Öğren. Kazan. Büyüt.</small>
      </div>
    </div>
  );
}
function Progress({ value }: { value: number }) {
  return (
    <div className="progress">
      <i style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}
export default function SchoolApp() {
  const [state, setState] = useState<SchoolState>(initialState),
    [ready, setReady] = useState(false),
    [page, setPage] = useState<Page>("aquarium"),
    [role, setRole] = useState<"teacher" | "parent" | "welcome">("teacher"),
    [mobile, setMobile] = useState(false),
    [modal, setModal] = useState<"student" | "task" | "notice" | null>(null),
    [selected, setSelected] = useState<string | null>(null),
    [toast, setToast] = useState(""),
    [query, setQuery] = useState(""),
    [feeding, setFeeding] = useState(0),
    [child, setChild] = useState("student-0"),
    [taskFilter, setTaskFilter] = useState("Tümü");
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (validState(parsed)) setState(parsed);
        else setToast("Eski demo kaydı okunamadı. Örnek sınıf açıldı.");
      }
    } catch {
      setToast("Bu tarayıcıda kayıt alanına erişilemiyor.");
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      setToast(
        "Değişiklik kaydedilemedi. Tarayıcı depolama alanı dolu olabilir.",
      );
    }
  }, [state, ready]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 4200);
    return () => clearTimeout(t);
  }, [toast]);
  const xp = classXp(state),
    completion = participation(state),
    feed = state.students.reduce((n, x) => n + x.feed, 0),
    activeTasks = state.tasks.filter(
      (t) => t.done.length < t.assigned.length,
    ).length;
  const current = state.students.find((x) => x.id === selected),
    parentChildren = state.students.filter((x) =>
      ["student-0", "student-1"].includes(x.id),
    ),
    parentStudent =
      parentChildren.find((x) => x.id === child) || parentChildren[0];
  const nextDecor = decorThresholds.findIndex((x) => x > xp),
    earnedDecor = decorThresholds.filter((x) => x <= xp).length;
  function navigate(p: Page) {
    setPage(p);
    setQuery("");
    setMobile(false);
  }
  function approve(taskId: string, studentId: string) {
    setState((s) => approveTask(s, taskId, studentId));
    setToast("Görev onaylandı. XP ve yem öğrencinin hesabına eklendi.");
  }
  function feedAll() {
    if (feed === 0) {
      setToast(
        "Yemler bitti. Görevleri tamamlayarak yeni yem kazanabilirsiniz.",
      );
      return;
    }
    setState(feedStudents);
    setFeeding((x) => x + 1);
    setToast("Her balığın mevcut yeminden 1 yem kullanıldı. Afiyet olsun!");
  }
  function toggleDecor(i: number) {
    if (xp < decorThresholds[i]) return;
    setState((s) => ({
      ...s,
      decorations: s.decorations.includes(i)
        ? s.decorations.filter((x) => x !== i)
        : [...s.decorations, i],
    }));
  }
  const stats = (
    <div className="stats">
      <Metric
        icon={Users}
        value={state.students.length.toString()}
        label="Öğrenci"
        color="blue"
      />
      <Metric
        icon={ClipboardList}
        value={String(activeTasks)}
        label="Aktif görev"
        color="green"
      />
      <Metric
        icon={ChartNoAxesCombined}
        value={`%${completion}`}
        label="Görev katılımı"
        color="purple"
      />
      <Metric
        icon={Utensils}
        value={feed.toLocaleString("tr-TR")}
        label="Toplam yem"
        color="orange"
      />
    </div>
  );
  function activities() {
    return (
      <section className="card activity-card">
        <div className="section-heading">
          <h3>Denizden haberler</h3>
          <span className="tiny-tag">Güncel</span>
        </div>
        <div className="activity-list">
          {state.activities.slice(0, 4).map((a, i) => (
            <div key={a.id} className="activity">
              <span className={`activity-icon tone-${i % 3}`}>
                {a.kind === "task" ? (
                  <Check size={17} />
                ) : a.kind === "feed" ? (
                  <Utensils size={17} />
                ) : (
                  <Star size={17} />
                )}
              </span>
              <div>
                <p>{a.text}</p>
                <small>{a.time}</small>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }
  function classGoal() {
    return (
      <section className="card goal-card">
        <div className="section-heading">
          <h3>Birlikte bir adım daha</h3>
          <Sparkles size={18} />
        </div>
        <div className="goal-visual">
          <Decor type={nextDecor < 0 ? 8 : nextDecor} />
          <div>
            <span className="eyebrow">SIRADAKİ KEŞİF</span>
            <h4>{nextDecor < 0 ? "Efsane sınıf!" : decorNames[nextDecor]}</h4>
            <p>
              {nextDecor < 0
                ? "Tüm dekorların kilidi açıldı."
                : `${(decorThresholds[nextDecor] - xp).toLocaleString("tr-TR")} XP kaldı`}
            </p>
          </div>
        </div>
        <Progress
          value={nextDecor < 0 ? 100 : (xp / decorThresholds[nextDecor]) * 100}
        />
        <div className="goal-numbers">
          <span>{xp.toLocaleString("tr-TR")} XP</span>
          <span>
            {nextDecor < 0
              ? "Tamamlandı"
              : `${decorThresholds[nextDecor].toLocaleString("tr-TR")} XP`}
          </span>
        </div>
        <button className="text-button" onClick={() => navigate("decor")}>
          Sınıf hedeflerini keşfet <ChevronRight size={15} />
        </button>
      </section>
    );
  }
  const title =
    role === "parent"
      ? "Veli paneli"
      : navigation.find((x) => x[0] === page)?.[1] || "Ayarlar";
  return (
    <>
      {role === "welcome" ? (
        <div className="welcome">
          <div
            className="welcome-art"
            style={{ backgroundImage: `url(${asset("aquarium.png")})` }}
          >
            <Brand />
            <div>
              <span className="eyebrow">HER SINIFIN BİR DENİZİ VAR</span>
              <h1>
                Küçük adımlar.
                <br />
                Kocaman bir dünya.
              </h1>
              <p>Öğrenmenin heyecanını birlikte büyütün.</p>
            </div>
            <Fish type={0} className="welcome-fish" />
          </div>
          <div className="welcome-form">
            <Brand />
            <span className="eyebrow">SINIFINIZA HOŞ GELDİNİZ</span>
            <h2>Birlikte keşfedelim.</h2>
            <p>Örnek sınıfı öğretmen veya veli olarak inceleyin.</p>
            <button className="primary" onClick={() => setRole("teacher")}>
              <GraduationCap size={20} /> Öğretmen demosunu aç{" "}
              <ArrowUpRight size={18} />
            </button>
            <button className="secondary" onClick={() => setRole("parent")}>
              <Heart size={20} /> Veli demosunu aç <ArrowUpRight size={18} />
            </button>
            <div className="demo-explanation">
              <ShieldCheck size={20} />
              <p>
                Bu sürüm örnek verilerle çalışır. Gerçek kullanıcı girişi ve
                bulut senkronizasyonu henüz bağlı değildir.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className={`app-shell ${mobile ? "nav-open" : ""}`}>
          <button
            className="nav-scrim"
            aria-label="Menüyü kapat"
            onClick={() => setMobile(false)}
          />
          <aside className="sidebar">
            <Brand />
            <div className="school-label">ÖĞRENME YOLCULUĞU</div>
            <nav>
              {role === "teacher" ? (
                navigation.map(([id, label, Icon]) => (
                  <button
                    key={id}
                    className={page === id ? "active" : ""}
                    onClick={() => navigate(id)}
                  >
                    <Icon size={20} />
                    <span>{label}</span>
                    {id === "tasks" && <small>{activeTasks}</small>}
                    {page === id && <i />}
                  </button>
                ))
              ) : (
                <>
                  <button className="active">
                    <Heart size={20} />
                    Çocuğumun denizi
                  </button>
                  <button
                    onClick={() => {
                      setRole("teacher");
                      navigate("aquarium");
                    }}
                  >
                    <GraduationCap size={20} />
                    Öğretmen demosu
                  </button>
                </>
              )}
            </nav>
            <div className="sidebar-story">
              <Waves />
              <p>
                Birlikte öğrendikçe,
                <br />
                <strong>denizimiz büyür.</strong>
              </p>
              <span>Her küçük başarı, yeni bir keşif.</span>
              <div className="story-fish">
                <Fish type={0} />
                <Fish type={2} />
              </div>
            </div>
            <div className="sidebar-bottom">
              <button
                onClick={() => {
                  setRole("teacher");
                  navigate("settings");
                }}
              >
                <Settings size={19} />
                Ayarlar
              </button>
              <button onClick={() => setRole("welcome")}>
                <LogOut size={19} />
                Demodan çık
              </button>
              <div className="teacher-profile">
                <span className="teacher-avatar">AY</span>
                <div>
                  <strong>
                    {role === "teacher" ? "Ayşe Yılmaz" : "Demo veli"}
                  </strong>
                  <small>
                    {role === "teacher"
                      ? "Sınıf öğretmeni"
                      : "Çocuk takip paneli"}
                  </small>
                </div>
                <ChevronDown size={16} />
              </div>
            </div>
          </aside>
          <main className="main">
            <header className="topbar">
              <div className="breadcrumb">
                <button
                  className="icon-button mobile-toggle"
                  aria-label="Menüyü aç"
                  onClick={() => setMobile(!mobile)}
                >
                  <Menu />
                </button>
                <span>Sınıfım</span>
                <ChevronRight size={15} />
                <strong>{title}</strong>
              </div>
              <div className="topbar-right">
                <span className="demo-pill">Örnek sınıf</span>
                <button
                  className="role-switch"
                  onClick={() => {
                    setRole(role === "teacher" ? "parent" : "teacher");
                    setSelected(null);
                  }}
                >
                  <span>
                    {role === "teacher" ? "Veli görünümü" : "Öğretmen görünümü"}
                  </span>
                  <ArrowUpRight size={16} />
                </button>
                <button
                  className="notification-button icon-button"
                  aria-label="Bildirimleri aç"
                  onClick={() => setModal("notice")}
                >
                  <Bell size={20} />
                  <i />
                </button>
                <span className="teacher-avatar small">AY</span>
              </div>
            </header>
            <div className="page-content">
              <div className="page-heading">
                <div>
                  <div className="eyebrow">
                    {role === "parent"
                      ? "HER BAŞARININ BİR HİKÂYESİ VAR"
                      : "ÖĞREN. KAZAN. BÜYÜT."}
                  </div>
                  <h1>
                    {role === "parent"
                      ? "Çocuğunuzun keşif yolculuğu"
                      : page === "aquarium"
                        ? "Bizim sınıf, bizim deniz."
                        : page === "dashboard"
                          ? "Merhaba, Ayşe Öğretmen."
                          : title}
                  </h1>
                  <p>
                    {role === "parent"
                      ? "Küçük adımlarını izleyin, büyük mutluluğunu paylaşın."
                      : page === "aquarium"
                        ? "Her balık bir öğrenci. Her başarı, denizimize yeni bir renk."
                        : page === "dashboard"
                          ? "Bugün de birlikte öğrenmek için güzel bir gün."
                          : "Birlikte öğrendiğimiz, birlikte büyüdüğümüz bir dünya."}
                  </p>
                </div>
                <div className="heading-actions">
                  {role === "teacher" && (
                    <>
                      <span className="class-selector">
                        <GraduationCap size={18} />
                        <b>4-A Sınıfı</b>
                      </span>
                      <button
                        className="primary"
                        onClick={() =>
                          setModal(page === "students" ? "student" : "task")
                        }
                      >
                        <Plus size={18} />
                        {page === "students" ? "Öğrenci ekle" : "Yeni görev"}
                      </button>
                    </>
                  )}
                </div>
              </div>
              {role === "teacher" && (
                <>
                  {(page === "aquarium" || page === "dashboard") && (
                    <>
                      {stats}
                      <div className="ocean-layout">
                        <section className="card ocean-card">
                          <div className="ocean-heading">
                            <div className="ocean-title">
                              <span className="icon-tile blue">
                                <Waves size={22} />
                              </span>
                              <div>
                                <h2>4-A Sınıf Akvaryumu</h2>
                                <p>
                                  Birlikte daha renkli, birlikte daha güzel.
                                </p>
                              </div>
                            </div>
                            <div className="class-level">
                              <Star size={18} />
                              <div>
                                <strong>Seviye {level(xp)}</strong>
                                <Progress value={(xp % 500) / 5} />
                              </div>
                            </div>
                          </div>
                          <Aquarium
                            students={state.students}
                            decorations={state.decorations}
                            xp={xp}
                            onSelect={(s) => setSelected(s.id)}
                            feeding={feeding}
                          />
                          <div className="aquarium-toolbar">
                            <div>
                              <span className="status-dot" /> Denizimiz hayat
                              dolu
                            </div>
                            <div>
                              <button
                                className="secondary"
                                onClick={() => navigate("decor")}
                              >
                                <Shell size={17} />
                                Dekorasyonlar
                              </button>
                              <button className="feed-button" onClick={feedAll}>
                                <Utensils size={17} />
                                Balıkları besle
                              </button>
                            </div>
                          </div>
                        </section>
                        <aside className="ocean-aside">
                          {classGoal()}
                          {activities()}
                          <div className="quote-card">
                            <Heart size={19} />
                            <p>
                              “Her öğrencinin bir denizi,
                              <br />
                              her başarının bir izi var.”
                            </p>
                          </div>
                        </aside>
                      </div>
                      <section className="card collection-card">
                        <div className="section-heading">
                          <div>
                            <span className="eyebrow">
                              DENİZİMİZİN SAKİNLERİ
                            </span>
                            <h2>Her biri başka bir hikâye.</h2>
                          </div>
                          <button
                            className="text-button"
                            onClick={() => navigate("students")}
                          >
                            Tüm öğrenciler <ArrowUpRight size={17} />
                          </button>
                        </div>
                        <div className="fish-collection">
                          {state.students.slice(0, 8).map((s) => (
                            <button
                              key={s.id}
                              className="collection-fish"
                              onClick={() => setSelected(s.id)}
                            >
                              <Fish type={s.fish} />
                              <strong>{s.name.split(" ")[0]}</strong>
                              <small>{species[s.fish]}</small>
                            </button>
                          ))}
                        </div>
                      </section>
                    </>
                  )}
                  {page === "students" && (
                    <>
                      <div className="filter-bar">
                        <label className="search-field">
                          <Search size={18} />
                          <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Öğrenci ara…"
                            aria-label="Öğrenci ara"
                          />
                        </label>
                        <span>
                          {state.students.length} öğrenci / 40 kişilik sınıf
                        </span>
                      </div>
                      <div className="student-grid">
                        {state.students
                          .filter((s) =>
                            s.name
                              .toLocaleLowerCase("tr")
                              .includes(query.toLocaleLowerCase("tr")),
                          )
                          .map((s) => (
                            <button
                              key={s.id}
                              className="card student-card"
                              onClick={() => setSelected(s.id)}
                            >
                              <div className="student-top">
                                <Avatar student={s} />
                                <span className="tiny-tag">
                                  Seviye {level(s.xp)}
                                </span>
                              </div>
                              <Fish type={s.fish} />
                              <h3>{s.name}</h3>
                              <p>{species[s.fish]}</p>
                              <Progress value={(s.xp % 500) / 5} />
                              <div className="student-numbers">
                                <span>{s.xp} XP</span>
                                <span>
                                  {s.completed} görev <ChevronRight size={14} />
                                </span>
                              </div>
                            </button>
                          ))}
                      </div>
                      {!state.students.some((s) =>
                        s.name
                          .toLocaleLowerCase("tr")
                          .includes(query.toLocaleLowerCase("tr")),
                      ) && (
                        <div className="empty-state">
                          Bu isimde öğrenci bulunamadı.
                        </div>
                      )}
                    </>
                  )}
                  {page === "tasks" && (
                    <>
                      <div className="filter-bar">
                        <div className="tabs">
                          {["Tümü", "Devam eden", "Tamamlanan"].map((t) => (
                            <button
                              key={t}
                              onClick={() => setTaskFilter(t)}
                              className={taskFilter === t ? "active" : ""}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                        <span>{state.tasks.length} öğrenme fırsatı</span>
                      </div>
                      <div className="task-list">
                        {state.tasks
                          .filter(
                            (t) =>
                              taskFilter === "Tümü" ||
                              (taskFilter === "Tamamlanan"
                                ? t.done.length === t.assigned.length
                                : t.done.length < t.assigned.length),
                          )
                          .map((t) => (
                            <section key={t.id} className="card task-card">
                              <div className="task-heading">
                                <span className="icon-tile green">
                                  {t.type === "Okuma" ? (
                                    <BookOpen />
                                  ) : (
                                    <ClipboardList />
                                  )}
                                </span>
                                <div>
                                  <span className="eyebrow">{t.type}</span>
                                  <h3>{t.title}</h3>
                                  <p>{t.description}</p>
                                </div>
                                <span className="reward">
                                  +{t.xp} XP <small>+{t.feed} yem</small>
                                </span>
                              </div>
                              <div className="task-progress">
                                <Progress
                                  value={
                                    (t.done.length / t.assigned.length) * 100
                                  }
                                />
                                <span>
                                  {t.done.length}/{t.assigned.length} öğrenci
                                  tamamladı
                                </span>
                                <span>
                                  <CalendarDays size={14} />
                                  {new Date(
                                    t.due + "T12:00:00",
                                  ).toLocaleDateString("tr-TR", {
                                    day: "numeric",
                                    month: "long",
                                  })}
                                </span>
                              </div>
                              <details>
                                <summary>
                                  Öğrenci durumları ve onay{" "}
                                  <ChevronDown size={16} />
                                </summary>
                                <div className="approval-list">
                                  {t.assigned.map((id) => {
                                    const s = state.students.find(
                                      (x) => x.id === id,
                                    );
                                    return (
                                      s && (
                                        <div key={id}>
                                          <Avatar student={s} />
                                          <span>{s.name}</span>
                                          {t.done.includes(id) ? (
                                            <span className="completed">
                                              <CheckCheck size={16} />
                                              Tamamlandı
                                            </span>
                                          ) : (
                                            <button
                                              className="secondary"
                                              onClick={() => approve(t.id, id)}
                                            >
                                              Görevi onayla
                                            </button>
                                          )}
                                        </div>
                                      )
                                    );
                                  })}
                                </div>
                              </details>
                            </section>
                          ))}
                      </div>
                    </>
                  )}
                  {page === "decor" && (
                    <>
                      <div className="decor-intro card">
                        <div>
                          <span className="eyebrow">
                            ORTAK BAŞARI, ORTAK DENİZ
                          </span>
                          <h2>Başardıkça güzelleşir.</h2>
                          <p>
                            Öğrencilerin kazandığı her XP, yeni bir keşfin
                            kapısını açar.
                          </p>
                          <span className="reward">
                            {xp.toLocaleString("tr-TR")} sınıf XP’si ·{" "}
                            {earnedDecor}/9 dekor açıldı
                          </span>
                        </div>
                        <Decor type={8} />
                      </div>
                      <div className="decor-grid">
                        {decorNames.map((name, i) => {
                          const unlocked = xp >= decorThresholds[i],
                            active = state.decorations.includes(i);
                          return (
                            <article
                              key={name}
                              className={`card decor-card ${unlocked ? "" : "locked"}`}
                            >
                              <span
                                className={`decor-state ${unlocked ? "unlocked" : ""}`}
                              >
                                {unlocked ? (
                                  <Check size={13} />
                                ) : (
                                  <Lock size={13} />
                                )}{" "}
                                {unlocked
                                  ? "Kilidi açıldı"
                                  : `${decorThresholds[i]} XP`}
                              </span>
                              <Decor type={i} />
                              <h3>{name}</h3>
                              <p>
                                {i < 2
                                  ? "Denizimizin ilk parçaları"
                                  : `${decorThresholds[i].toLocaleString("tr-TR")} sınıf XP’si ile açılır`}
                              </p>
                              <button
                                className={
                                  active && unlocked
                                    ? "selected-button"
                                    : "secondary"
                                }
                                disabled={!unlocked}
                                onClick={() => toggleDecor(i)}
                              >
                                {!unlocked ? (
                                  "Birlikte başaracağız"
                                ) : active ? (
                                  <>
                                    <Check size={16} />
                                    Akvaryumda · Kaldır
                                  </>
                                ) : (
                                  "Akvaryuma ekle"
                                )}
                              </button>
                            </article>
                          );
                        })}
                      </div>
                    </>
                  )}
                  {page === "badges" && (
                    <>
                      <div className="card badge-intro">
                        <Award size={42} />
                        <div>
                          <h2>Her çaba fark edilir.</h2>
                          <p>
                            Görevlerle kazanılan rozetler, öğrenci profilinde
                            görünür.
                          </p>
                        </div>
                      </div>
                      <div className="decor-grid">
                        {[
                          ["İlk adım", 1],
                          ["Deniz kaşifi", 5],
                          ["Görev ustası", 10],
                          ["Derin deniz uzmanı", 20],
                          ["Sınıf yıldızı", 35],
                          ["Okyanus efsanesi", 50],
                        ].map(([name, threshold], i) => (
                          <div className="card badge-card" key={name}>
                            <span className={`medal medal-${i % 3}`}>
                              <Award size={42} />
                            </span>
                            <h3>{name}</h3>
                            <p>{threshold} görev tamamla</p>
                            <span className="tiny-tag">
                              {
                                state.students.filter(
                                  (x) => x.completed >= Number(threshold),
                                ).length
                              }{" "}
                              öğrenci kazandı
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {page === "reports" && (
                    <>
                      {stats}
                      <div className="reports-layout">
                        <section className="card report-card">
                          <div className="section-heading">
                            <h2>Görev katılımı</h2>
                            <span className="tiny-tag">
                              Güncel sınıf verisi
                            </span>
                          </div>
                          <div className="bar-chart">
                            {state.tasks.map((t) => (
                              <div key={t.id}>
                                <div className="bar-track">
                                  <i
                                    style={{
                                      height: `${(t.done.length / t.assigned.length) * 100}%`,
                                    }}
                                  >
                                    <b>
                                      %
                                      {Math.round(
                                        (t.done.length / t.assigned.length) *
                                          100,
                                      )}
                                    </b>
                                  </i>
                                </div>
                                <span>{t.title}</span>
                              </div>
                            ))}
                          </div>
                        </section>
                        <section className="card report-card">
                          <h2>Keşfe öncülük edenler</h2>
                          {[...state.students]
                            .sort((a, b) => b.xp - a.xp)
                            .slice(0, 6)
                            .map((s, i) => (
                              <button
                                className="ranking"
                                key={s.id}
                                onClick={() => setSelected(s.id)}
                              >
                                <span>{i + 1}</span>
                                <Avatar student={s} />
                                <strong>{s.name}</strong>
                                <span>{s.xp} XP</span>
                              </button>
                            ))}
                        </section>
                      </div>
                    </>
                  )}
                  {page === "settings" && (
                    <section className="card settings-card">
                      <h2>Sınıfınızın alanı</h2>
                      <p>4-A Sınıfı · Ayşe Yılmaz</p>
                      <div className="setting-row">
                        <div>
                          <h3>Veliye gösterilen öğretmen notu</h3>
                          <p>
                            Bu not veli görünümündeki iki örnek çocuk için
                            gösterilir.
                          </p>
                        </div>
                      </div>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const data = new FormData(e.currentTarget);
                          setState((s) => ({
                            ...s,
                            note: String(data.get("note")),
                          }));
                          setToast("Öğretmen notu güncellendi.");
                        }}
                      >
                        <textarea
                          name="note"
                          defaultValue={state.note}
                          maxLength={1000}
                          required
                          aria-label="Öğretmen notu"
                        />
                        <button className="primary" type="submit">
                          Notu kaydet
                        </button>
                      </form>
                      <div className="demo-explanation">
                        <ShieldCheck size={22} />
                        <p>
                          Örnek sınıf verileri yalnızca bu tarayıcıda tutulur.
                          Gerçek giriş, sınıflar arası yetkilendirme ve sunucu
                          bağlantısı bu sürümde etkin değildir. Gerçek öğrenci
                          verileri yerine örnek verilerle deneyin.
                        </p>
                      </div>
                    </section>
                  )}
                </>
              )}
              {role === "parent" && parentStudent && (
                <>
                  <section className="parent-hero card">
                    <Avatar student={parentStudent} large />
                    <div>
                      <span className="eyebrow">ÇOCUĞUNUZUN DENİZİ</span>
                      <label className="child-select">
                        <select
                          aria-label="Çocuk seç"
                          value={child}
                          onChange={(e) => setChild(e.target.value)}
                        >
                          {parentChildren.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown />
                      </label>
                      <p>4-A Sınıfı · Seviye {level(parentStudent.xp)}</p>
                      <Progress value={(parentStudent.xp % 500) / 5} />
                      <small>{parentStudent.xp % 500} / 500 XP</small>
                    </div>
                    <Fish type={parentStudent.fish} />
                  </section>
                  <div className="stats">
                    <Metric
                      icon={CheckCheck}
                      value={String(parentStudent.completed)}
                      label="Tamamlanan görev"
                      color="green"
                    />
                    <Metric
                      icon={ClipboardList}
                      value={String(
                        state.tasks.filter(
                          (t) =>
                            t.assigned.includes(parentStudent.id) &&
                            !t.done.includes(parentStudent.id),
                        ).length,
                      )}
                      label="Bekleyen görev"
                      color="blue"
                    />
                    <Metric
                      icon={Award}
                      value={String(
                        [1, 5, 10, 20, 35, 50].filter(
                          (x) => parentStudent.completed >= x,
                        ).length,
                      )}
                      label="Kazanılan rozet"
                      color="purple"
                    />
                    <Metric
                      icon={Utensils}
                      value={String(parentStudent.feed)}
                      label="Yem"
                      color="orange"
                    />
                  </div>
                  <div className="reports-layout">
                    <section className="card report-card">
                      <h2>Öğrenme yolculuğu</h2>
                      {state.tasks
                        .filter((t) => t.assigned.includes(parentStudent.id))
                        .map((t) => (
                          <div className="parent-task" key={t.id}>
                            <span className="icon-tile green">
                              <BookOpen size={19} />
                            </span>
                            <div>
                              <h3>{t.title}</h3>
                              <small>
                                {t.type} · {t.due}
                              </small>
                            </div>
                            <span
                              className={
                                t.done.includes(parentStudent.id)
                                  ? "completed"
                                  : "pending"
                              }
                            >
                              {t.done.includes(parentStudent.id)
                                ? "Tamamlandı"
                                : "Devam ediyor"}
                            </span>
                          </div>
                        ))}
                    </section>
                    <section className="card teacher-note">
                      <span className="icon-tile purple">
                        <Heart />
                      </span>
                      <span className="eyebrow">AYŞE ÖĞRETMENDEN</span>
                      <h2>Birlikte destekleyelim.</h2>
                      <p>{state.note}</p>
                      <small>Sevgiyle, Ayşe Öğretmen</small>
                    </section>
                  </div>
                  <section className="card parent-aquarium">
                    <div className="section-heading">
                      <h2>
                        {parentStudent.name.split(" ")[0]} ve deniz arkadaşı
                      </h2>
                      <span className="tiny-tag">
                        {species[parentStudent.fish]}
                      </span>
                    </div>
                    <Aquarium
                      students={[parentStudent]}
                      decorations={state.decorations}
                      xp={xp}
                      onSelect={(s) => setSelected(s.id)}
                      compact
                    />
                  </section>
                </>
              )}
              <footer className="page-footer">
                <span>
                  <Waves size={17} />
                  Her sınıfın bir denizi var.
                </span>
                <small>Sevgiyle öğren, birlikte büyü.</small>
                <Heart size={16} />
              </footer>
            </div>
          </main>
        </div>
      )}
      {modal === "notice" && (
        <Modal title="Denizden haberler" onClose={() => setModal(null)}>
          {activities()}
          <p className="muted">
            Yeni görev onayları ve beslemeler burada görünür.
          </p>
        </Modal>
      )}
      {modal === "student" && (
        <StudentForm
          onClose={() => setModal(null)}
          count={state.students.length}
          onSave={(s) => {
            setState((old) => ({
              ...old,
              students: [...old.students, s],
              activities: [
                {
                  id: `new-${s.id}`,
                  text: `${s.name}, sınıf denizimize katıldı.`,
                  kind: "student" as const,
                  time: "Az önce",
                },
                ...old.activities,
              ].slice(0, 20),
            }));
            setModal(null);
            setToast("Yeni deniz arkadaşımız sınıfa katıldı.");
          }}
        />
      )}
      {modal === "task" && (
        <TaskForm
          students={state.students}
          onClose={() => setModal(null)}
          onSave={(task) => {
            setState((old) => ({ ...old, tasks: [task, ...old.tasks] }));
            setModal(null);
            navigate("tasks");
            setToast("Yeni görev öğrencilere atandı.");
          }}
        />
      )}
      {current && (
        <Modal
          title="Öğrencinin hikâyesi"
          onClose={() => setSelected(null)}
          wide
        >
          <div className="profile-hero">
            <Avatar student={current} large />
            <div>
              <span className="eyebrow">4-A SINIFI</span>
              <h2>{current.name}</h2>
              <p>
                Seviye {level(current.xp)} · {species[current.fish]}
              </p>
              <Progress value={(current.xp % 500) / 5} />
              <small>{current.xp % 500} / 500 XP</small>
            </div>
            <Fish type={current.fish} />
          </div>
          <div className="profile-metrics">
            <div>
              <strong>{current.xp}</strong>
              <span>Toplam XP</span>
            </div>
            <div>
              <strong>{current.feed}</strong>
              <span>Yem</span>
            </div>
            <div>
              <strong>{current.completed}</strong>
              <span>Tamamlanan görev</span>
            </div>
          </div>
          <h3>Kazanılan rozetler</h3>
          <div className="earned-badges">
            {[
              ["İlk adım", 1],
              ["Deniz kaşifi", 5],
              ["Görev ustası", 10],
              ["Derin deniz uzmanı", 20],
              ["Sınıf yıldızı", 35],
              ["Okyanus efsanesi", 50],
            ]
              .filter(([, n]) => current.completed >= Number(n))
              .map(([name]) => (
                <span key={name}>
                  <Award size={20} />
                  {name}
                </span>
              ))}
            {current.completed === 0 && (
              <p>İlk görev, ilk rozetin başlangıcı.</p>
            )}
          </div>
          <h3>Görev geçmişi</h3>
          {state.tasks
            .filter((t) => t.assigned.includes(current.id))
            .map((t) => (
              <div key={t.id} className="profile-task">
                <div>
                  <strong>{t.title}</strong>
                  <small>
                    +{t.xp} XP · +{t.feed} yem
                  </small>
                </div>
                {t.done.includes(current.id) ? (
                  <span className="completed">
                    <Check size={15} />
                    Tamamlandı
                  </span>
                ) : role === "teacher" ? (
                  <button
                    className="secondary"
                    onClick={() => approve(t.id, current.id)}
                  >
                    Onayla
                  </button>
                ) : (
                  <span className="pending">Devam ediyor</span>
                )}
              </div>
            ))}
          {role === "teacher" && (
            <>
              <h3>Deniz arkadaşını seç</h3>
              <div className="fish-picker">
                {species.map((name, i) => (
                  <button
                    key={name}
                    aria-label={name}
                    className={current.fish === i ? "selected" : ""}
                    onClick={() =>
                      setState((s) => ({
                        ...s,
                        students: s.students.map((st) =>
                          st.id === current.id ? { ...st, fish: i } : st,
                        ),
                      }))
                    }
                  >
                    <Fish type={i} />
                    <small>{name}</small>
                  </button>
                ))}
              </div>
            </>
          )}
        </Modal>
      )}
      {toast && (
        <div className="toast" role="status">
          <Check size={18} />
          {toast}
          <button aria-label="Bildirimi kapat" onClick={() => setToast("")}>
            <X size={16} />
          </button>
        </div>
      )}
    </>
  );
}
function Metric({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: typeof Users;
  value: string;
  label: string;
  color: string;
}) {
  return (
    <div className="card metric">
      <span className={`icon-tile ${color}`}>
        <Icon size={23} />
      </span>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
      <span className="metric-decoration" />
    </div>
  );
}
