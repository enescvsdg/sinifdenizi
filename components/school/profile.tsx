"use client";
import { useState } from "react";
import { Award, Check, Pencil, Trash2 } from "lucide-react";
import Modal from "../modal";
import { FishPicker } from "../fish-catalog";
import { Fish } from "../sprites";
import { Avatar, Progress } from "./ui";
import { useSchool } from "./state";
import {
  assignStudentFish,
  earnedBadges,
  level,
  removeStudent,
  species,
  type Student,
} from "@/lib/model";

export function StudentProfile({
  student,
  role,
  onClose,
  onEdit,
}: {
  student: Student;
  role: "teacher" | "parent";
  onClose: () => void;
  onEdit: () => void;
}) {
  const { state, setState, notify, tasksDone, approve } = useSchool();
  const [removing, setRemoving] = useState(false);
  const done = tasksDone(student.id);
  function removeFromClass() {
    setState((s) => removeStudent(s, student.id));
    onClose();
    notify(`${student.name} sınıftan çıkarıldı.`);
  }
  return (
    <Modal title="Öğrencinin hikâyesi" onClose={onClose} wide>
      <div className="profile-hero">
        <Avatar student={student} large />
        <div>
          <span className="eyebrow">4-A SINIFI</span>
          <h2>{student.name}</h2>
          <p>
            Seviye {level(student.xp)} · {species[student.fish]}
          </p>
          <Progress value={(student.xp % 500) / 5} />
          <small>{student.xp % 500} / 500 XP</small>
        </div>
        <Fish type={student.fish} />
      </div>
      {role === "teacher" &&
        (removing ? (
          <div className="remove-confirm">
            <p>
              <strong>{student.name}</strong> sınıftan çıkarılsın mı? XP’si,
              yemi, görev ve etkinlik kayıtları silinir; yalnızca bu öğrenciye
              verilen görevler de kaldırılır. Bu işlem geri alınamaz.
            </p>
            <div>
              <button className="secondary" onClick={() => setRemoving(false)}>
                Vazgeç
              </button>
              <button className="danger-button" onClick={removeFromClass}>
                Evet, sınıftan çıkar
              </button>
            </div>
          </div>
        ) : (
          <div className="profile-actions">
            <button className="secondary" onClick={onEdit}>
              <Pencil size={15} />
              Bilgileri düzenle
            </button>
            <button className="danger-link" onClick={() => setRemoving(true)}>
              <Trash2 size={15} />
              Sınıftan çıkar
            </button>
          </div>
        ))}
      <div className="profile-metrics">
        <div>
          <strong>{student.xp}</strong>
          <span>Toplam XP</span>
        </div>
        <div>
          <strong>{student.feed}</strong>
          <span>Yem</span>
        </div>
        <div>
          <strong>{done}</strong>
          <span>Tamamlanan görev</span>
        </div>
      </div>
      <h3>Kazanılan rozetler</h3>
      <div className="earned-badges">
        {earnedBadges(done).map(({ name }) => (
          <span key={name}>
            <Award size={20} />
            {name}
          </span>
        ))}
        {done === 0 && <p>İlk görev, ilk rozetin başlangıcı.</p>}
      </div>
      <h3>Görev geçmişi</h3>
      {state.tasks
        .filter((t) => t.assigned.includes(student.id))
        .map((t) => (
          <div key={t.id} className="profile-task">
            <div>
              <strong>{t.title}</strong>
              <small>
                +{t.xp} XP · +{t.feed} yem
              </small>
            </div>
            {t.done.includes(student.id) ? (
              <span className="completed">
                <Check size={15} />
                Tamamlandı
              </span>
            ) : role === "teacher" ? (
              <button
                className="secondary"
                onClick={() => approve(t.id, student.id)}
              >
                Onayla
              </button>
            ) : (
              <span className="pending">Devam ediyor</span>
            )}
          </div>
        ))}
      {role === "teacher" && (
        <>
          <h3>Deniz arkadaşını seç</h3>
          <FishPicker
            selected={student.fish}
            xp={student.xp}
            compact
            onSelect={(fish) =>
              setState((s) => assignStudentFish(s, student.id, fish))
            }
          />
        </>
      )}
    </Modal>
  );
}
