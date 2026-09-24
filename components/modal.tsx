"use client";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
export default function Modal({
  title,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const d = ref.current;
    d?.showModal();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
      d?.close();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className={`modal ${wide ? "wide" : ""}`}
      aria-labelledby={titleId}
    >
      <header>
        <div>
          <span className="eyebrow">SINIFDENİZİ</span>
          <h2 id={titleId}>{title}</h2>
        </div>
        <button className="icon-button" onClick={onClose} aria-label="Kapat">
          <X />
        </button>
      </header>
      {children}
    </dialog>
  );
}
