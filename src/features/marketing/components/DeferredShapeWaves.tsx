"use client";

import { useEffect, useRef, useState } from "react";
import ShapeWaves, { type ShapeWavesProps } from "@/components/motion/ShapeWaves";

/** Mount the closing canvas before it reaches view, without allocating GPU resources on page load. */
export function DeferredShapeWaves(props: ShapeWavesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nearViewport, setNearViewport] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || nearViewport) return;
    let active = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (active && entry.isIntersecting) {
          observer.disconnect();
          setNearViewport(true);
        }
      },
      { rootMargin: "200% 0px" },
    );
    observer.observe(container);
    return () => {
      active = false;
      observer.disconnect();
    };
  }, [nearViewport]);

  return (
    <div
      ref={containerRef}
      className='h-full w-full'
      style={{ backgroundColor: props.backgroundColor }}
    >
      {nearViewport && <ShapeWaves {...props} />}
    </div>
  );
}
