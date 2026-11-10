"use client";

import { useEffect, useRef } from "react";

/** Keeps CSS animations at their current phase while their artwork is offscreen. */
export function useDecorativeVisibility<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let active = true;
    const observer = new IntersectionObserver(([entry]) => {
      if (active) node.dataset.animationVisible = String(entry.isIntersecting);
    });
    observer.observe(node);
    return () => {
      active = false;
      observer.disconnect();
      delete node.dataset.animationVisible;
    };
  }, []);

  return ref;
}
