import { useEffect, useRef } from "react";

export type Zoomed = { src: string; alt: string };

/** Full-size screenshot over everything. Click anywhere or press Esc to close. */
export function Lightbox({ image, onClose }: { image: Zoomed | null; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (image && !el.open) {
      el.showModal();
      el.focus();
    }
    if (!image && el.open) el.close();
  }, [image]);

  return (
    <dialog
      ref={dialog}
      className="lightbox"
      tabIndex={-1}
      aria-label={image?.alt ?? "Screenshot"}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={onClose}
    >
      {image ? <img src={image.src} alt={image.alt} decoding="async" /> : null}
      <button type="button" className="lightbox__close" aria-label="Close full size">
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>
    </dialog>
  );
}
