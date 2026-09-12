"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

export function PreviewDialog({
  title,
  onClose,
  children,
  className = "",
  eyebrow,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  eyebrow?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    const trigger = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
      trigger?.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className={`preview-dialog ${className}`}
      aria-labelledby="preview-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        )
          onClose();
      }}
    >
      <header className="preview-header">
        <div>
          {eyebrow && <p className="preview-eyebrow">{eyebrow}</p>}
          <h2 id="preview-title">{title}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          autoFocus
        >
          <X size={22} />
        </button>
      </header>
      <div className="preview-body">{children}</div>
    </dialog>
  );
}
