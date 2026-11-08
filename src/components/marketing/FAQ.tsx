"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState, type ReactNode } from "react";

type FAQItem = {
  question: string;
  answer: ReactNode;
};

const faqItems: FAQItem[] = [
  {
    question: "What exactly does Drift check?",
    answer:
      "Drift analyzes recurring patterns across your interface to find visual and structural inconsistencies: including components, spacing, typography, colors and UI decisions that have started to diverge.",
  },
  {
    question: "Does Drift change my code?",
    answer:
      "No. Drift is designed to analyze first. It shows what looks inconsistent, where it happens and what may need attention. You stay in control of what gets changed.",
  },
  {
    question: "Do I need an existing design system?",
    answer:
      "No. Drift can help whether your project already has a documented design system or has simply developed its own patterns over time.",
  },
  {
    question: "What is “design drift”?",
    answer: (
      <>
        Design <span className="faq-answer-drift">drift</span> happens when an
        interface slowly stops following its own patterns. Small exceptions
        accumulate until buttons, spacing, colors, typography and components no
        longer behave consistently.
      </>
    ),
  },
  {
    question: "Is Drift only useful for designers?",
    answer:
      "No. Drift is meant to make inconsistencies easier to understand across design and development, helping teams see where the implemented interface is moving away from its intended system.",
  },
  {
    question: "Will I need to change my stack?",
    answer:
      "No. Drift should work around the project you already have. The goal is to inspect your interface, not force you into a new framework, component library or design workflow.",
  },
  {
    question: "What happens after a scan?",
    answer:
      "You get a clearer view of what is consistent, what has drifted and where attention is needed, so you can decide what to fix instead of manually hunting through the entire interface.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduceMotion = Boolean(useReducedMotion());
  const sectionId = useId();
  const reveal = reduceMotion ? undefined : { opacity: 1, y: 0 };

  return (
    <section id="solutions" className="faq-section" aria-labelledby="faq-title" data-navbar-theme="dark">
      <div className="faq-shell">
        <motion.header
          className="faq-intro"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={reveal}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="faq-eyebrow">FAQ</p>
          <h2 id="faq-title">
            Questions before<br />
            <span>you start</span>
          </h2>
          <p className="faq-description">
            The short version of everything you probably want to know before
            running your first scan.
          </p>
        </motion.header>

        <motion.div
          className="faq-list"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={reveal}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.4, delay: reduceMotion ? 0 : 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            const panelId = `${sectionId}-panel-${index}`;
            const triggerId = `${sectionId}-trigger-${index}`;

            return (
              <motion.article
                className="faq-item"
                key={item.question}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                whileInView={reveal}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.32, delay: reduceMotion ? 0 : 0.05 * index, ease: [0.22, 1, 0.36, 1] }}
              >
                <button
                  id={triggerId}
                  className="faq-trigger"
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span className="faq-number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="faq-question">{item.question}</span>
                  <span className="faq-icon" aria-hidden="true" />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={triggerId}
                      className="faq-panel"
                      initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reduceMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p>{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
