import { useEffect, useRef } from 'react';

export interface KeyboardControlHandlers {
  onNext: () => void;
  onPrevious: () => void;
  onDim: () => void;
  onBlank: () => void;
  onRestart: () => void;
  onToggleControls: () => void;
}

/** Installs a single global keydown listener mapping the locked classroom key
 *  bindings (see README) to handlers. The listener is installed once; handlers
 *  are read through a ref so passing a fresh handlers object each render does
 *  not re-bind it. Key auto-repeat is ignored so holding a key does not fire
 *  repeatedly, and presses are ignored while a text field is focused. */
export function useKeyboardControls(handlers: KeyboardControlHandlers): void {
  const ref = useRef(handlers);
  ref.current = handlers;

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.repeat || isEditableTarget(e.target)) return;
      const h = ref.current;

      switch (e.key) {
        case ' ':
        case 'ArrowRight':
          e.preventDefault();
          h.onNext();
          return;
        case 'ArrowLeft':
          e.preventDefault();
          h.onPrevious();
          return;
        case 'Escape':
          h.onToggleControls();
          return;
      }

      switch (e.key.toLowerCase()) {
        case 'd':
          h.onDim();
          return;
        case 'b':
          h.onBlank();
          return;
        case 'r':
          h.onRestart();
          return;
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const { tagName } = target;
  return tagName === 'INPUT' || tagName === 'TEXTAREA' || target.isContentEditable;
}
