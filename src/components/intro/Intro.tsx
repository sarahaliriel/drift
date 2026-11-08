"use client";

import { useEffect, useState } from "react";

import styles from "./Intro.module.css";

const INTRO_DURATION_MS = 2500;
const REDUCED_MOTION_DURATION_MS = 140;

export function Intro() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    document.body.style.overflow = "hidden";

    const restoreScroll = () => {
      document.body.style.overflow = previousOverflow;
    };

    const timeoutId = window.setTimeout(
      () => {
        restoreScroll();
        setIsVisible(false);
      },
      prefersReducedMotion
        ? REDUCED_MOTION_DURATION_MS
        : INTRO_DURATION_MS,
    );

    return () => {
      window.clearTimeout(timeoutId);
      restoreScroll();
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <div className={styles.intro} aria-hidden="true">
        <div className={styles.scanLine} />

        <div className={styles.composition}>
          <div className={styles.wordmark}>
            DRIF<span className={styles.offsetLetter}>T</span>.
          </div>

          <div className={styles.readout}>
            <div className={styles.checkRow}>
              <span>SPACING</span>
              <span className={styles.pass}>✓</span>
            </div>
            <div className={styles.checkRow}>
              <span>TYPE</span>
              <span className={styles.pass}>✓</span>
            </div>
            <div className={styles.checkRow}>
              <span>COLOR</span>
              <span className={styles.pass}>✓</span>
            </div>
            <div className={`${styles.checkRow} ${styles.alignmentRow}`}>
              <span>ALIGNMENT</span>
              <span className={styles.driftState}>DRIFT</span>
              <span className={styles.alignedState}>ALIGNED</span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.revealLine} aria-hidden="true" />
    </>
  );
}
