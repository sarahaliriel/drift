"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { landingMotion } from "@/lib/motion-config";
import { updateScrollMotion } from "@/lib/scroll-motion-state";

export function SmoothScroll() {
  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | undefined;
    let velocity = 0;
    let targetVelocity = 0;
    gsap.registerPlugin(ScrollTrigger);

    const updateScroll = () => {
      lenis?.destroy();
      lenis = undefined;

      if (!motionPreference.matches) {
        lenis = new Lenis({
          autoRaf: false,
          anchors: true,
          duration: landingMotion.lenis.duration,
          lerp: landingMotion.lenis.lerp,
          smoothWheel: true,
        });
        lenis.on("scroll", ({ velocity: nextVelocity }) => {
          targetVelocity = nextVelocity / 100;
          ScrollTrigger.update();
        });
      }
    };

    const ticker = (time: number) => {
      lenis?.raf(time * 1000);
      velocity += (targetVelocity - velocity) * landingMotion.velocity.damping;
      targetVelocity *= 0.92;
      document.documentElement.style.setProperty(
        "--scroll-velocity",
        String(
          Math.max(-landingMotion.velocity.max, Math.min(landingMotion.velocity.max, velocity)),
        ),
      );
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const normalized = Math.max(-1, Math.min(1, velocity / landingMotion.velocity.max));
      updateScrollMotion({
        position: window.scrollY,
        progress: window.scrollY / maxScroll,
        velocity: normalized,
        direction: normalized === 0 ? 1 : Math.sign(normalized),
        intensity: Math.abs(normalized),
      });
    };

    updateScroll();
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);
    motionPreference.addEventListener("change", updateScroll);

    return () => {
      motionPreference.removeEventListener("change", updateScroll);
      gsap.ticker.remove(ticker);
      document.documentElement.style.removeProperty("--scroll-velocity");
      lenis?.destroy();
    };
  }, []);

  return null;
}
