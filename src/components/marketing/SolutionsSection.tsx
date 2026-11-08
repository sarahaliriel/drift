"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

const statements = [
  { text: "Your interface keeps evolving.", tone: "light" },
  { text: "Your design system should keep up.", tone: "light" },
  { text: "Small inconsistencies add up.", tone: "purple" },
  { text: "Drift spots what doesn't belong.", tone: "purple" },
  { text: "Find what's off.", tone: "light" },
  { text: "Understand why it matters.", tone: "light" },
  { text: "Know what to fix.", tone: "green" },
  { text: "Keep your system in sync.", tone: "green" },
] as const;

const cards = [
  { label: "DETECT", title: "Spot the inconsistencies.", description: "Find visual deviations before they spread." },
  { label: "UNDERSTAND", title: "Know what went wrong.", description: "See what doesn't match and why it matters." },
  { label: "IMPROVE", title: "Make consistency intentional.", description: "Get guidance to keep your interface aligned." },
] as const;

function ScrollStatements() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    const counter = counterRef.current;
    if (!section || !track || !counter) return;

    gsap.registerPlugin(ScrollTrigger);
    const rows = Array.from(track.querySelectorAll<HTMLElement>(".solutions-statement"));
    const cards = Array.from(section.querySelectorAll<HTMLElement>(".solutions-card"));
    const cta = section.querySelector<HTMLElement>(".solutions-cta");
    const rootStyle = getComputedStyle(document.documentElement);
    const muted = rootStyle.getPropertyValue("--color-muted-foreground").trim();
    const foreground = rootStyle.getPropertyValue("--color-foreground").trim();
    const purple = rootStyle.getPropertyValue("--color-secondary").trim();
    let lastIndex = -1;
    let disposed = false;

    const render = (progress: number) => {
      const position = Math.min(1, progress / 0.72) * (rows.length - 1);
      const radius = Math.min(230, Math.max(120, window.innerHeight * (window.innerWidth < 768 ? 0.19 : 0.24)));
      rows.forEach((row, index) => {
        const delta = index - position;
        const angle = Math.max(-1.42, Math.min(1.42, delta * 0.54));
        const prominence = Math.max(0, 1 - Math.abs(delta));
        const activeColor = row.classList.contains("solutions-tone-purple") ? purple : foreground;
        gsap.set(row, {
          xPercent: -50,
          yPercent: -50,
          y: Math.sin(angle) * radius,
          z: (Math.cos(angle) - 1) * radius,
          rotationX: -angle * 180 / Math.PI,
          opacity: Math.max(0.08, 1 - Math.abs(delta) * 0.43),
          color: gsap.utils.interpolate(muted, activeColor, prominence),
          visibility: Math.abs(delta) > 3.3 ? "hidden" : "visible",
        });
      });
      const active = Math.min(rows.length - 1, Math.round(position));
      if (active !== lastIndex) {
        counter.textContent = String(active + 1).padStart(2, "0");
        rows.forEach((row, index) => row.classList.toggle("is-active", index === active));
        lastIndex = active;
      }
      cards.forEach((card, index) => {
        const entrance = Math.max(0, Math.min(1, (progress - 0.73 - index * 0.055) / 0.11));
        gsap.set(card, { autoAlpha: entrance, y: (1 - entrance) * 28 });
      });
      if (cta) {
        const entrance = Math.max(0, Math.min(1, (progress - 0.9) / 0.1));
        gsap.set(cta, { autoAlpha: entrance, y: (1 - entrance) * 16 });
      }
    };

    const statementDistance = () => Math.max(1150, window.innerHeight * (window.innerWidth < 768 ? 3.2 : 3.5));
    const overlapDistance = () => section.getBoundingClientRect().height;
    const renderScroll = (self: ScrollTrigger) => {
      const distance = statementDistance();
      render(Math.min(1, self.progress * (distance + overlapDistance()) / distance));
    };

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      // The last viewport keeps the finished reel still while Open Source covers it.
      end: () => `+=${statementDistance() + overlapDistance()}`,
      pin: true,
      pinSpacing: true,
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: renderScroll,
      onRefresh: renderScroll,
    });
    document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh(); });
    renderScroll(trigger);
    return () => {
      disposed = true;
      trigger.kill();
      gsap.set(rows, { clearProps: "transform,opacity,color,visibility" });
      gsap.set([...cards, cta].filter(Boolean), { clearProps: "transform,opacity,visibility" });
    };
  }, [reduceMotion]);

  return (
    <div ref={sectionRef} className="solutions-reel" aria-label="What Drift helps you do">
      <div className="solutions-reel-viewport">
        <h2 id="solutions-title" className="solutions-heading">CONSISTENCY <span>MATTERS.</span></h2>
        <div className="solutions-guide solutions-guide-top" aria-hidden="true" />
        <div className="solutions-guide solutions-guide-bottom" aria-hidden="true" />
        <div className="solutions-progress" aria-hidden="true"><span ref={counterRef}>01</span><span> / 08</span></div>
        <div ref={trackRef} className="solutions-track">
          {statements.map((statement, index) => (
            <p key={statement.text} className={`solutions-statement solutions-tone-${statement.tone}${index === 0 ? " is-active" : ""}`}>
              {statement.text}
            </p>
          ))}
        </div>
        <div className="solutions-conclusion">
          <SolutionCards />
          <SolutionsCTA />
        </div>
      </div>
    </div>
  );
}

function SolutionCards() {
  return (
    <div className="solutions-content container-wide">
      <div className="solutions-cards">
        {cards.map((card, index) => (
          <article key={card.label} className="surface-card solutions-card">
            <span className="solutions-card-number">{String(index + 1).padStart(2, "0")}</span>
            <div className="solutions-card-copy"><span className="solutions-card-category">{card.label}</span><h3>{card.title}</h3><p>{card.description}</p></div>
          </article>
        ))}
      </div>
    </div>
  );
}

function SolutionsCTA() {
  return (
    <div className="solutions-cta container-wide">
      <div className="solutions-cta-actions">
        <Button href="/login" size="lg" variant="primary" className="rounded-xl px-6">Try Drift <ArrowRight className="size-5" aria-hidden="true" /></Button>
      </div>
    </div>
  );
}

export function SolutionsSection() {
  return <section id="solutions" className="solutions-section" aria-labelledby="solutions-title" data-navbar-theme="light"><ScrollStatements /></section>;
}
