"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const desktopMediaQuery = "(min-width: 1024px)";

export function useHeaderScrollState() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isCompact, setIsCompact] = useState(false);

  const updateCompactState = useCallback(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    setIsCompact(sentinel.getBoundingClientRect().bottom < 0);
  }, []);

  useLayoutEffect(() => {
    updateCompactState();
  }, [updateCompactState]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const desktop = window.matchMedia(desktopMediaQuery);
    const observer = new IntersectionObserver(updateCompactState, {
      threshold: 0,
    });

    observer.observe(sentinel);
    window.addEventListener("scroll", updateCompactState, { passive: true });
    window.addEventListener("resize", updateCompactState, { passive: true });
    desktop.addEventListener("change", updateCompactState);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateCompactState);
      window.removeEventListener("resize", updateCompactState);
      desktop.removeEventListener("change", updateCompactState);
    };
  }, [updateCompactState]);

  return { isCompact, sentinelRef };
}
