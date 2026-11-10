"use client";

import { motion, useReducedMotion } from "motion/react";

const steps = [
  {
    number: "01",
    label: "CONNECT",
    title: "Connect your project.",
    description: "Start by bringing your project into Drift.",
  },
  {
    number: "02",
    label: "DETECT",
    title: "Spot what doesn't belong.",
    description:
      "Identify visual inconsistencies, unexpected deviations and patterns that need attention.",
  },
  {
    number: "03",
    label: "IMPROVE",
    title: "Bring everything back in sync.",
    description:
      "Review findings and make informed improvements to maintain a consistent interface.",
  },
];

export function HowItWorks() {
  const reduced = Boolean(useReducedMotion());
  const reveal = (delay = 0) => ({
    initial: reduced ? (false as const) : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: reduced ? 0 : 0.55, delay },
  });
  return (
    <section
      id='how-it-works'
      className='how-section'
      data-navbar-theme='light'
      aria-labelledby='how-title'
    >
      <div className='container-wide'>
        <motion.header {...reveal()} className='how-header'>
          <p className='section-eyebrow'>HOW IT WORKS</p>
          <h2 id='how-title'>
            From inconsistency
            <br />
            to <em>clarity.</em>
          </h2>
          <p>A simpler way to keep your interface and design system aligned.</p>
        </motion.header>
        <div className='how-steps'>
          {steps.map((step, index) => (
            <motion.article {...reveal(index * 0.1)} key={step.number} className='how-step'>
              <>
                <div className='how-step-index'>
                  <span>
                    {step.number} / {step.label}
                  </span>
                  <span className='how-step-dot' />
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </>
            </motion.article>
          ))}
        </div>
        <motion.div
          {...reveal(0.15)}
          className='how-preview'
          aria-label='Illustrative interface consistency scan preview'
        >
          <div className='how-preview-top'>
            <span>DRIFT / SCAN PREVIEW</span>
            <span>ILLUSTRATIVE UI</span>
          </div>
          <div className='how-preview-canvas'>
            <div className='how-preview-sidebar'>
              <i />
              <i />
              <i />
            </div>
            <div className='how-preview-main'>
              <div className='how-preview-line long' />
              <div className='how-preview-line' />
              <div className='how-preview-row'>
                <span className='how-preview-block' />
                <span className='how-preview-block detected'>
                  Spacing deviation <b>↗</b>
                </span>
                <span className='how-preview-block' />
              </div>
              <div className='how-preview-resolved'>✓ &nbsp; Reviewed pattern</div>
            </div>
          </div>
          <div className='how-preview-bottom'>
            <span className='how-key detected-key' /> Detected inconsistency{" "}
            <span className='how-key resolved-key' /> Reviewed state
          </div>
        </motion.div>
      </div>
    </section>
  );
}
