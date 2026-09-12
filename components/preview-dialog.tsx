"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";

export function PreviewDialog({
  title,
  onClose,
  children,
  className = "",
  eyebrow,
  collection,
  hideTitle = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  eyebrow?: string;
  hideTitle?: boolean;
  collection?: {
    index: number;
    total: number;
    onPrevious: () => void;
    onNext: () => void;
  };
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
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
      aria-labelledby={titleId}
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
          <h2 id={titleId} className={hideTitle ? "sr-only" : undefined}>
            {title}
          </h2>
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
      {collection && collection.total > 1 && (
        <footer className="preview-navigation" aria-label="Browse previews">
          <button type="button" onClick={collection.onPrevious}>
            <ArrowLeft size={18} aria-hidden="true" /> Previous
          </button>
          <span className="preview-count" role="status" aria-atomic="true">
            <span className="sr-only">{title}, item </span>
            <strong>{String(collection.index + 1).padStart(2, "0")}</strong>
            <span aria-hidden="true"> / </span>
            <span className="sr-only"> of </span>
            {String(collection.total).padStart(2, "0")}
          </span>
          <button type="button" onClick={collection.onNext}>
            Next <ArrowRight size={18} aria-hidden="true" />
          </button>
        </footer>
      )}
    </dialog>
  );
}
