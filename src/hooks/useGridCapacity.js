import { useState, useEffect, useRef } from 'react';

const DEFAULT_CAPACITY = { cols: 3, rows: 3 };

/**
 * Calcule combien de colonnes et de lignes de tuiles tiennent dans un conteneur,
 * pour qu'une page de résultats remplisse l'espace disponible sans jamais défiler.
 *
 * @param {{ minTileWidth: number, minTileHeight: number, gap?: number }} options tailles minimales d'une tuile (px)
 * @returns {{ ref: React.RefObject, cols: number, rows: number, capacity: number }}
 */
export function useGridCapacity({ minTileWidth, minTileHeight, gap = 12 }) {
  const ref = useRef(null);
  const [size, setSize] = useState(DEFAULT_CAPACITY);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof ResizeObserver === 'undefined') return undefined;

    const measure = () => {
      const { width, height } = element.getBoundingClientRect();
      if (width === 0 || height === 0) return;
      const cols = Math.max(1, Math.floor((width + gap) / (minTileWidth + gap)));
      const rows = Math.max(1, Math.floor((height + gap) / (minTileHeight + gap)));
      setSize((previous) => (previous.cols === cols && previous.rows === rows ? previous : { cols, rows }));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [minTileWidth, minTileHeight, gap]);

  return { ref, cols: size.cols, rows: size.rows, capacity: size.cols * size.rows };
}
