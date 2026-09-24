import { BookOpen, type LucideIcon } from "lucide-react";
import { Fish } from "../sprites";
import type { Student } from "@/lib/model";

function initials(name: string) {
  return name
    .split(" ")
    .map((x) => x[0])
    .slice(0, 2)
    .join("");
}
export function Avatar({
  student,
  large = false,
}: {
  student: Student;
  large?: boolean;
}) {
  return (
    <span
      className={`avatar ${large ? "large" : ""}`}
      style={{
        background: ["#daf2f1", "#ffe5d5", "#e6e2fc", "#dcf0ff"][
          student.fish % 4
        ],
      }}
    >
      {student.photo ? (
        <img src={student.photo} alt="" />
      ) : (
        initials(student.name)
      )}
    </span>
  );
}
export function Brand() {
  return (
    <div className="brand">
      <span className="brand-mark">
        <Fish type={0} />
        <BookOpen size={30} />
      </span>
      <div>
        Sınıf<span>Denizi</span>
        <small>Öğren. Kazan. Büyüt.</small>
      </div>
    </div>
  );
}
export function Progress({ value }: { value: number }) {
  return (
    <div className="progress">
      <i style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}
export function Metric({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
  color: string;
}) {
  return (
    <div className="card metric">
      <span className={`icon-tile ${color}`}>
        <Icon size={23} />
      </span>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
      <span className="metric-decoration" />
    </div>
  );
}
