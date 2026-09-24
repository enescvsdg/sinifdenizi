"use client";
import { Check, Lock } from "lucide-react";
import { Decor } from "../../sprites";
import { useSchool } from "../state";
import { decorNames, decorThresholds } from "@/lib/model";

export function DecorPage() {
  const { state, progress, toggleDecor } = useSchool();
  return (
    <>
      <div className="decor-intro card">
        <div>
          <span className="eyebrow">ORTAK BAŞARI, ORTAK DENİZ</span>
          <h2>Başardıkça güzelleşir.</h2>
          <p>
            Her öğrencinin kazandığı XP sınıf ortalamasını yükseltir; ortalama
            arttıkça yeni keşifler açılır. Kalabalık ve küçük sınıflar aynı
            hızda ilerler.
          </p>
          <span className="reward">
            Öğrenci başına ortalama{" "}
            {Math.floor(progress.average).toLocaleString("tr-TR")} XP ·{" "}
            {progress.unlocked}/9 dekor açıldı
          </span>
        </div>
        <Decor type={8} />
      </div>
      <div className="decor-grid">
        {decorNames.map((name, i) => {
          const unlocked = decorThresholds[i] <= progress.average,
            active = state.decorations.includes(i);
          return (
            <article
              key={name}
              className={`card decor-card ${unlocked ? "" : "locked"}`}
            >
              <span className={`decor-state ${unlocked ? "unlocked" : ""}`}>
                {unlocked ? <Check size={13} /> : <Lock size={13} />}{" "}
                {unlocked ? "Kilidi açıldı" : `Ort. ${decorThresholds[i]} XP`}
              </span>
              <Decor type={i} />
              <h3>{name}</h3>
              <p>
                {i < 2
                  ? "Denizimizin ilk parçaları"
                  : `Öğrenci başına ortalama ${decorThresholds[i]} XP ile açılır`}
              </p>
              <button
                className={active && unlocked ? "selected-button" : "secondary"}
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
  );
}
