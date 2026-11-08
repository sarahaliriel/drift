"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroll() {
  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | undefined;

    const updateScroll = () => {
      lenis?.destroy();
      lenis = undefined;

      if (!motionPreference.matches) {
        lenis = new Lenis({ autoRaf: true, anchors: true });
      }
    };

    updateScroll();
    motionPreference.addEventListener("change", updateScroll);

    return () => {
      motionPreference.removeEventListener("change", updateScroll);
      lenis?.destroy();
    };
  }, []);

  return null;
}
