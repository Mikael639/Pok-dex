import React from 'react';
import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

const MOTION_PROPS = new Set([
  'animate',
  'exit',
  'initial',
  'layout',
  'layoutId',
  'onAnimationComplete',
  'transition',
  'variants',
  'whileHover',
  'whileTap',
  'whileInView',
  'viewport'
]);

const createMotionComponent = (tag) =>
  React.forwardRef(function MockMotionComponent(props, ref) {
    const cleanedProps = { ref };

    Object.entries(props).forEach(([key, value]) => {
      if (!MOTION_PROPS.has(key)) {
        cleanedProps[key] = value;
      }
    });

    return React.createElement(tag, cleanedProps, props.children);
  });

vi.mock('framer-motion', () => {
  const createMotionValue = (initialValue) => {
    let currentValue = initialValue;

    return {
      get: () => currentValue,
      set: (nextValue) => {
        currentValue = nextValue;
      }
    };
  };

  const motion = new Proxy(
    {},
    {
      get: (_target, tag) => createMotionComponent(tag)
    }
  );

  return {
    AnimatePresence: ({ children }) => children,
    motion,
    useMotionValue: (initialValue) => createMotionValue(initialValue),
    useSpring: (value) => value,
    useTransform: (_value, _input, output) => (Array.isArray(output) ? output[0] : output),
    useMotionTemplate: (strings, ...values) =>
      strings.reduce((result, string, index) => {
        const value = values[index];
        const renderedValue =
          value && typeof value === 'object' && typeof value.get === 'function'
            ? value.get()
            : value ?? '';

        return result + string + renderedValue;
      }, '')
  };
});

const getMatchState = (query) => {
  const minWidth = query.match(/\(min-width:\s*(\d+)px\)/);
  const maxWidth = query.match(/\(max-width:\s*(\d+)px\)/);
  let matches = true;

  if (minWidth) {
    matches = matches && window.innerWidth >= Number(minWidth[1]);
  }

  if (maxWidth) {
    matches = matches && window.innerWidth <= Number(maxWidth[1]);
  }

  return matches;
};

const installMatchMediaMock = () => {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: getMatchState(query),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))
  });
};

installMatchMediaMock();

class MockAudio {
  constructor(src = '') {
    this.src = src;
    this.currentTime = 0;
    this.volume = 1;
    this.listeners = new Map();
  }

  play() {
    return Promise.resolve();
  }

  pause() {}

  addEventListener(event, callback) {
    this.listeners.set(event, callback);
  }

  removeEventListener(event) {
    this.listeners.delete(event);
  }
}

vi.stubGlobal('Audio', MockAudio);

if (!window.scrollTo) {
  window.scrollTo = vi.fn();
}

if (!window.ResizeObserver) {
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

if (!window.IntersectionObserver) {
  window.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

afterEach(() => {
  cleanup();
  localStorage.clear();
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value: 1024
  });
  vi.restoreAllMocks();
  installMatchMediaMock();
});
