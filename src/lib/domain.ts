export const fishTypes = [
  'clown',
  'blue-tang',
  'yellow-tang',
  'butterfly',
  'lionfish',
  'puffer',
  'seahorse',
  'manta',
  'turtle',
  'shark',
  'octopus',
  'jellyfish',
] as const;
export type FishType = (typeof fishTypes)[number];
export const fishNames: Record<FishType, string> = {
  clown: 'Palyaço balığı',
  'blue-tang': 'Mavi tang',
  'yellow-tang': 'Sarı tang',
  butterfly: 'Kelebek balığı',
  lionfish: 'Aslan balığı',
  puffer: 'Balon balığı',
  seahorse: 'Denizatı',
  manta: 'Manta vatoz',
  turtle: 'Deniz kaplumbağası',
  shark: 'Köpekbalığı',
  octopus: 'Ahtapot',
  jellyfish: 'Denizanası',
};
export const taskTypes = ['ödev', 'okuma', 'davranış', 'katılım', 'proje', 'diğer'] as const;
export type Student = {
  id: string;
  class_id: string;
  name: string;
  student_number: string | null;
  photo_path: string | null;
  photo_url?: string;
  fish_type: FishType;
  xp: number;
  feed: number;
  level: number;
  created_at: string;
};
export type Classroom = {
  id: string;
  teacher_id: string;
  name: string;
  grade: string;
  class_xp: number;
  decor_level: number;
  show_names: boolean;
};
export type Task = {
  id: string;
  class_id: string;
  title: string;
  description: string;
  type: string;
  xp_reward: number;
  feed_reward: number;
  due_date: string | null;
};
export type Assignment = {
  id: string;
  task_id: string;
  student_id: string;
  status: 'pending' | 'completed' | 'approved';
  approved_at: string | null;
  completed_at: string | null;
};
export type Announcement = {
  id: string;
  class_id: string;
  title: string;
  body: string;
  visible_to_parents: boolean;
  created_at: string;
};
export type Badge = { student_id: string; badge_id: string; earned_at: string };
export type PortalData = {
  classes: Classroom[];
  students: Student[];
  tasks: Task[];
  assignments: Assignment[];
  announcements: Announcement[];
  badges: Badge[];
};
export const unlocks = [
  { xp: 0, name: 'Deniz çayırları' },
  { xp: 300, name: 'Mercan bahçesi' },
  { xp: 750, name: 'Hazine sandığı' },
  { xp: 1500, name: 'Batık gemi' },
  { xp: 2500, name: 'Taş kemer' },
  { xp: 4000, name: 'Deniz feneri' },
  { xp: 6000, name: 'Işıklı denizanaları' },
  { xp: 9000, name: 'Deniz kalesi' },
];
export function levelForXp(xp: number) {
  return 1 + Math.floor(Math.max(0, xp) / 100);
}
export function decorForXp(xp: number) {
  return unlocks.filter((u) => xp >= u.xp).length - 1;
}
export function summarize(data: Pick<PortalData, 'students' | 'assignments'>) {
  const approved = data.assignments.filter((a) => a.status === 'approved');
  return {
    completed: approved.length,
    pending: data.assignments.length - approved.length,
    completion: data.assignments.length
      ? Math.round((approved.length / data.assignments.length) * 100)
      : 0,
    participation: data.students.length
      ? Math.round((new Set(approved.map((a) => a.student_id)).size / data.students.length) * 100)
      : 0,
    feed: data.students.reduce((sum, s) => sum + s.feed, 0),
  };
}
export function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');
}
