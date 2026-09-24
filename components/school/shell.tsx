"use client";
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  Award,
  Bell,
  ChartNoAxesCombined,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Fish as FishIcon,
  GraduationCap,
  Heart,
  House,
  LogOut,
  Menu,
  Plus,
  Settings,
  Shell,
  Users,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { Fish } from "../sprites";
import { Brand } from "./ui";
import { useSchool } from "./state";
import { paths, routeFor, titles, type RouteKey } from "@/lib/routes";

const navigation: [RouteKey, LucideIcon][] = [
  ["dashboard", House],
  ["aquarium", FishIcon],
  ["students", Users],
  ["tasks", ClipboardList],
  ["decor", Shell],
  ["badges", Award],
  ["reports", ChartNoAxesCombined],
];
const headings: Partial<Record<RouteKey, [title: string, text: string]>> = {
  aquarium: [
    "Bizim sınıf, bizim deniz.",
    "Her balık bir öğrenci. Her başarı, denizimize yeni bir renk.",
  ],
  dashboard: [
    "Merhaba, Ayşe Öğretmen.",
    "Bugün de birlikte öğrenmek için güzel bir gün.",
  ],
  parent: [
    "Çocuğunuzun keşif yolculuğu",
    "Küçük adımlarını izleyin, büyük mutluluğunu paylaşın.",
  ],
};

/** Sidebar, top bar and page heading around every classroom page. */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const route = routeFor(pathname);
  const parent = route === "parent";
  const { activeTasks, openModal } = useSchool();
  const [menuOpen, setMenuOpen] = useState(false);
  // Navigating closes the menu.
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenuOpen(false);
  }
  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenuOpen(false);
      document.querySelector<HTMLElement>(".mobile-toggle")?.focus();
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menuOpen]);
  const [title, text] = headings[route] ?? [
    titles[route],
    "Birlikte öğrendiğimiz, birlikte büyüdüğümüz bir dünya.",
  ];
  return (
    <div className={`app-shell ${menuOpen ? "nav-open" : ""}`}>
      <button
        className="nav-scrim"
        aria-label="Menüyü kapat"
        onClick={() => setMenuOpen(false)}
      />
      <aside className="sidebar" id="app-menu" aria-label="Ana menü">
        <Brand />
        <div className="school-label">ÖĞRENME YOLCULUĞU</div>
        <nav>
          {parent ? (
            <>
              <Link className="active" href={paths.parent} aria-current="page">
                <Heart size={20} />
                Çocuğumun denizi
              </Link>
              <Link href={paths.aquarium}>
                <GraduationCap size={20} />
                Öğretmen demosu
              </Link>
            </>
          ) : (
            navigation.map(([key, Icon]) => (
              <Link
                key={key}
                href={paths[key]}
                className={route === key ? "active" : ""}
                aria-current={route === key ? "page" : undefined}
              >
                <Icon size={20} />
                <span>{titles[key]}</span>
                {key === "tasks" && <small>{activeTasks}</small>}
                {route === key && <i />}
              </Link>
            ))
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
          {!parent && (
            <Link href={paths.settings}>
              <Settings size={19} />
              Ayarlar
            </Link>
          )}
          <Link href={paths.welcome}>
            <LogOut size={19} />
            Demodan çık
          </Link>
          <div className="teacher-profile">
            <span className="teacher-avatar">AY</span>
            <div>
              <strong>{parent ? "Demo veli" : "Ayşe Yılmaz"}</strong>
              <small>{parent ? "Çocuk takip paneli" : "Sınıf öğretmeni"}</small>
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
              aria-controls="app-menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Menu />
            </button>
            <span>Sınıfım</span>
            <ChevronRight size={15} />
            <strong>{titles[route]}</strong>
          </div>
          <div className="topbar-right">
            <span className="demo-pill">Örnek sınıf</span>
            <Link
              className="role-switch"
              href={parent ? paths.aquarium : paths.parent}
            >
              <span>{parent ? "Öğretmen görünümü" : "Veli görünümü"}</span>
              <ArrowUpRight size={16} />
            </Link>
            <button
              className="notification-button icon-button"
              aria-label="Bildirimleri aç"
              onClick={() => openModal("notice")}
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
                {parent
                  ? "HER BAŞARININ BİR HİKÂYESİ VAR"
                  : "ÖĞREN. KAZAN. BÜYÜT."}
              </div>
              <h1>{title}</h1>
              <p>{text}</p>
            </div>
            <div className="heading-actions">
              {!parent && (
                <>
                  <span className="class-selector">
                    <GraduationCap size={18} />
                    <b>4-A Sınıfı</b>
                  </span>
                  <button
                    className="primary"
                    onClick={() =>
                      openModal(route === "students" ? "student" : "task")
                    }
                  >
                    <Plus size={18} />
                    {route === "students" ? "Öğrenci ekle" : "Yeni görev"}
                  </button>
                </>
              )}
            </div>
          </div>
          {children}
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
  );
}
