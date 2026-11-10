"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import {
  FileWarning,
  FolderKanban,
  Github,
  LayoutDashboard,
  Moon,
  ScanSearch,
  Settings,
  Sun,
  Upload,
} from "lucide-react";
import { WaveText } from "@/components/ui/WaveText";
import { useState } from "react";
import { useDecorativeVisibility } from "@/features/marketing/hooks/useDecorativeVisibility";

const stages = [
  {
    id: "connect",
    number: "01",
    label: "CONNECT",
    title: "Bring in your project",
    description: "Import your interface and let Drift map the system structure.",
  },
  {
    id: "detect",
    number: "02",
    label: "DETECT",
    title: "Spot what feels off",
    description: "Find spacing, color and component inconsistencies across your product.",
  },
  {
    id: "improve",
    number: "03",
    label: "IMPROVE",
    title: "Bring everything back in sync",
    description: "Review findings, align patterns and keep the interface consistent.",
  },
] as const;

type Stage = (typeof stages)[number]["id"];

function FloatingCursors({ stage }: { stage: Stage }) {
  return (
    <div className={`product-floating product-floating--${stage}`} aria-hidden='true'>
      <div className='product-collaborator product-collaborator--you'>
        <i />
        <span>Marina</span>
      </div>
      <div className='product-collaborator product-collaborator--alex'>
        <i />
        <span>Alex</span>
      </div>
      <div className='product-collaborator product-collaborator--paul'>
        <i />
        <span>Chris Paul</span>
      </div>
    </div>
  );
}

function DashboardPreviewMockup({
  stage,
  theme,
  onThemeChange,
}: {
  stage: Stage;
  theme: "light" | "dark";
  onThemeChange: (theme: "light" | "dark") => void;
}) {
  const copy =
    stage === "connect"
      ? "Project mapped"
      : stage === "detect"
        ? "8 open findings"
        : "All patterns aligned";
  return (
    <div
      className={`product-dashboard product-dashboard--${stage} product-dashboard--${theme}`}
      data-motion-card
      aria-label={`Drift dashboard preview: ${copy}`}
      style={{
        transform:
          "perspective(1400px) rotateX(var(--card-rx, 0deg)) rotateY(var(--card-ry, 0deg)) scale(var(--card-scale, 1))",
      }}
    >
      <div className='product-dashboard__reflection' aria-hidden='true' />
      <div className='product-dashboard__body'>
        <aside className='product-dashboard__sidebar'>
          <div className='product-dashboard__brand'>
            <Image src='/logos/drift-logo-v1.png' alt='' width={28} height={28} />
            <b>Drift</b>
          </div>
          <nav>
            <span className='is-active'>
              <LayoutDashboard />
              <b>
                <WaveText>Overview</WaveText>
              </b>
            </span>
            <span>
              <FolderKanban />
              <b>
                <WaveText>Projects</WaveText>
              </b>
            </span>
            <span>
              <ScanSearch />
              <b>
                <WaveText>Scans</WaveText>
              </b>
            </span>
            <span>
              <FileWarning />
              <b>
                <WaveText>Findings</WaveText>
              </b>
            </span>
          </nav>
          <div className='product-dashboard__sidebar-bottom'>
            <span>
              <Settings />
              <b>
                <WaveText>Settings</WaveText>
              </b>
            </span>
            <div className='product-dashboard__appearance'>
              <small>Appearance</small>
              <div>
                <button
                  onClick={() => onThemeChange("light")}
                  className={theme === "light" ? "is-selected" : ""}
                  aria-label='Light preview'
                  type='button'
                >
                  <Sun />
                </button>
                <button
                  onClick={() => onThemeChange("dark")}
                  className={theme === "dark" ? "is-selected" : ""}
                  aria-label='Dark preview'
                  type='button'
                >
                  <Moon />
                </button>
              </div>
            </div>
            <div className='product-dashboard__account'>
              <i>D</i>
              <span>
                <b>Demo workspace</b>
                <small>Local preview</small>
              </span>
            </div>
          </div>
        </aside>
        <div className='product-dashboard__content'>
          <div className='product-dashboard__heading'>
            <div>
              <small>WORKSPACE / OVERVIEW</small>
              <strong>Overview.</strong>
              <p>A clearer view of your design system.</p>
            </div>
            <button type='button'>
              <WaveText>New scan</WaveText> <ScanSearch />
            </button>
          </div>
          <div className='product-dashboard__grid'>
            <section className='product-dashboard__status'>
              <div className='product-dashboard__panel-title'>
                <span>DESIGN SYSTEM STATUS</span>
                <b>View findings ↗</b>
              </div>
              <div className='product-dashboard__status-inner'>
                <div>
                  <strong className='product-dashboard__finding-count'>
                    {stage === "improve" ? "0" : "8"}
                  </strong>
                  <b>{stage === "improve" ? "all aligned" : "open findings"}</b>
                  <p>
                    Across 2 projects. Prioritize the areas where your system is beginning to drift.
                  </p>
                </div>
                <div className='product-dashboard__signal'>
                  <div>
                    {Array.from({ length: 11 }).map((_, index) => (
                      <i
                        key={index}
                        className={
                          index < (stage === "improve" ? 2 : 8)
                            ? "is-open"
                            : index < 10
                              ? "is-scanned"
                              : ""
                        }
                      />
                    ))}
                  </div>
                  <small>
                    <b>■</b> 8 open　<span>■</span> 2 scanned　<em>□</em> 1 awaiting
                  </small>
                </div>
              </div>
            </section>
            <section className='product-dashboard__projects'>
              <div className='product-dashboard__panel-title'>
                <span>PROJECTS</span>
                <b>↗</b>
              </div>
              <strong>3</strong>
              <div>
                <i>
                  <Github />
                </i>
                <i>
                  <Github />
                </i>
                <i>
                  <Upload />
                </i>
              </div>
              <p>1 awaiting a first scan</p>
            </section>
            <section className='product-dashboard__recent'>
              <div className='product-dashboard__panel-title'>
                <span>RECENT PROJECTS</span>
                <b>View all →</b>
              </div>
              {["Website", "Dashboard UI", "Component Library"].map((project, index) => (
                <div className='product-dashboard__project-row' key={project}>
                  <i>{index === 2 ? <Upload /> : <Github />}</i>
                  <span>
                    <b>{project}</b>
                    <small>
                      {index === 2
                        ? "Upload · Uploaded files"
                        : "GitHub · drift/" + project.toLowerCase().replace(" ", "-")}
                    </small>
                  </span>
                  <em>{index === 2 ? "Not scanned" : `${index === 0 ? 3 : 5} findings`}</em>
                  <b>→</b>
                </div>
              ))}
              <p>Nothing more to see — you&apos;re all caught up with recent projects.</p>
            </section>
            <section className='product-dashboard__token'>
              <div className='product-dashboard__panel-title'>
                <span>TOKEN CONSISTENCY</span>
                <b>↗</b>
              </div>
              <strong>Potential color inconsistency</strong>
              <p>Similar color values detected in Website.</p>
              <div className='product-dashboard__token-reference'>
                REFERENCE TOKEN <b>--color-primary</b>
                <strong>#7B00D5</strong>
              </div>
              <div className='product-dashboard__swatches'>
                <i />
                <i className='is-selected'>✓</i>
                <i />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function InteractiveProcessCards({
  active,
  onActive,
  reduced,
}: {
  active: Stage;
  onActive: (stage: Stage) => void;
  reduced: boolean;
}) {
  return (
    <div className='product-process' role='tablist' aria-label='How Drift works'>
      {stages.map((item, index) => (
        <motion.button
          initial={reduced ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: reduced ? 0 : 0.45,
            delay: reduced ? 0 : index * 0.075,
            ease: [0.22, 1, 0.36, 1],
          }}
          key={item.id}
          type='button'
          role='tab'
          aria-selected={active === item.id}
          className={`product-process__card ${active === item.id ? "is-active" : ""}`}
          onMouseEnter={() => onActive(item.id)}
          onFocus={() => onActive(item.id)}
          onClick={() => onActive(item.id)}
        >
          <span className='product-process__eyebrow'>
            {item.number} / {item.label}
            <i />
          </span>
          <strong>{item.title}</strong>
          <span className='product-process__description'>{item.description}</span>
          <span className='product-process__arrow' aria-hidden='true'>
            ↗
          </span>
        </motion.button>
      ))}
    </div>
  );
}

export function ProductHowItWorksSection() {
  const sectionRef = useDecorativeVisibility<HTMLElement>();
  const [active, setActive] = useState<Stage>("detect");
  const [previewTheme, setPreviewTheme] = useState<"light" | "dark">("light");
  const reduced = Boolean(useReducedMotion());
  return (
    <section
      ref={sectionRef}
      id='how-it-works'
      className='product-how'
      data-navbar-theme='light'
      aria-labelledby='product-how-title'
    >
      <div className='product-how__shell'>
        <header className='product-how__intro'>
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: reduced ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
            className='product-how__eyebrow'
          >
            HOW DRIFT WORKS
          </motion.p>
          <motion.h2
            initial={reduced ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.32 }}
            transition={{
              duration: reduced ? 0 : 0.68,
              delay: reduced ? 0 : 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
            id='product-how-title'
          >
            From inconsistency
            <br />
            to <em>clarity.</em>
          </motion.h2>
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{
              duration: reduced ? 0 : 0.5,
              delay: reduced ? 0 : 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            Drift helps you detect visual inconsistencies, review deviations, and keep your
            interface aligned as your product grows.
          </motion.p>
        </header>
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 32, scale: 0.985 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{
            duration: reduced ? 0 : 0.72,
            delay: reduced ? 0 : 0.13,
            ease: [0.22, 1, 0.36, 1],
          }}
          className='product-how__demo'
        >
          <FloatingCursors stage={active} />
          <DashboardPreviewMockup
            stage={active}
            theme={previewTheme}
            onThemeChange={setPreviewTheme}
          />
        </motion.div>
        <InteractiveProcessCards active={active} onActive={setActive} reduced={reduced} />
      </div>
    </section>
  );
}
