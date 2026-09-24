"use client";
import { useState } from "react";
import {
  BookOpen,
  CalendarDays,
  CheckCheck,
  ChevronDown,
  ClipboardList,
  Pencil,
  Trash2,
  Undo2,
} from "lucide-react";
import { Avatar, Progress } from "../ui";
import { useSchool } from "../state";
import { useNow } from "../time";
import { formatDay, isOverdue } from "@/lib/time";

const filters = ["Tümü", "Devam eden", "Tamamlanan"] as const;

export function TasksPage() {
  const { state, approve, undo, editTask, deleteTask } = useSchool();
  const now = useNow();
  const [filter, setFilter] = useState<(typeof filters)[number]>("Tümü");
  const [confirming, setConfirming] = useState<string | null>(null);
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
          .map((t) => {
            const open = t.done.length < t.assigned.length;
            return (
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
                    {formatDay(t.due)}
                    {open && now && isOverdue(t.due, now) && (
                      <b className="overdue">Süresi geçti</b>
                    )}
                  </span>
                </div>
                {confirming === t.id ? (
                  <div className="remove-confirm">
                    <p>
                      <strong>{t.title}</strong> silinsin mi?
                      {t.done.length > 0 &&
                        ` Onaylanan ${t.done.length} öğrencinin bu görevden kazandığı XP ve yem geri alınır.`}{" "}
                      Bu işlem geri alınamaz.
                    </p>
                    <div>
                      <button
                        className="secondary"
                        onClick={() => setConfirming(null)}
                      >
                        Vazgeç
                      </button>
                      <button
                        className="danger-button"
                        onClick={() => {
                          deleteTask(t.id);
                          setConfirming(null);
                        }}
                      >
                        Evet, görevi sil
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="task-actions">
                    <button
                      className="secondary"
                      onClick={() => editTask(t.id)}
                    >
                      <Pencil size={15} />
                      Düzenle
                    </button>
                    <button
                      className="danger-link"
                      onClick={() => setConfirming(t.id)}
                    >
                      <Trash2 size={15} />
                      Sil
                    </button>
                  </div>
                )}
                <details>
                  <summary>
                    Öğrenci durumları ve onay <ChevronDown size={16} />
                  </summary>
                  <div className="approval-list">
                    {t.assigned.map((id) => {
                      const s = state.students.find((x) => x.id === id);
                      const approval = t.approvals?.[id];
                      return (
                        s && (
                          <div key={id}>
                            <Avatar student={s} />
                            <span>{s.name}</span>
                            {t.done.includes(id) ? (
                              <>
                                <span className="completed">
                                  <CheckCheck size={16} />
                                  Tamamlandı
                                  {approval?.at &&
                                    ` · ${formatDay(approval.at)}`}
                                </span>
                                <button
                                  className="undo-button"
                                  aria-label={`${s.name} için onayı geri al`}
                                  title="Onayı geri al"
                                  onClick={() => undo(t.id, id)}
                                >
                                  <Undo2 size={15} />
                                  Geri al
                                </button>
                              </>
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
            );
          })}
      </div>
    </>
  );
}
