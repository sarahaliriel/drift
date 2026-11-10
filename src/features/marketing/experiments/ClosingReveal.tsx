"use client";

import { useEffect } from "react";
import { useReducedMotion } from "motion/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

export function ClosingReveal() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const scene = document.querySelector<HTMLElement>(".closing-scene");
    if (!scene) return;

    gsap.registerPlugin(ScrollTrigger);
    const trigger = ScrollTrigger.create({
      trigger: scene,
      start: "top top",
      end: () => `+=${window.innerHeight}`,
      pin: true,
      pinSpacing: true,
      invalidateOnRefresh: true,
    });
    let disposed = false;
    const refresh = () => {
      if (!disposed) ScrollTrigger.refresh();
    };
    const observer = new ResizeObserver(refresh);
    const faq = document.querySelector<HTMLElement>(".faq-section");
    if (faq) observer.observe(faq);
    document.fonts.ready.then(refresh);

    return () => {
      disposed = true;
      observer.disconnect();
      trigger.kill();
    };
  }, [reduceMotion]);

  return null;
}
