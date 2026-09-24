"use client";
import Link from "next/link";
import {
  ChartNoAxesCombined,
  Check,
  ChevronRight,
  ClipboardList,
  Sparkles,
  Star,
  Users,
  Utensils,
} from "lucide-react";
import { Decor } from "../sprites";
import { Metric, Progress } from "./ui";
import { useSchool } from "./state";
import { decorNames, decorThresholds } from "@/lib/model";
import { paths } from "@/lib/routes";

export function Stats() {
  const { state, activeTasks, completion, feed } = useSchool();
  return (
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
}

export function Activities() {
  const { state } = useSchool();
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

export function ClassGoal() {
  const { xp } = useSchool();
  const next = decorThresholds.findIndex((x) => x > xp);
  return (
    <section className="card goal-card">
      <div className="section-heading">
        <h3>Birlikte bir adım daha</h3>
        <Sparkles size={18} />
      </div>
      <div className="goal-visual">
        <Decor type={next < 0 ? 8 : next} />
        <div>
          <span className="eyebrow">SIRADAKİ KEŞİF</span>
          <h4>{next < 0 ? "Efsane sınıf!" : decorNames[next]}</h4>
          <p>
            {next < 0
              ? "Tüm dekorların kilidi açıldı."
              : `${(decorThresholds[next] - xp).toLocaleString("tr-TR")} XP kaldı`}
          </p>
        </div>
      </div>
      <Progress value={next < 0 ? 100 : (xp / decorThresholds[next]) * 100} />
      <div className="goal-numbers">
        <span>{xp.toLocaleString("tr-TR")} XP</span>
        <span>
          {next < 0
            ? "Tamamlandı"
            : `${decorThresholds[next].toLocaleString("tr-TR")} XP`}
        </span>
      </div>
      <Link className="text-button" href={paths.decor}>
        Sınıf hedeflerini keşfet <ChevronRight size={15} />
      </Link>
    </section>
  );
}
