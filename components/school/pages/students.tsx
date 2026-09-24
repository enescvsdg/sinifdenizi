"use client";
import { useState } from "react";
import { ChevronRight, Search } from "lucide-react";
import { Fish } from "../../sprites";
import { Avatar, Progress } from "../ui";
import { useSchool } from "../state";
import { level, species } from "@/lib/model";

export function StudentsPage() {
  const { state, tasksDone, openProfile } = useSchool();
  const [query, setQuery] = useState("");
  const shown = state.students.filter((s) =>
    s.name.toLocaleLowerCase("tr").includes(query.toLocaleLowerCase("tr")),
  );
  return (
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
        <span>{state.students.length} öğrenci / 40 kişilik sınıf</span>
      </div>
      <div className="student-grid">
        {shown.map((s) => (
          <button
            key={s.id}
            className="card student-card"
            onClick={() => openProfile(s.id)}
          >
            <div className="student-top">
              <Avatar student={s} />
              <span className="tiny-tag">Seviye {level(s.xp)}</span>
            </div>
            <Fish type={s.fish} />
            <h3>{s.name}</h3>
            <p>{species[s.fish]}</p>
            <Progress value={(s.xp % 500) / 5} />
            <div className="student-numbers">
              <span>{s.xp} XP</span>
              <span>
                {tasksDone(s.id)} görev <ChevronRight size={14} />
              </span>
            </div>
          </button>
        ))}
      </div>
      {!shown.length && (
        <div className="empty-state">Bu isimde öğrenci bulunamadı.</div>
      )}
    </>
  );
}
