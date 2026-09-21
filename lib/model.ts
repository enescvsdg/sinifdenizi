export const species = [
  "Palyaço balığı",
  "Mavi tang",
  "Sarı tang",
  "Kelebek balığı",
  "Aslan balığı",
  "Balon balığı",
  "Denizatı",
  "Manta vatoz",
  "Deniz kaplumbağası",
  "Köpekbalığı",
  "Ahtapot",
  "Denizanası",
];
export const decorNames = [
  "Deniz bitkileri",
  "Mavi kayalar",
  "Mercan bahçesi",
  "Hazine sandığı",
  "Batık gemi",
  "Taş kemer",
  "Deniz feneri",
  "Işıltılı denizanaları",
  "Sualtı kalesi",
];
export const decorThresholds = [0, 0, 500, 1200, 2000, 3000, 4200, 5600, 7200];
export type Student = {
  id: string;
  name: string;
  fish: number;
  xp: number;
  feed: number;
  completed: number;
  photo?: string;
};
export type Task = {
  id: string;
  title: string;
  description: string;
  type: string;
  due: string;
  xp: number;
  feed: number;
  assigned: string[];
  done: string[];
};
export type Activity = {
  id: string;
  text: string;
  kind: "task" | "student" | "feed";
  time: string;
};
export type SchoolState = {
  version: 2;
  students: Student[];
  tasks: Task[];
  decorations: number[];
  activities: Activity[];
  note: string;
};
export const level = (xp: number) => Math.floor(xp / 500) + 1;
export const classXp = (s: SchoolState) =>
  s.students.reduce((sum, x) => sum + x.xp, 0);
export function participation(s: SchoolState) {
  const assigned = s.tasks.reduce((n, t) => n + t.assigned.length, 0);
  return assigned
    ? Math.round(
        (s.tasks.reduce((n, t) => n + t.done.length, 0) / assigned) * 100,
      )
    : 0;
}
const names = [
  "Ali Demir",
  "Zeynep Yılmaz",
  "Eren Kaya",
  "Elif Yıldız",
  "Mert Arslan",
  "Defne Aydın",
  "Arda Şahin",
  "Duru Aksoy",
  "Bora Deniz",
  "Selin Çelik",
  "Can Eren",
  "Mira Koç",
  "Yağmur Güneş",
  "Kerem Yalçın",
  "Esra Polat",
  "Deniz Acar",
  "Ece Yüce",
  "Emir Tunç",
  "İpek Ekin",
  "Efe Uzun",
  "Ada Akın",
  "Ömer Sezer",
  "Nehir Can",
  "Kaan Demir",
];
export function initialState(): SchoolState {
  const students = names.map((name, i) => ({
    id: `student-${i}`,
    name,
    fish: i % 12,
    xp: 120 + ((i * 31) % 260),
    feed: 20 + ((i * 7) % 65),
    completed: 2 + (i % 8),
  }));
  return {
    version: 2,
    students,
    decorations: [0, 1, 2, 3, 4],
    note: "Bu hafta düzenli okuma alışkanlığını destekliyoruz. Her gün birlikte 15 dakika okumak, küçük ama çok değerli bir adım.",
    tasks: [
      {
        id: "task-1",
        title: "Her gün 15 dakika kitap okuyorum",
        description:
          "Sevdiğin bir kitabı seç. Okuduklarını sınıfta arkadaşlarınla paylaş.",
        type: "Okuma",
        due: "2026-09-25",
        xp: 50,
        feed: 10,
        assigned: students.map((x) => x.id),
        done: students.slice(0, 18).map((x) => x.id),
      },
      {
        id: "task-2",
        title: "Matematik keşif defteri",
        description: "Çalışma kitabındaki 12–14. sayfaları tamamla.",
        type: "Ödev",
        due: "2026-09-26",
        xp: 75,
        feed: 15,
        assigned: students.map((x) => x.id),
        done: students.slice(0, 13).map((x) => x.id),
      },
      {
        id: "task-3",
        title: "Bir arkadaşına yardım et",
        description: "Birlikte öğrenmenin güzelliğini keşfet.",
        type: "Davranış",
        due: "2026-09-27",
        xp: 30,
        feed: 5,
        assigned: students.map((x) => x.id),
        done: students.slice(0, 21).map((x) => x.id),
      },
    ],
    activities: [
      {
        id: "a1",
        text: "Zeynep okuma görevini tamamladı.",
        kind: "task" as const,
        time: "Az önce",
      },
      {
        id: "a2",
        text: "Sınıfımız batık geminin kilidini açtı.",
        kind: "student" as const,
        time: "Bugün",
      },
      {
        id: "a3",
        text: "Ali balığını besledi.",
        kind: "feed" as const,
        time: "Bugün",
      },
    ],
  };
}
export function approveTask(
  s: SchoolState,
  taskId: string,
  studentId: string,
): SchoolState {
  const t = s.tasks.find((x) => x.id === taskId),
    st = s.students.find((x) => x.id === studentId);
  if (
    !t ||
    !st ||
    !t.assigned.includes(studentId) ||
    t.done.includes(studentId)
  )
    return s;
  return {
    ...s,
    students: s.students.map((x) =>
      x.id === studentId
        ? {
            ...x,
            xp: x.xp + t.xp,
            feed: x.feed + t.feed,
            completed: x.completed + 1,
          }
        : x,
    ),
    tasks: s.tasks.map((x) =>
      x.id === taskId ? { ...x, done: [...x.done, studentId] } : x,
    ),
    activities: [
      {
        id: `${taskId}-${studentId}`,
        text: `${st.name.split(" ")[0]}, “${t.title}” görevini tamamladı.`,
        kind: "task" as const,
        time: "Az önce",
      },
      ...s.activities,
    ].slice(0, 20),
  };
}
export function feedStudents(s: SchoolState): SchoolState {
  if (!s.students.some((x) => x.feed > 0)) return s;
  return {
    ...s,
    students: s.students.map((x) => ({ ...x, feed: Math.max(0, x.feed - 1) })),
    activities: [
      {
        id: `feed-${Date.now()}`,
        text: "Yemi olan balıklar beslendi. Afiyet olsun!",
        kind: "feed" as const,
        time: "Az önce",
      },
      ...s.activities,
    ].slice(0, 20),
  };
}
export function validState(value: unknown): value is SchoolState {
  if (!value || typeof value !== "object") return false;
  const s = value as SchoolState;
  return (
    s.version === 2 &&
    Array.isArray(s.students) &&
    s.students.length <= 40 &&
    s.students.every(
      (x) =>
        typeof x.id === "string" &&
        typeof x.name === "string" &&
        Number.isInteger(x.fish) &&
        x.fish >= 0 &&
        x.fish < 12 &&
        Number.isFinite(x.xp) &&
        x.xp >= 0 &&
        Number.isFinite(x.feed) &&
        x.feed >= 0 &&
        Number.isFinite(x.completed),
    ) &&
    Array.isArray(s.tasks) &&
    s.tasks.every(
      (t) =>
        typeof t.id === "string" &&
        typeof t.title === "string" &&
        Number.isFinite(t.xp) &&
        t.xp >= 0 &&
        Number.isFinite(t.feed) &&
        t.feed >= 0 &&
        Array.isArray(t.assigned) &&
        Array.isArray(t.done),
    ) &&
    Array.isArray(s.decorations) &&
    s.decorations.every((x) => Number.isInteger(x) && x >= 0 && x < 9) &&
    Array.isArray(s.activities) &&
    typeof s.note === "string"
  );
}
