"use client";

import { useId, useState } from "react";
import { Check, Lock, Search, Sparkles } from "lucide-react";
import { Fish } from "./sprites";
import type { Student } from "@/lib/model";
import {
  canChooseSpecies,
  filterSpecies,
  isSpeciesUnlocked,
  speciesFilters,
  type SpeciesFilter,
} from "@/lib/species";
import "@/app/fish-catalog.css";

export function FishPicker({
  selected,
  xp,
  onSelect,
  compact = false,
  disabled = false,
}: {
  selected?: number;
  xp: number;
  onSelect: (id: number) => void;
  compact?: boolean;
  disabled?: boolean;
}) {
  const [filter, setFilter] = useState<SpeciesFilter>("all"),
    [query, setQuery] = useState("");
  const searchId = useId();
  const fish = filterSpecies(filter, query);
  return (
    <div className={`species-picker ${compact ? "species-picker-compact" : ""}`}>
      <div className="species-controls">
        <div className="species-filters" role="group" aria-label="Balık türü filtresi">
          {speciesFilters.map((item) => (
            <button type="button" key={item.id} aria-pressed={filter === item.id}
              className={filter === item.id ? "active" : ""}
              onClick={() => setFilter(item.id)}>{item.label}</button>
          ))}
        </div>
        <label className="species-search" htmlFor={searchId}>
          <Search size={16} aria-hidden="true" />
          <input id={searchId} type="search" value={query} placeholder="Balık ara…"
            aria-label="Balık ara" onChange={(event) => setQuery(event.target.value)} />
        </label>
      </div>
      <div className="species-grid">
        {fish.map((item) => {
          const unlocked = isSpeciesUnlocked(item.id, xp),
            chosen = item.id === selected;
          return (
            <button type="button" key={item.id} data-species-id={item.id}
              className={`species-card ${chosen ? "selected" : ""} ${!unlocked ? "locked" : ""} ${!item.available ? "unavailable" : ""}`}
              aria-label={`${item.name}${!item.available ? ", görsel hazırlanıyor" : ""}${!unlocked ? `, ${item.unlockXp.toLocaleString("tr-TR")} XP ile açılır` : ""}`}
              aria-pressed={chosen} disabled={disabled || !canChooseSpecies(item.id, xp)}
              onClick={() => { if (!disabled && canChooseSpecies(item.id, xp)) onSelect(item.id); }}>
              <span className="species-portrait">{item.available ? <Fish type={item.id} /> : <span className="species-art-pending">Görsel<br />hazırlanıyor</span>}</span>
              {chosen && <span className="species-status"><Check size={13} /></span>}
              {!unlocked && <span className="species-lock"><Lock size={16} /></span>}
              <strong>{item.name}</strong>
              {item.unlockXp > 0 && <small>{unlocked ? "Kilidi açıldı" : `${item.unlockXp.toLocaleString("tr-TR")} XP`}</small>}
            </button>
          );
        })}
      </div>
      {!fish.length && <p className="species-empty" role="status">Bu aramada bir deniz arkadaşı bulunamadı.</p>}
      <p className="species-footnote"><Lock size={13} /> Özel canlılar öğrencinin toplam XP puanıyla açılır. Görseli hazırlanan türler henüz seçilemez. <span>{fish.length} tür gösteriliyor</span></p>
    </div>
  );
}

export default function FishCatalog({ students, onAssign }: {
  students: Student[];
  onAssign: (studentId: string, speciesId: number) => void;
}) {
  const [studentId, setStudentId] = useState(students[0]?.id || "");
  const pupil = students.find((student) => student.id === studentId) || students[0];
  const selectId = useId();
  return (
    <section className="card fish-catalog" aria-labelledby="fish-catalog-title">
      <div className="catalog-heading">
        <div><span className="eyebrow">DENİZİMİZİN SAKİNLERİ</span><h2 id="fish-catalog-title">Balık seçenekleri</h2>
          <p>Her öğrenciye bir deniz arkadaşı. Başarılarıyla yeni türlerin kilidini açın.</p></div>
        <span className="catalog-species-count"><Sparkles size={16} /> 30 tür · 12 hazır</span>
      </div>
      <div className="catalog-student-row">
        <label htmlFor={selectId}>Deniz arkadaşını seçtiğin öğrenci
          <select id={selectId} value={pupil?.id || ""} onChange={(event) => setStudentId(event.target.value)} disabled={!pupil}>
            {!pupil && <option value="">Önce öğrenci ekleyin</option>}
            {students.map((student) => <option key={student.id} value={student.id}>{student.name}</option>)}
          </select>
        </label>
        {pupil && <span className="catalog-pupil-xp"><strong>{pupil.xp.toLocaleString("tr-TR")} XP</strong> Bir karta dokunarak öğrencinin balığını değiştirin.</span>}
      </div>
      <FishPicker selected={pupil?.fish} xp={pupil?.xp || 0} disabled={!pupil}
        onSelect={(id) => { if (pupil && canChooseSpecies(id, pupil.xp)) onAssign(pupil.id, id); }} />
    </section>
  );
}
