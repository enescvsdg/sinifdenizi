import { canChooseSpecies, speciesDefinitions } from "./species.ts";
export { species } from "./species.ts";
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
/**
 * Average XP per student that unlocks each decoration (decorNames order).
 * An average does not grow with class size, so a class of 15 and a class of
 * 40 progress at the same pace.
 */
export const decorThresholds = [0, 0, 20, 50, 85, 125, 175, 235, 300];
export const badges = [
  { name: "İlk adım", tasks: 1 },
  { name: "Deniz kaşifi", tasks: 5 },
  { name: "Görev ustası", tasks: 10 },
  { name: "Derin deniz uzmanı", tasks: 20 },
  { name: "Sınıf yıldızı", tasks: 35 },
  { name: "Okyanus efsanesi", tasks: 50 },
] as const;
export type Student = {
  id: string;
  name: string;
  fish: number;
  xp: number;
  feed: number;
  /** A small data URL (see lib/photo.ts); never a remote address. */
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
  /**
   * When each student's completion was approved and what it paid, so an
   * approval can be undone exactly. Approvals saved before this was
   * recorded have no entry.
   */
  approvals?: Record<string, Approval>;
  createdAt?: string;
};
export type Approval = { at: string; xp: number; feed: number };
export type Activity = {
  id: string;
  text: string;
  kind: "task" | "student" | "feed";
  /** ISO timestamp; older saves only have the `time` text. */
  at?: string;
  time?: string;
  /** The student the text names, so it goes when the student is removed. */
  studentId?: string;
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
export const averageXp = (s: SchoolState) =>
  s.students.length ? classXp(s) / s.students.length : 0;
/**
 * The class's shared progress: its level is the aquarium stage (the two
 * starting decorations are level 1), and `fraction` is the way to the next
 * decoration.
 */
export function classProgress(s: SchoolState) {
  const average = averageXp(s);
  const unlocked = decorThresholds.filter((x) => x <= average).length;
  const next = unlocked < decorThresholds.length ? unlocked : -1;
  const from = decorThresholds[unlocked - 1];
  return {
    average,
    unlocked,
    level: unlocked - 1,
    /** Index of the next decoration, or -1 once all are open. */
    next,
    remaining: next < 0 ? 0 : decorThresholds[next] - average,
    fraction: next < 0 ? 1 : (average - from) / (decorThresholds[next] - from),
  };
}
export function participation(s: SchoolState) {
  const assigned = s.tasks.reduce((n, t) => n + t.assigned.length, 0);
  return assigned
    ? Math.round(
        (s.tasks.reduce((n, t) => n + t.done.length, 0) / assigned) * 100,
      )
    : 0;
}
/** Completed tasks per student, counted from the task records themselves. */
export function completedCounts(s: SchoolState) {
  const counts = new Map<string, number>();
  for (const task of s.tasks)
    for (const id of task.done) counts.set(id, (counts.get(id) ?? 0) + 1);
  return counts;
}
export const earnedBadges = (completed: number) =>
  badges.filter((badge) => completed >= badge.tasks);
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
  const starterSpecies = speciesDefinitions.filter((fish) =>
    canChooseSpecies(fish.id, 0),
  );
  const ids = names.map((_, i) => `student-${i}`);
  const group = (member: (i: number) => boolean) =>
    ids.filter((_, i) => member(i));
  const everyone = () => group(() => true);
  const tasks: Task[] = [
    {
      id: "task-1",
      title: "Her gün 15 dakika kitap okuyorum",
      description:
        "Sevdiğin bir kitabı seç. Okuduklarını sınıfta arkadaşlarınla paylaş.",
      type: "Okuma",
      due: "2026-09-25",
      xp: 50,
      feed: 10,
      assigned: everyone(),
      done: ids.slice(0, 18),
    },
    {
      id: "task-2",
      title: "Matematik keşif defteri",
      description: "Çalışma kitabındaki 12–14. sayfaları tamamla.",
      type: "Ödev",
      due: "2026-09-26",
      xp: 75,
      feed: 15,
      assigned: everyone(),
      done: ids.slice(0, 13),
    },
    {
      id: "task-3",
      title: "Bir arkadaşına yardım et",
      description: "Birlikte öğrenmenin güzelliğini keşfet.",
      type: "Davranış",
      due: "2026-09-27",
      xp: 30,
      feed: 5,
      assigned: everyone(),
      done: ids.slice(0, 21),
    },
    // Earlier tasks, finished by everyone they were given to.
    {
      id: "task-4",
      title: "Deniz canlıları poster sunumu",
      description: "Grubunla seçtiğin bir deniz canlısını posterle tanıt.",
      type: "Proje",
      due: "2026-09-19",
      xp: 80,
      feed: 15,
      assigned: group((i) => i % 2 === 0),
      done: group((i) => i % 2 === 0),
    },
    {
      id: "task-5",
      title: "Kütüphane köşesine yardım",
      description: "Sınıf kitaplığındaki kitapları türlerine göre düzenle.",
      type: "Davranış",
      due: "2026-09-17",
      xp: 30,
      feed: 5,
      assigned: group((i) => i % 3 === 0),
      done: group((i) => i % 3 === 0),
    },
    {
      id: "task-6",
      title: "İlk hikâye kitabım",
      description: "Okuduğun hikâyenin en sevdiğin bölümünü anlat.",
      type: "Okuma",
      due: "2026-09-16",
      xp: 50,
      feed: 10,
      assigned: group((i) => i % 4 !== 0),
      done: group((i) => i % 4 !== 0),
    },
    {
      id: "task-7",
      title: "Toplama ve çıkarma alıştırmaları",
      description: "Çalışma kitabındaki 8–10. sayfaları tamamla.",
      type: "Ödev",
      due: "2026-09-15",
      xp: 60,
      feed: 12,
      assigned: everyone(),
      done: everyone(),
    },
    {
      id: "task-8",
      title: "Sınıf kurallarımızı birlikte yazalım",
      description: "Sınıfımız için bir kural öner ve panoya ekle.",
      type: "Katılım",
      due: "2026-09-11",
      xp: 40,
      feed: 8,
      assigned: everyone(),
      done: everyone(),
    },
  ];
  // Sample approvals: current tasks this week, earlier ones on their due day.
  const approvedOn: Record<string, string> = {
    "task-1": "2026-09-21",
    "task-2": "2026-09-22",
    "task-3": "2026-09-23",
  };
  for (const task of tasks)
    task.approvals = Object.fromEntries(
      task.done.map((id) => [
        id,
        {
          at: `${approvedOn[task.id] ?? task.due}T15:00:00`,
          xp: task.xp,
          feed: task.feed,
        },
      ]),
    );
  const students = names.map((name, i) => ({
    id: ids[i],
    name,
    fish: starterSpecies[i % starterSpecies.length].id,
    // Sample XP is exactly what each student's completed tasks paid out.
    xp: tasks
      .filter((task) => task.done.includes(ids[i]))
      .reduce((sum, task) => sum + task.xp, 0),
    feed: 20 + ((i * 7) % 65),
  }));
  return {
    version: 2,
    students,
    decorations: [0, 1, 2, 3, 4],
    note: "Bu hafta düzenli okuma alışkanlığını destekliyoruz. Her gün birlikte 15 dakika okumak, küçük ama çok değerli bir adım.",
    tasks,
    activities: [
      {
        id: "a1",
        text: "Zeynep okuma görevini tamamladı.",
        kind: "task" as const,
        at: "2026-09-23T10:40:00",
        studentId: "student-1",
      },
      {
        id: "a2",
        text: "Sınıfımız batık geminin kilidini açtı.",
        kind: "student" as const,
        at: "2026-09-22T15:00:00",
      },
      {
        id: "a3",
        text: "Ali balığını besledi.",
        kind: "feed" as const,
        at: "2026-09-22T12:00:00",
        studentId: "student-0",
      },
    ],
  };
}
export function approveTask(
  s: SchoolState,
  taskId: string,
  studentId: string,
  now = new Date(),
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
          }
        : x,
    ),
    tasks: s.tasks.map((x) =>
      x.id === taskId
        ? {
            ...x,
            done: [...x.done, studentId],
            approvals: {
              ...x.approvals,
              [studentId]: { at: now.toISOString(), xp: x.xp, feed: x.feed },
            },
          }
        : x,
    ),
    activities: [
      {
        id: `${taskId}-${studentId}`,
        text: `${st.name.split(" ")[0]}, “${t.title}” görevini tamamladı.`,
        kind: "task" as const,
        at: now.toISOString(),
        studentId,
      },
      ...s.activities,
    ].slice(0, 20),
  };
}
export function feedStudents(s: SchoolState, now = new Date()): SchoolState {
  if (!s.students.some((x) => x.feed > 0)) return s;
  return {
    ...s,
    students: s.students.map((x) => ({ ...x, feed: Math.max(0, x.feed - 1) })),
    activities: [
      {
        id: `feed-${now.getTime()}`,
        text: "Yemi olan balıklar beslendi. Afiyet olsun!",
        kind: "feed" as const,
        at: now.toISOString(),
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
        x.fish < speciesDefinitions.length &&
        Number.isFinite(x.xp) &&
        x.xp >= 0 &&
        Number.isFinite(x.feed) &&
        x.feed >= 0 &&
        (x.photo === undefined ||
          (typeof x.photo === "string" && x.photo.startsWith("data:image/"))),
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
        Array.isArray(t.done) &&
        (t.approvals === undefined ||
          (typeof t.approvals === "object" && t.approvals !== null)),
    ) &&
    Array.isArray(s.decorations) &&
    s.decorations.every((x) => Number.isInteger(x) && x >= 0 && x < 9) &&
    Array.isArray(s.activities) &&
    typeof s.note === "string"
  );
}

export function assignStudentFish(
  s: SchoolState,
  studentId: string,
  fish: number,
): SchoolState {
  const student = s.students.find((entry) => entry.id === studentId);
  if (!student || student.fish === fish || !canChooseSpecies(fish, student.xp))
    return s;
  return {
    ...s,
    students: s.students.map((entry) =>
      entry.id === studentId ? { ...entry, fish } : entry,
    ),
  };
}

/** Renames a student and replaces or removes the photo; a blank name is ignored. */
export function updateStudent(
  s: SchoolState,
  studentId: string,
  changes: { name: string; photo?: string },
): SchoolState {
  const name = changes.name.trim();
  if (!name || !s.students.some((entry) => entry.id === studentId)) return s;
  return {
    ...s,
    students: s.students.map((entry) => {
      if (entry.id !== studentId) return entry;
      const { photo: _previous, ...rest } = entry;
      return changes.photo
        ? { ...rest, name, photo: changes.photo }
        : { ...rest, name };
    }),
  };
}

/**
 * Removes a student with their task records and the activities that name
 * them; a task given only to them goes too.
 */
export function removeStudent(s: SchoolState, studentId: string): SchoolState {
  if (!s.students.some((entry) => entry.id === studentId)) return s;
  const keep = (id: string) => id !== studentId;
  return {
    ...s,
    students: s.students.filter((entry) => keep(entry.id)),
    tasks: s.tasks
      .filter((task) => !task.assigned.length || task.assigned.some(keep))
      .map((task) => ({
        ...task,
        assigned: task.assigned.filter(keep),
        done: task.done.filter(keep),
      })),
    activities: s.activities.filter((entry) => entry.studentId !== studentId),
  };
}

/** Takes back an approval and exactly what it paid (never below zero). */
export function undoApproval(
  s: SchoolState,
  taskId: string,
  studentId: string,
): SchoolState {
  const t = s.tasks.find((x) => x.id === taskId);
  if (!t || !t.done.includes(studentId)) return s;
  const paid = t.approvals?.[studentId] ?? { xp: t.xp, feed: t.feed };
  const { [studentId]: _undone, ...approvals } = t.approvals ?? {};
  return {
    ...s,
    students: s.students.map((x) =>
      x.id === studentId
        ? {
            ...x,
            xp: Math.max(0, x.xp - paid.xp),
            feed: Math.max(0, x.feed - paid.feed),
          }
        : x,
    ),
    tasks: s.tasks.map((x) =>
      x.id === taskId
        ? { ...x, done: x.done.filter((id) => id !== studentId), approvals }
        : x,
    ),
    activities: s.activities.filter((a) => a.id !== `${taskId}-${studentId}`),
  };
}

export type TaskChanges = Pick<
  Task,
  "title" | "description" | "type" | "due" | "xp" | "feed" | "assigned"
>;

/**
 * Edits a task. Students who already completed it stay assigned, and new
 * rewards apply to later approvals only.
 */
export function updateTask(
  s: SchoolState,
  taskId: string,
  changes: TaskChanges,
): SchoolState {
  const t = s.tasks.find((x) => x.id === taskId),
    title = changes.title.trim();
  if (!t || !title) return s;
  const { description, type, due, xp, feed } = changes;
  const assigned = [...new Set([...changes.assigned, ...t.done])];
  return {
    ...s,
    tasks: s.tasks.map((x) =>
      x.id === taskId
        ? { ...x, title, description, type, due, xp, feed, assigned }
        : x,
    ),
  };
}

/** Deletes a task and takes back what its approvals paid. */
export function removeTask(s: SchoolState, taskId: string): SchoolState {
  const t = s.tasks.find((x) => x.id === taskId);
  if (!t) return s;
  const undone = t.done.reduce(
    (state, id) => undoApproval(state, taskId, id),
    s,
  );
  return { ...undone, tasks: undone.tasks.filter((x) => x.id !== taskId) };
}
