"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";

export function ProductSection() {
  const introRef = useRef<HTMLElement>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const reveal = reduceMotion ? undefined : { opacity: 1, y: 0 };
  const { scrollYProgress } = useScroll({ target: introRef, offset: ["start end", "end start"] });
  const driftColor = useTransform(scrollYProgress, [0.45, 0.48], ["#fdfffb", "#7b00d5"]);

  return (
    <section id="product" className="product-section" data-navbar-theme="dark">
      <div className="product-shell">
        <header ref={introRef} className="product-intro">
          <div className="product-intro-grid">
            <p className="product-intro-label">Why <b>Drift</b> exists</p>
            <motion.h2 initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={reveal} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
              Interfaces don&apos;t<br />break all at{" "}
              <span className="product-title-word">once<span className="product-title-period">.</span></span>{" "}
              They{" "}<motion.em className="product-purple product-title-word" style={{ color: reduceMotion ? "#fdfffb" : driftColor }}>drift<span className="product-title-period">.</span></motion.em>
            </motion.h2>
            <div className="product-intro-divider" aria-hidden="true" />
            <motion.div className="product-intro-copy" initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={reveal} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.08, ease: [0.22, 1, 0.36, 1] }}>
              <p>Small inconsistencies compound until the interface stops behaving like one system.</p>
              <ol><li>A button changes.</li><li>A spacing value gets copied.</li><li>A color appears where it shouldn&apos;t.</li><li>A component gets recreated.</li></ol>
              <Button href="/login" size="lg" className="product-intro-cta">See how it works <span className="product-intro-cta-arrow" aria-hidden="true">→</span></Button>
            </motion.div>
          </div>
        </header>
      </div>
    </section>
  );
}
