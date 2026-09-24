"use client";
import { ShieldCheck } from "lucide-react";
import { useSchool } from "../state";

export function SettingsPage() {
  const { state, setState, notify } = useSchool();
  return (
    <section className="card settings-card">
      <h2>Sınıfınızın alanı</h2>
      <p>4-A Sınıfı · Ayşe Yılmaz</p>
      <div className="setting-row">
        <div>
          <h3>Veliye gösterilen öğretmen notu</h3>
          <p>Bu not veli görünümündeki iki örnek çocuk için gösterilir.</p>
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          setState((s) => ({ ...s, note: String(data.get("note")) }));
          notify("Öğretmen notu güncellendi.");
        }}
      >
        <textarea
          // Remount once the saved classroom has loaded.
          key={state.note}
          name="note"
          defaultValue={state.note}
          maxLength={1000}
          required
          aria-label="Öğretmen notu"
        />
        <button className="primary" type="submit">
          Notu kaydet
        </button>
      </form>
      <div className="demo-explanation">
        <ShieldCheck size={22} />
        <p>
          Örnek sınıf verileri yalnızca bu tarayıcıda tutulur. Gerçek giriş,
          sınıflar arası yetkilendirme ve sunucu bağlantısı bu sürümde etkin
          değildir. Gerçek öğrenci verileri yerine örnek verilerle deneyin.
        </p>
      </div>
    </section>
  );
}
