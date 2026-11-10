"use client";

import { useEffect, type ReactNode } from "react";
import { landingMotion } from "@/lib/motion-config";

const selector = "[data-magnetic], [data-motion-card]";

/** Delegated pointer physics keeps interactive motion off React's render path. */
export function MotionProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const hover = matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let stop: (() => void) | undefined;

    const start = () => {
      const magnets = new Set<HTMLElement>();
      const cards = new Set<HTMLElement>();
      const bounds = new Map<HTMLElement, DOMRect>();
      const transitions = new Set<Element>();
      let frameId = 0;
      let pointer: { x: number; y: number } | null = null;
      const invalidate = () => bounds.clear();
      const sizes = new ResizeObserver(invalidate);
      sizes.observe(document.body);
      const register = (node: HTMLElement) => {
        const magnetic = node.hasAttribute("data-magnetic");
        const card = node.hasAttribute("data-motion-card");
        if (magnetic) magnets.add(node);
        else magnets.delete(node);
        if (card) cards.add(node);
        else cards.delete(node);
        if (magnetic || card) sizes.observe(node);
        else {
          sizes.unobserve(node);
          bounds.delete(node);
        }
      };
      const unregister = (node: HTMLElement) => {
        magnets.delete(node);
        cards.delete(node);
        sizes.unobserve(node);
        bounds.delete(node);
      };
      const visit = (root: Node, action: (node: HTMLElement) => void) => {
        if (!(root instanceof Element)) return;
        if (root.matches(selector)) action(root as HTMLElement);
        root.querySelectorAll<HTMLElement>(selector).forEach(action);
      };
      document.querySelectorAll<HTMLElement>(selector).forEach(register);
      const changes = new MutationObserver((records) => {
        for (const record of records) {
          if (record.type === "attributes") {
            if (
              record.attributeName === "data-magnetic" ||
              record.attributeName === "data-motion-card"
            )
              register(record.target as HTMLElement);
          } else {
            record.removedNodes.forEach((node) => visit(node, unregister));
            record.addedNodes.forEach((node) => visit(node, register));
          }
        }
        invalidate();
      });
      changes.observe(document.body, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ["class", "hidden", "aria-expanded", "data-magnetic", "data-motion-card"],
      });

      const rectOf = (node: HTMLElement) => {
        let rect = bounds.get(node);
        if (!rect) {
          rect = node.getBoundingClientRect();
          bounds.set(node, rect);
        }
        return rect;
      };
      const reset = () => {
        for (const node of magnets) {
          node.style.setProperty("--magnet-x", "0px");
          node.style.setProperty("--magnet-y", "0px");
        }
        for (const node of cards) {
          node.style.setProperty("--card-rx", "0deg");
          node.style.setProperty("--card-ry", "0deg");
          node.style.setProperty("--card-scale", "1");
        }
      };
      const schedule = () => {
        if (!frameId) frameId = requestAnimationFrame(update);
      };
      const update = () => {
        frameId = 0;
        if (!pointer) return;
        if (transitions.size) invalidate();
        for (const node of magnets) {
          const rect = rectOf(node);
          const dx = pointer.x - rect.left - rect.width / 2;
          const dy = pointer.y - rect.top - rect.height / 2;
          const pull = Math.max(0, 1 - Math.hypot(dx, dy) / landingMotion.magnetic.distance);
          node.style.setProperty("--magnet-x", `${dx * pull * landingMotion.magnetic.strength}px`);
          node.style.setProperty("--magnet-y", `${dy * pull * landingMotion.magnetic.strength}px`);
        }
        for (const node of cards) {
          const rect = rectOf(node);
          const x = (pointer.x - rect.left) / rect.width - 0.5;
          const y = (pointer.y - rect.top) / rect.height - 0.5;
          const dashboard = node.classList.contains("product-dashboard");
          const reach = dashboard ? 0.5 : 0.65;
          const inside = x > -reach && x < reach && y > -reach && y < reach;
          const maxTilt = dashboard ? 3 : landingMotion.parallax.maxTilt;
          node.style.setProperty("--card-rx", inside ? `${-y * maxTilt}deg` : "0deg");
          node.style.setProperty("--card-ry", inside ? `${x * maxTilt}deg` : "0deg");
          if (dashboard) node.style.setProperty("--card-scale", inside ? "1.006" : "1");
          if (inside) {
            node.style.setProperty("--glow-x", `${(x + 0.5) * 100}%`);
            node.style.setProperty("--glow-y", `${(y + 0.5) * 100}%`);
          }
        }
        if (transitions.size) schedule();
      };
      const move = (event: PointerEvent) => {
        pointer = { x: event.clientX, y: event.clientY };
        schedule();
      };
      const blur = () => {
        pointer = null;
        if (frameId) cancelAnimationFrame(frameId);
        frameId = 0;
        reset();
      };
      const affectsTargets = (event: TransitionEvent) => {
        const target = event.target;
        if (!(target instanceof Element)) return false;
        const property = event.propertyName;
        if (
          !/^(height|width|min-height|max-height|min-width|max-width|margin|padding|top|left|right|bottom|flex-basis|grid-template|transform)/.test(
            property,
          )
        )
          return false;
        if (
          property === "transform" &&
          (magnets.has(target as HTMLElement) || cards.has(target as HTMLElement))
        )
          return false;
        return [...magnets, ...cards].some((node) => target.contains(node));
      };
      const transitionStart = (event: TransitionEvent) => {
        if (!affectsTargets(event)) return;
        transitions.add(event.target as Element);
        invalidate();
        if (pointer) schedule();
      };
      const transitionEnd = (event: TransitionEvent) => {
        transitions.delete(event.target as Element);
        invalidate();
        if (pointer) schedule();
      };
      window.addEventListener("pointermove", move, { passive: true });
      window.addEventListener("blur", blur);
      window.addEventListener("resize", invalidate, { passive: true });
      window.addEventListener("scroll", invalidate, { capture: true, passive: true });
      document.addEventListener("transitionrun", transitionStart, true);
      document.addEventListener("transitionend", transitionEnd, true);
      document.addEventListener("transitioncancel", transitionEnd, true);
      return () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("blur", blur);
        window.removeEventListener("resize", invalidate);
        window.removeEventListener("scroll", invalidate, true);
        document.removeEventListener("transitionrun", transitionStart, true);
        document.removeEventListener("transitionend", transitionEnd, true);
        document.removeEventListener("transitioncancel", transitionEnd, true);
        changes.disconnect();
        sizes.disconnect();
        if (frameId) cancelAnimationFrame(frameId);
        reset();
        magnets.clear();
        cards.clear();
        bounds.clear();
        transitions.clear();
        pointer = null;
      };
    };
    const updateCapability = () => {
      stop?.();
      stop = hover.matches && !reduced.matches ? start() : undefined;
    };
    hover.addEventListener("change", updateCapability);
    reduced.addEventListener("change", updateCapability);
    updateCapability();
    return () => {
      hover.removeEventListener("change", updateCapability);
      reduced.removeEventListener("change", updateCapability);
      stop?.();
    };
  }, []);
  return children;
}
