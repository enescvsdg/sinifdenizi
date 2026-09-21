"use client";
import { useState } from "react";
import Modal from "./modal";
import { Fish } from "./sprites";
import { species, type Student, type Task } from "@/lib/model";
export function StudentForm({
  onClose,
  onSave,
  count,
}: {
  onClose: () => void;
  onSave: (s: Student) => void;
  count: number;
}) {
  const [fish, setFish] = useState(0),
    [photo, setPhoto] = useState<string>(),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false);
  return (
    <Modal title="Yeni bir deniz arkadaşı" onClose={onClose} wide>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const name = String(new FormData(e.currentTarget).get("name")).trim();
          if (!name || count >= 40) {
            setError(
              count >= 40
                ? "Sınıfta en fazla 40 öğrenci olabilir."
                : "Öğrenci adını yazın.",
            );
            return;
          }
          onSave({
            id: crypto.randomUUID(),
            name,
            fish,
            xp: 0,
            feed: 5,
            completed: 0,
            photo,
          });
        }}
      >
        <div className="form-grid">
          <label>
            Ad soyad
            <input
              name="name"
              placeholder="Örn. Deniz Yılmaz"
              maxLength={70}
              required
              autoFocus
            />
          </label>
          <label>
            Profil fotoğrafı (isteğe bağlı)
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                if (
                  f.size > 800000 ||
                  !["image/jpeg", "image/png", "image/webp"].includes(f.type)
                ) {
                  setError(
                    "En fazla 800 KB boyutunda JPG, PNG veya WebP seçin.",
                  );
                  return;
                }
                setLoading(true);
                const reader = new FileReader();
                reader.onload = () => {
                  setPhoto(String(reader.result));
                  setError("");
                  setLoading(false);
                };
                reader.onerror = () => {
                  setError("Fotoğraf okunamadı.");
                  setLoading(false);
                };
                reader.readAsDataURL(f);
              }}
            />
          </label>
        </div>
        <h3>Deniz arkadaşını seç</h3>
        <div className="fish-picker">
          {species.map((name, i) => (
            <button
              type="button"
              key={name}
              aria-label={name}
              onClick={() => setFish(i)}
              className={fish === i ? "selected" : ""}
            >
              <Fish type={i} />
              <small>{name}</small>
            </button>
          ))}
        </div>
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
        <div className="form-actions">
          <button type="button" className="secondary" onClick={onClose}>
            Vazgeç
          </button>
          <button className="primary" disabled={loading || count >= 40}>
            Öğrenciyi ekle
          </button>
        </div>
      </form>
    </Modal>
  );
}
export function TaskForm({
  students,
  onClose,
  onSave,
}: {
  students: Student[];
  onClose: () => void;
  onSave: (t: Task) => void;
}) {
  const [all, setAll] = useState(true),
    [ids, setIds] = useState<string[]>([]),
    [error, setError] = useState("");
  return (
    <Modal title="Yeni bir öğrenme fırsatı" onClose={onClose} wide>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget),
            assigned = all ? students.map((s) => s.id) : ids,
            title = String(data.get("title")).trim();
          if (!assigned.length || !title) {
            setError("Görev başlığını yazın ve en az bir öğrenci seçin.");
            return;
          }
          onSave({
            id: crypto.randomUUID(),
            title,
            description: String(data.get("description")).trim(),
            type: String(data.get("type")),
            due: String(data.get("due")),
            xp: Number(data.get("xp")),
            feed: Number(data.get("feed")),
            assigned,
            done: [],
          });
        }}
      >
        <label>
          Görev başlığı
          <input
            name="title"
            placeholder="Bugün ne keşfediyoruz?"
            maxLength={120}
            required
            autoFocus
          />
        </label>
        <label>
          Açıklama
          <textarea
            name="description"
            placeholder="Öğrencileriniz için kısa bir yol tarifi…"
            maxLength={800}
          />
        </label>
        <div className="form-grid">
          <label>
            Görev türü
            <select name="type">
              {["Ödev", "Okuma", "Davranış", "Katılım", "Proje", "Diğer"].map(
                (t) => (
                  <option key={t}>{t}</option>
                ),
              )}
            </select>
          </label>
          <label>
            Son tarih
            <input
              name="due"
              type="date"
              defaultValue={new Date(Date.now() + 7 * 86400000)
                .toISOString()
                .slice(0, 10)}
              required
            />
          </label>
          <label>
            XP ödülü
            <input
              name="xp"
              type="number"
              min="1"
              max="1000"
              step="1"
              defaultValue="50"
              required
            />
          </label>
          <label>
            Yem ödülü
            <input
              name="feed"
              type="number"
              min="0"
              max="100"
              step="1"
              defaultValue="10"
              required
            />
          </label>
        </div>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={all}
            onChange={(e) => setAll(e.target.checked)}
          />
          Tüm sınıfa ata
        </label>
        {!all && (
          <div className="assignment-picker">
            {students.map((s) => (
              <label key={s.id}>
                <input
                  type="checkbox"
                  checked={ids.includes(s.id)}
                  onChange={(e) =>
                    setIds(
                      e.target.checked
                        ? [...ids, s.id]
                        : ids.filter((id) => id !== s.id),
                    )
                  }
                />
                {s.name}
              </label>
            ))}
          </div>
        )}
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
        <div className="form-actions">
          <button type="button" className="secondary" onClick={onClose}>
            Vazgeç
          </button>
          <button className="primary">Görevi oluştur</button>
        </div>
      </form>
    </Modal>
  );
}
