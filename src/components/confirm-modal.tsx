"use client";

import { useEffect, useRef, useState } from "react";

interface ConfirmModalProps {
  slug: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({ slug, onConfirm, onCancel }: ConfirmModalProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const isMatch = value === slug;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === backdropRef.current) onCancel();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isMatch) onConfirm();
  }

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 p-4"
    >
      <div className="border border-border bg-bg w-full max-w-sm">
        <div className="border-b border-border px-4 py-3">
          <span className="text-sm font-bold">permanent delete</span>
        </div>
        <form onSubmit={handleSubmit} className="px-4 py-4 space-y-4">
          <p className="text-xs text-muted">
            type <span className="text-fg font-bold">{slug}</span> to confirm
          </p>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={slug}
            className="w-full bg-transparent border border-border px-3 py-2 text-sm outline-none focus:border-fg transition-colors"
          />
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="text-xs text-muted hover:text-fg border border-border px-3 py-1.5 transition-colors cursor-pointer"
            >
              [cancel]
            </button>
            <button
              type="submit"
              disabled={!isMatch}
              className="text-xs text-muted hover:text-fg border border-border px-3 py-1.5 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-default"
            >
              [purge]
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
