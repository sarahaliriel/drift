"use client";

import { useEffect, useRef, useState } from "react";

export function AnimatedCounter({ value, className }: { value: number; className?: string }) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const displayedValue = useRef(0);
  const hasBeenVisible = useRef(false);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;

    const animate = () => {
      const from = displayedValue.current;
      if (reduceMotion || from === value) {
        displayedValue.current = value;
        setDisplay(value);
        return;
      }
      const startedAt = performance.now();
      const duration = 220;
      const tick = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - (1 - progress) ** 3;
        const next = Math.round(from + (value - from) * eased);
        displayedValue.current = next;
        setDisplay(next);
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    if (hasBeenVisible.current) {
      animate();
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        hasBeenVisible.current = true;
        animate();
        observer.disconnect();
      },
      { threshold: 0.2 },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={elementRef} className={className}>
      {display}
    </span>
  );
}
