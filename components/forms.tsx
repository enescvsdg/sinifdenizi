"use client";
import { useRef, useState } from "react";
import Modal from "./modal";
import { FishPicker } from "./fish-catalog";
import { canChooseSpecies } from "@/lib/species";
import { createId } from "@/lib/ids";
import { maxPhotoBytes, photoTypes, shrinkPhoto } from "@/lib/photo";
import { localDay } from "@/lib/time";
import { type Student, type Task } from "@/lib/model";
export function StudentForm({
  onClose,
  onSave,
  count,
  student,
}: {
  onClose: () => void;
  onSave: (s: Student) => void;
  count: number;
  /** Edit this student's name and photo instead of adding a new student. */
  student?: Student;
}) {
  const [fish, setFish] = useState(0),
    [photo, setPhoto] = useState(student?.photo),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null),
    photoJob = useRef(0);
  const full = !student && count >= 40;
  async function choosePhoto(input: HTMLInputElement) {
    const f = input.files?.[0];
    if (!f) return;
    // A slower earlier choice must not replace a newer one.
    const job = ++photoJob.current;
    if (f.size > maxPhotoBytes || !photoTypes.includes(f.type)) {
      input.value = "";
      setError("En fazla 10 MB boyutunda JPG, PNG veya WebP seçin.");
      return;
    }
    setLoading(true);
    try {
      const small = await shrinkPhoto(f);
      if (job !== photoJob.current) return;
      setPhoto(small);
      setError("");
    } catch {
      if (job !== photoJob.current) return;
      input.value = "";
      setError("Fotoğraf okunamadı.");
    } finally {
      if (job === photoJob.current) setLoading(false);
    }
  }
  return (
    <Modal
      title={
        student ? "Öğrenci bilgilerini düzenle" : "Yeni bir deniz arkadaşı"
      }
      onClose={onClose}
      wide
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const name = String(new FormData(e.currentTarget).get("name")).trim();
          if (!name || full) {
            setError(
              full
                ? "Sınıfta en fazla 40 öğrenci olabilir."
                : "Öğrenci adını yazın.",
            );
            return;
          }
          if (student) {
            onSave({ ...student, name, photo });
            return;
          }
          if (!canChooseSpecies(fish, 0)) {
            setError(
              "Başlangıç için hazır ve kilidi açık bir deniz arkadaşı seçin.",
            );
            return;
          }
          onSave({
            id: createId(),
            name,
            fish,
            xp: 0,
            feed: 5,
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
              defaultValue={student?.name}
              maxLength={70}
              required
              autoFocus
            />
          </label>
          <div>
            <label>
              Profil fotoğrafı (isteğe bağlı)
              <input
                ref={fileInput}
                type="file"
                accept={photoTypes.join(",")}
                onChange={(e) => choosePhoto(e.currentTarget)}
              />
            </label>
            {photo && (
              <div className="photo-preview">
                <img src={photo} alt="Seçilen profil fotoğrafı" />
                <button
                  type="button"
                  className="text-button"
                  onClick={() => {
                    photoJob.current++;
                    setPhoto(undefined);
                    setLoading(false);
                    if (fileInput.current) fileInput.current.value = "";
                  }}
                >
                  Fotoğrafı kaldır
                </button>
              </div>
            )}
          </div>
        </div>
        {!student && (
          <>
            <h3>Deniz arkadaşını seç</h3>
            <FishPicker selected={fish} xp={0} onSelect={setFish} compact />
          </>
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
          <button className="primary" disabled={loading || full}>
            {student ? "Değişiklikleri kaydet" : "Öğrenciyi ekle"}
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
  task,
}: {
  students: Student[];
  onClose: () => void;
  onSave: (t: Task) => void;
  /** Edit this task instead of creating a new one. */
  task?: Task;
}) {
  const everyone = (ids: string[]) => students.every((s) => ids.includes(s.id));
  const [all, setAll] = useState(!task || everyone(task.assigned)),
    [ids, setIds] = useState<string[]>(task?.assigned ?? []),
    [error, setError] = useState("");
  const done = task?.done ?? [];
  return (
    <Modal
      title={task ? "Görevi düzenle" : "Yeni bir öğrenme fırsatı"}
      onClose={onClose}
      wide
    >
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
          const fields = {
            title,
            description: String(data.get("description")).trim(),
            type: String(data.get("type")),
            due: String(data.get("due")),
            xp: Number(data.get("xp")),
            feed: Number(data.get("feed")),
            assigned,
          };
          onSave(
            task
              ? { ...task, ...fields }
              : {
                  id: createId(),
                  ...fields,
                  done: [],
                  createdAt: new Date().toISOString(),
                },
          );
        }}
      >
        <label>
          Görev başlığı
          <input
            name="title"
            placeholder="Bugün ne keşfediyoruz?"
            defaultValue={task?.title}
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
            defaultValue={task?.description}
            maxLength={800}
          />
        </label>
        <div className="form-grid">
          <label>
            Görev türü
            <select name="type" defaultValue={task?.type}>
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
              defaultValue={
                task?.due ?? localDay(new Date(Date.now() + 7 * 86400000))
              }
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
              defaultValue={task?.xp ?? 50}
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
              defaultValue={task?.feed ?? 10}
              required
            />
          </label>
        </div>
        {task && done.length > 0 && (
          <p className="form-note">
            Ödül değişikliği yalnızca bundan sonraki onaylara uygulanır. Görevi
            tamamlayan öğrenciler görevden çıkarılamaz.
          </p>
        )}
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
                  checked={ids.includes(s.id) || done.includes(s.id)}
                  disabled={done.includes(s.id)}
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
          <button className="primary">
            {task ? "Değişiklikleri kaydet" : "Görevi oluştur"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
