"use client";
import { Award } from "lucide-react";
import { useSchool } from "../state";
import { badges } from "@/lib/model";

export function BadgesPage() {
  const { state, tasksDone } = useSchool();
  return (
    <>
      <div className="card badge-intro">
        <Award size={42} />
        <div>
          <h2>Her çaba fark edilir.</h2>
          <p>Görevlerle kazanılan rozetler, öğrenci profilinde görünür.</p>
        </div>
      </div>
      <div className="decor-grid">
        {badges.map(({ name, tasks }, i) => (
          <div className="card badge-card" key={name}>
            <span className={`medal medal-${i % 3}`}>
              <Award size={42} />
            </span>
            <h3>{name}</h3>
            <p>{tasks} görev tamamla</p>
            <span className="tiny-tag">
              {state.students.filter((x) => tasksDone(x.id) >= tasks).length}{" "}
              öğrenci kazandı
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
