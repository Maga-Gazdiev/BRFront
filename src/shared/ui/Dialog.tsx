import { useEffect, useRef, type ReactNode } from 'react';
export function Dialog({
  title,
  onClose,
  children,
  className = '',
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const previous = document.activeElement as HTMLElement;
    el.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      el.close();
      document.body.style.overflow = old;
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`dialog ${className}`}
      aria-label={title}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="dialog-inner">
        <button className="icon-button dialog-close" aria-label="Закрыть" onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </dialog>
  );
}
