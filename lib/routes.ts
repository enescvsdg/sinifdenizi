export type RouteKey =
  | "aquarium"
  | "dashboard"
  | "students"
  | "tasks"
  | "decor"
  | "badges"
  | "reports"
  | "settings"
  | "parent";

/** Addresses without the deployment base path; each has a page under app/. */
export const paths: Record<RouteKey | "welcome", string> = {
  aquarium: "/",
  dashboard: "/ana-sayfa/",
  students: "/ogrenciler/",
  tasks: "/gorevler/",
  decor: "/dekorasyonlar/",
  badges: "/rozetler/",
  reports: "/raporlar/",
  settings: "/ayarlar/",
  parent: "/veli/",
  welcome: "/giris/",
};

export const titles: Record<RouteKey, string> = {
  aquarium: "Sınıf akvaryumu",
  dashboard: "Ana sayfa",
  students: "Öğrenciler",
  tasks: "Görevler",
  decor: "Dekorasyonlar",
  badges: "Rozetler",
  reports: "Raporlar",
  settings: "Ayarlar",
  parent: "Veli paneli",
};

const trim = (path: string) => path.replace(/\/+$/, "") || "/";

/** The classroom page shown at a pathname, with or without a trailing slash. */
export function routeFor(pathname: string): RouteKey {
  const path = trim(pathname);
  const match = (Object.keys(titles) as RouteKey[]).find(
    (key) => trim(paths[key]) === path,
  );
  return match ?? "aquarium";
}
