"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import ShapeWaves from "./ShapeWaves";

const headline = "Keep your design system from drifting.";

/** A text-only scroll composition; the tall section supplies its scrub distance. */
export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const driftingRef = useRef<HTMLSpanElement>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const [finalLineX, setFinalLineX] = useState(0);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
  });

  useLayoutEffect(() => {
    const updateFinalPosition = () => {
      if (!driftingRef.current) return;
      const endInset = Math.max(window.innerWidth * 0.01, 8);
      setFinalLineX(
        window.innerWidth -
          endInset -
          driftingRef.current.offsetLeft -
          driftingRef.current.offsetWidth,
      );
    };
    updateFinalPosition();
    window.addEventListener("resize", updateFinalPosition);
    return () => window.removeEventListener("resize", updateFinalPosition);
  }, []);

  const lineX = useTransform(scrollYProgress, [0, 1], [0, finalLineX]);
  const driftingColor = useTransform(
    scrollYProgress,
    [0.97, 1],
    ["#0c0a14", "#7b00d5"],
  );
  const scratchProgress = useTransform(scrollYProgress, [0.52, 1], [0, 1]);

  if (reduceMotion) return <StaticHero />;

  return (
    <section
      ref={heroRef}
      id="overview"
      className="hero-scroll"
      data-theme-boundary
      data-navbar-theme="light"
    >
      <div className="hero-scroll-stage">
        <div className="hero-waves">
          <ShapeWaves
            text="</>"
            fontFamily='var(--font-sans), Geist, "Geist Sans", system-ui, sans-serif'
            fontWeight={500}
            textSize={0.59}
            shapes="mixed"
            cellSize={8}
            dotSize={0.81}
            color="#7b00d5"
            hoverColor="#c8f426"
            backgroundColor="#fdfffb"
            speed={0.4}
            scale={1}
            contrast={1.4}
            brightness={0.4}
            flow={0}
            direction={0}
            fade={0.25}
            interactive
            splashRadius={40}
            splashStrength={0.4}
            glow={0.35}
            intro
            introDuration={1.6}
          />
        </div>
        <h1 className="hero-headline">
          <span className="sr-only">{headline}</span>
          <motion.span
            aria-hidden="true"
            className="hero-line"
            style={{ x: lineX }}
          >
            Keep your design system from{" "}
            <motion.span
              ref={driftingRef}
              className="hero-drifting"
              style={{ color: driftingColor }}
            >
              drifting.
              <svg
                className="hero-scratch"
                viewBox="0 0 520 40"
                aria-hidden="true"
              >
                <motion.path
                  d="M5 24 C35 18, 56 28, 86 22 S141 16, 173 23 S230 29, 260 20 S318 16, 348 24 S398 28, 426 19 S478 14, 515 22"
                  style={{ pathLength: scratchProgress }}
                />
              </svg>
            </motion.span>
          </motion.span>
        </h1>
        <p className="hero-supporting-copy">
          Honest analysis for interfaces that drift.
          <br />
          Finds what&apos;s off. Shows how to fix it.
        </p>
        <a href="#product" className="hero-scroll-indicator" aria-label="Scroll to the next section">
          <motion.span aria-hidden="true" animate={{ y: [0, 5, 0] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}>
            ↓
          </motion.span>
          Scroll
        </a>
      </div>
    </section>
  );
}

function StaticHero() {
  return (
    <section
      id="overview"
      className="hero-static"
      data-theme-boundary
      data-navbar-theme="light"
    >
      <h1 className="hero-headline hero-headline-static">
        Keep your design system from{" "}
        <span className="hero-drifting text-secondary">
          drifting.
          <svg className="hero-scratch" viewBox="0 0 520 40" aria-hidden="true">
            <path d="M5 24 C35 18, 56 28, 86 22 S141 16, 173 23 S230 29, 260 20 S318 16, 348 24 S398 28, 426 19 S478 14, 515 22" />
          </svg>
        </span>
      </h1>
      <p className="hero-supporting-copy hero-supporting-copy-static">
        Honest analysis for interfaces that drift.
        <br />
        Finds what&apos;s off. Shows how to fix it.
      </p>
    </section>
  );
}
