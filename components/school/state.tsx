"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { Check, CircleAlert, X } from "lucide-react";
import Modal from "../modal";
import { StudentForm, TaskForm } from "../forms";
import { Activities } from "./widgets";
import { StudentProfile } from "./profile";
import {
  initialState,
  approveTask,
  undoApproval,
  updateTask,
  removeTask,
  feedStudents,
  classProgress,
  participation,
  completedCounts,
  updateStudent,
  decorThresholds,
  type SchoolState,
} from "@/lib/model";
import { browserStorage, loadState, saveState } from "@/lib/storage";
import { paths, routeFor } from "@/lib/routes";

type Toast = { text: string; tone: "success" | "error" };
export type ModalKind = "student" | "task" | "notice";
type School = {
  state: SchoolState;
  setState: Dispatch<SetStateAction<SchoolState>>;
  notify: (text: string, tone?: Toast["tone"]) => void;
  /** Class level and decorations, from the average XP per student. */
  progress: ReturnType<typeof classProgress>;
  /** Unlocked decorations the teacher placed in the aquarium. */
  shownDecor: number[];
  completion: number;
  feed: number;
  activeTasks: number;
  tasksDone: (studentId: string) => number;
  /** Increases on every feeding so the aquarium can drop food. */
  feeding: number;
  approve: (taskId: string, studentId: string) => void;
  undo: (taskId: string, studentId: string) => void;
  editTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  feedAll: () => void;
  toggleDecor: (index: number) => void;
  openProfile: (studentId: string) => void;
  openModal: (kind: ModalKind) => void;
};
const SchoolContext = createContext<School | null>(null);

export function useSchool() {
  const school = useContext(SchoolContext);
  if (!school) throw new Error("useSchool needs a SchoolProvider");
  return school;
}

/** Classroom state, saved in this browser, shared by every classroom page. */
export function SchoolProvider({ children }: { children: ReactNode }) {
  const router = useRouter(),
    pathname = usePathname();
  const role = routeFor(pathname) === "parent" ? "parent" : "teacher";
  const [state, setState] = useState<SchoolState>(initialState),
    [ready, setReady] = useState(false),
    [modal, setModal] = useState<ModalKind | "edit-student" | null>(null),
    [selected, setSelected] = useState<string | null>(null),
    [editing, setEditing] = useState<string | null>(null),
    [toast, setToast] = useState<Toast | null>(null),
    [feeding, setFeeding] = useState(0);
  // `saved` mirrors what is in storage; `persist` is off when saving would
  // be impossible or would destroy a record this version cannot read.
  const saved = useRef<SchoolState | null>(null),
    persist = useRef(true);
  function notify(text: string, tone: Toast["tone"] = "success") {
    setToast({ text, tone });
  }
  useEffect(() => {
    const result = loadState(browserStorage());
    if (result.status === "loaded") {
      saved.current = result.state;
      setState(result.state);
    } else if (result.status === "backedUp") {
      notify(
        `Kayıtlı sınıf bu sürümde açılamadı. Eski kayıt “${result.backupKey}” adıyla yedeklendi, örnek sınıf açıldı.`,
        "error",
      );
    } else if (result.status === "unreadable") {
      persist.current = false;
      notify(
        "Kayıtlı sınıf açılamadı ve yedeklenemedi. Üzerine yazılmaması için bu oturumdaki değişiklikler kaydedilmeyecek.",
        "error",
      );
    } else if (result.status === "unavailable") {
      persist.current = false;
      notify(
        "Bu tarayıcıda kayıt alanına erişilemiyor. Değişiklikler yalnızca bu oturumda kalır.",
        "error",
      );
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready || !persist.current) return;
    const store = browserStorage();
    if (store && saveState(store, state)) {
      saved.current = state;
      return;
    }
    // Undo what could not be saved, so a reload never loses work silently.
    const last = saved.current;
    if (last && last !== state) {
      setState(last);
      notify(
        "Değişiklik kaydedilemedi ve geri alındı. Tarayıcı depolama alanı dolu olabilir.",
        "error",
      );
    } else {
      notify(
        "Değişiklik kaydedilemedi. Tarayıcı depolama alanı dolu olabilir.",
        "error",
      );
    }
  }, [state, ready]);
  // A profile belongs to the page it was opened on.
  useEffect(() => setSelected(null), [pathname]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(
      () => setToast(null),
      toast.tone === "error" ? 8000 : 4200,
    );
    return () => clearTimeout(t);
  }, [toast]);

  const progress = classProgress(state),
    feed = state.students.reduce((n, x) => n + x.feed, 0),
    completed = completedCounts(state);
  const current = state.students.find((x) => x.id === selected),
    editingTask = state.tasks.find((x) => x.id === editing);
  const school: School = {
    state,
    setState,
    notify,
    progress,
    shownDecor: state.decorations.filter(
      (i) => decorThresholds[i] <= progress.average,
    ),
    completion: participation(state),
    feed,
    activeTasks: state.tasks.filter((t) => t.done.length < t.assigned.length)
      .length,
    tasksDone: (id) => completed.get(id) ?? 0,
    feeding,
    approve(taskId, studentId) {
      setState((s) => approveTask(s, taskId, studentId));
      notify("Görev onaylandı. XP ve yem öğrencinin hesabına eklendi.");
    },
    undo(taskId, studentId) {
      setState((s) => undoApproval(s, taskId, studentId));
      notify("Onay geri alındı. Verilen XP ve yem geri çekildi.");
    },
    editTask: setEditing,
    deleteTask(taskId) {
      setState((s) => removeTask(s, taskId));
      notify("Görev silindi.");
    },
    feedAll() {
      if (feed === 0) {
        notify(
          "Yemler bitti. Görevleri tamamlayarak yeni yem kazanabilirsiniz.",
          "error",
        );
        return;
      }
      setState(feedStudents);
      setFeeding((x) => x + 1);
      notify("Her balığın mevcut yeminden 1 yem kullanıldı. Afiyet olsun!");
    },
    toggleDecor(i) {
      if (decorThresholds[i] > progress.average) return;
      setState((s) => ({
        ...s,
        decorations: s.decorations.includes(i)
          ? s.decorations.filter((x) => x !== i)
          : [...s.decorations, i],
      }));
    },
    openProfile: setSelected,
    openModal: setModal,
  };

  return (
    <SchoolContext value={school}>
      {children}
      {modal === "notice" && (
        <Modal title="Denizden haberler" onClose={() => setModal(null)}>
          <Activities />
          <p className="muted">
            Yeni görev onayları ve beslemeler burada görünür.
          </p>
        </Modal>
      )}
      {modal === "student" && (
        <StudentForm
          onClose={() => setModal(null)}
          count={state.students.length}
          onSave={(s) => {
            setState((old) => ({
              ...old,
              students: [...old.students, s],
              activities: [
                {
                  id: `new-${s.id}`,
                  text: `${s.name}, sınıf denizimize katıldı.`,
                  kind: "student" as const,
                  at: new Date().toISOString(),
                  studentId: s.id,
                },
                ...old.activities,
              ].slice(0, 20),
            }));
            setModal(null);
            notify("Yeni deniz arkadaşımız sınıfa katıldı.");
          }}
        />
      )}
      {modal === "task" && (
        <TaskForm
          students={state.students}
          onClose={() => setModal(null)}
          onSave={(task) => {
            setState((old) => ({ ...old, tasks: [task, ...old.tasks] }));
            setModal(null);
            router.push(paths.tasks);
            notify("Yeni görev öğrencilere atandı.");
          }}
        />
      )}
      {editingTask && (
        <TaskForm
          task={editingTask}
          students={state.students}
          onClose={() => setEditing(null)}
          onSave={(task) => {
            setState((old) => updateTask(old, task.id, task));
            setEditing(null);
            notify("Görev güncellendi.");
          }}
        />
      )}
      {current && (
        <StudentProfile
          key={current.id}
          student={current}
          role={role}
          onClose={() => setSelected(null)}
          onEdit={() => setModal("edit-student")}
        />
      )}
      {modal === "edit-student" && current && (
        <StudentForm
          student={current}
          count={state.students.length}
          onClose={() => setModal(null)}
          onSave={(s) => {
            setState((old) =>
              updateStudent(old, s.id, { name: s.name, photo: s.photo }),
            );
            setModal(null);
            notify("Öğrenci bilgileri güncellendi.");
          }}
        />
      )}
      {toast && (
        <div
          className={`toast ${toast.tone === "error" ? "toast-error" : ""}`}
          role={toast.tone === "error" ? "alert" : "status"}
        >
          {toast.tone === "error" ? (
            <CircleAlert size={18} />
          ) : (
            <Check size={18} />
          )}
          {toast.text}
          <button aria-label="Bildirimi kapat" onClick={() => setToast(null)}>
            <X size={16} />
          </button>
        </div>
      )}
    </SchoolContext>
  );
}
