import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(', ');

const isElementVisible = (element) => {
  const style = window.getComputedStyle(element);
  return style.display !== 'none' && style.visibility !== 'hidden';
};

const getFocusableElements = (container) =>
  [...container.querySelectorAll(FOCUSABLE_SELECTOR)].filter((element) => isElementVisible(element));

const focusElement = (element) => {
  if (element && typeof element.focus === 'function') {
    element.focus();
  }
};

const useAccessibleModal = (containerRef, onClose, options = {}) => {
  const onCloseRef = useRef(onClose);
  const {
    initialFocusSelector = '[data-autofocus]',
    lockScroll = true,
    restoreFocus = true
  } = options;

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return undefined;
    }

    const previousActiveElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    const initialFocusTarget =
      container.querySelector(initialFocusSelector) ?? getFocusableElements(container)[0] ?? container;

    if (lockScroll) {
      document.body.style.overflow = 'hidden';
    }

    focusElement(initialFocusTarget);

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current?.();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const focusableElements = getFocusableElements(container);

      if (focusableElements.length === 0) {
        event.preventDefault();
        focusElement(container);
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const isFocusInside = container.contains(document.activeElement);

      if (event.shiftKey) {
        if (!isFocusInside || document.activeElement === firstElement) {
          event.preventDefault();
          focusElement(lastElement);
        }
        return;
      }

      if (!isFocusInside || document.activeElement === lastElement) {
        event.preventDefault();
        focusElement(firstElement);
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);

      if (lockScroll) {
        document.body.style.overflow = previousOverflow;
      }

      if (restoreFocus && previousActiveElement && document.contains(previousActiveElement)) {
        focusElement(previousActiveElement);
      }
    };
  }, [containerRef, initialFocusSelector, lockScroll, restoreFocus]);
};

export default useAccessibleModal;
