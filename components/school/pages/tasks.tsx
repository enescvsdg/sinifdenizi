"use client";
import { useState } from "react";
import {
  BookOpen,
  CalendarDays,
  CheckCheck,
  ChevronDown,
  ClipboardList,
} from "lucide-react";
import { Avatar, Progress } from "../ui";
import { useSchool } from "../state";

const filters = ["Tümü", "Devam eden", "Tamamlanan"] as const;

export function TasksPage() {
  const { state, approve } = useSchool();
  const [filter, setFilter] = useState<(typeof filters)[number]>("Tümü");
  return (
    <>
      <div className="filter-bar">
        <div className="tabs">
          {filters.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={filter === t ? "active" : ""}
              aria-pressed={filter === t}
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
              filter === "Tümü" ||
              (filter === "Tamamlanan"
                ? t.done.length === t.assigned.length
                : t.done.length < t.assigned.length),
          )
          .map((t) => (
            <section key={t.id} className="card task-card">
              <div className="task-heading">
                <span className="icon-tile green">
                  {t.type === "Okuma" ? <BookOpen /> : <ClipboardList />}
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
                <Progress value={(t.done.length / t.assigned.length) * 100} />
                <span>
                  {t.done.length}/{t.assigned.length} öğrenci tamamladı
                </span>
                <span>
                  <CalendarDays size={14} />
                  {new Date(t.due + "T12:00:00").toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                  })}
                </span>
              </div>
              <details>
                <summary>
                  Öğrenci durumları ve onay <ChevronDown size={16} />
                </summary>
                <div className="approval-list">
                  {t.assigned.map((id) => {
                    const s = state.students.find((x) => x.id === id);
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
  );
}
