"use client";
import Link from "next/link";
import {
  ChartNoAxesCombined,
  ChevronRight,
  ClipboardList,
  Fish as FishIcon,
  UserPlus,
} from "lucide-react";
import { Progress } from "../ui";
import { Activities, ClassGoal, Stats } from "../widgets";
import { useSchool } from "../state";
import { paths } from "@/lib/routes";

export function DashboardPage() {
  const { state, openModal } = useSchool();
  const open = state.tasks.filter((t) => t.done.length < t.assigned.length);
  return (
    <>
      <Stats />
      <div className="dashboard-layout">
        <div className="dashboard-main">
          <section className="card quick-actions">
            <h2>Hızlı işlemler</h2>
            <div>
              <button onClick={() => openModal("student")}>
                <span className="icon-tile blue">
                  <UserPlus size={22} />
                </span>
                Öğrenci ekle
              </button>
              <button onClick={() => openModal("task")}>
                <span className="icon-tile green">
                  <ClipboardList size={22} />
                </span>
                Görev oluştur
              </button>
              <Link href={paths.aquarium}>
                <span className="icon-tile purple">
                  <FishIcon size={22} />
                </span>
                Akvaryumu aç
              </Link>
              <Link href={paths.reports}>
                <span className="icon-tile orange">
                  <ChartNoAxesCombined size={22} />
                </span>
                Raporları gör
              </Link>
            </div>
          </section>
          <section className="card pending-tasks">
            <div className="section-heading">
              <h2>Onay bekleyen görevler</h2>
              <Link className="text-button" href={paths.tasks}>
                Tüm görevler <ChevronRight size={15} />
              </Link>
            </div>
            {open.length ? (
              open.map((t) => (
                <div key={t.id}>
                  <div>
                    <strong>{t.title}</strong>
                    <span>
                      {t.assigned.length - t.done.length} öğrenci bekliyor ·{" "}
                      {t.done.length}/{t.assigned.length} tamamlandı
                    </span>
                  </div>
                  <Progress value={(t.done.length / t.assigned.length) * 100} />
                </div>
              ))
            ) : (
              <p className="muted">Onay bekleyen görev yok.</p>
            )}
          </section>
        </div>
        <aside className="ocean-aside">
          <ClassGoal />
          <Activities />
        </aside>
      </div>
    </>
  );
}
