"use client";
import { Check, Lock } from "lucide-react";
import { Decor } from "../../sprites";
import { useSchool } from "../state";
import { decorNames, decorThresholds } from "@/lib/model";

export function DecorPage() {
  const { state, xp, toggleDecor } = useSchool();
  const earned = decorThresholds.filter((x) => x <= xp).length;
  return (
    <>
      <div className="decor-intro card">
        <div>
          <span className="eyebrow">ORTAK BAŞARI, ORTAK DENİZ</span>
          <h2>Başardıkça güzelleşir.</h2>
          <p>Öğrencilerin kazandığı her XP, yeni bir keşfin kapısını açar.</p>
          <span className="reward">
            {xp.toLocaleString("tr-TR")} sınıf XP’si · {earned}/9 dekor açıldı
          </span>
        </div>
        <Decor type={8} />
      </div>
      <div className="decor-grid">
        {decorNames.map((name, i) => {
          const unlocked = xp >= decorThresholds[i],
            active = state.decorations.includes(i);
          return (
            <article
              key={name}
              className={`card decor-card ${unlocked ? "" : "locked"}`}
            >
              <span className={`decor-state ${unlocked ? "unlocked" : ""}`}>
                {unlocked ? <Check size={13} /> : <Lock size={13} />}{" "}
                {unlocked ? "Kilidi açıldı" : `${decorThresholds[i]} XP`}
              </span>
              <Decor type={i} />
              <h3>{name}</h3>
              <p>
                {i < 2
                  ? "Denizimizin ilk parçaları"
                  : `${decorThresholds[i].toLocaleString("tr-TR")} sınıf XP’si ile açılır`}
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
