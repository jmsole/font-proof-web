import type { Attachment } from "svelte/attachments";

/**
 * Drag a container's children (those with data-key) left/right to reorder them.
 * `onMove(key, index)` is called live while dragging, with the index the item
 * should take among the other items; `onEnd` runs after the drop.
 */
export function reorder(onMove: (key: string, index: number) => void, onEnd?: () => void): Attachment<HTMLElement> {
  return (container) => {
    let dragged: HTMLElement | null = null;

    const itemOf = (target: EventTarget | null) => {
      let el = target as HTMLElement | null;
      while (el && el.parentElement !== container) el = el.parentElement;
      return el?.dataset.key ? el : null;
    };

    const start = (event: DragEvent) => {
      dragged = itemOf(event.target);
      if (!dragged || !event.dataTransfer) return;
      dragged.classList.add("dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", "");
    };

    const over = (event: DragEvent) => {
      if (!dragged) return; // a file drag, handled elsewhere
      event.preventDefault();
      const target = itemOf(event.target);
      if (!target || target === dragged) return;
      const others = [...container.children].filter((el) => (el as HTMLElement).dataset.key && el !== dragged);
      const rect = target.getBoundingClientRect();
      const after = event.clientX > rect.left + rect.width / 2;
      onMove(dragged.dataset.key!, others.indexOf(target) + (after ? 1 : 0));
    };

    const end = () => {
      if (!dragged) return;
      dragged.classList.remove("dragging");
      dragged = null;
      onEnd?.();
    };

    container.addEventListener("dragstart", start);
    container.addEventListener("dragover", over);
    container.addEventListener("dragend", end);
    return () => {
      container.removeEventListener("dragstart", start);
      container.removeEventListener("dragover", over);
      container.removeEventListener("dragend", end);
    };
  };
}
