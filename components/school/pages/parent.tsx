"use client";
import { useState } from "react";
import {
  Award,
  BookOpen,
  CheckCheck,
  ChevronDown,
  ClipboardList,
  Heart,
  Utensils,
} from "lucide-react";
import Aquarium from "../../aquarium";
import { Fish } from "../../sprites";
import { Avatar, Metric, Progress } from "../ui";
import { useSchool } from "../state";
import { earnedBadges, level, species } from "@/lib/model";

// The demo parent account is linked to the first two sample students.
const linked = ["student-0", "student-1"];

export function ParentPage() {
  const { state, xp, tasksDone, openProfile } = useSchool();
  const [child, setChild] = useState(linked[0]);
  const children = state.students.filter((x) => linked.includes(x.id));
  const student = children.find((x) => x.id === child) || children[0];
  if (!student)
    return (
      <div className="card empty-state">
        Bu örnek veli hesabına bağlı öğrenci kalmadı.
      </div>
    );
  const done = tasksDone(student.id);
  return (
    <>
      <section className="parent-hero card">
        <Avatar student={student} large />
        <div>
          <span className="eyebrow">ÇOCUĞUNUZUN DENİZİ</span>
          <label className="child-select">
            <select
              aria-label="Çocuk seç"
              value={student.id}
              onChange={(e) => setChild(e.target.value)}
            >
              {children.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <ChevronDown />
          </label>
          <p>4-A Sınıfı · Seviye {level(student.xp)}</p>
          <Progress value={(student.xp % 500) / 5} />
          <small>{student.xp % 500} / 500 XP</small>
        </div>
        <Fish type={student.fish} />
      </section>
      <div className="stats">
        <Metric
          icon={CheckCheck}
          value={String(done)}
          label="Tamamlanan görev"
          color="green"
        />
        <Metric
          icon={ClipboardList}
          value={String(
            state.tasks.filter(
              (t) =>
                t.assigned.includes(student.id) && !t.done.includes(student.id),
            ).length,
          )}
          label="Bekleyen görev"
          color="blue"
        />
        <Metric
          icon={Award}
          value={String(earnedBadges(done).length)}
          label="Kazanılan rozet"
          color="purple"
        />
        <Metric
          icon={Utensils}
          value={String(student.feed)}
          label="Yem"
          color="orange"
        />
      </div>
      <div className="reports-layout">
        <section className="card report-card">
          <h2>Öğrenme yolculuğu</h2>
          {state.tasks
            .filter((t) => t.assigned.includes(student.id))
            .map((t) => (
              <div className="parent-task" key={t.id}>
                <span className="icon-tile green">
                  <BookOpen size={19} />
                </span>
                <div>
                  <h3>{t.title}</h3>
                  <small>
                    {t.type} ·{" "}
                    {new Date(t.due + "T12:00:00").toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "long",
                    })}
                  </small>
                </div>
                <span
                  className={
                    t.done.includes(student.id) ? "completed" : "pending"
                  }
                >
                  {t.done.includes(student.id) ? "Tamamlandı" : "Devam ediyor"}
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
          <h2>{student.name.split(" ")[0]} ve deniz arkadaşı</h2>
          <span className="tiny-tag">{species[student.fish]}</span>
        </div>
        <Aquarium
          students={[student]}
          decorations={state.decorations}
          xp={xp}
          onSelect={(s) => openProfile(s.id)}
          compact
        />
      </section>
    </>
  );
}
