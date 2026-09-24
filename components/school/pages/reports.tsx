"use client";
import { Avatar } from "../ui";
import { Stats } from "../widgets";
import { useSchool } from "../state";

export function ReportsPage() {
  const { state, openProfile } = useSchool();
  return (
    <>
      <Stats />
      <div className="reports-layout">
        <section className="card report-card">
          <div className="section-heading">
            <h2>Görev katılımı</h2>
            <span className="tiny-tag">Güncel sınıf verisi</span>
          </div>
          <div className="bar-chart">
            {state.tasks.map((t) => {
              const rate = (t.done.length / t.assigned.length) * 100;
              return (
                <div key={t.id}>
                  <div className="bar-track">
                    <i style={{ height: `${rate}%` }}>
                      <b>%{Math.round(rate)}</b>
                    </i>
                  </div>
                  <span>{t.title}</span>
                </div>
              );
            })}
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
                onClick={() => openProfile(s.id)}
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
  );
}
