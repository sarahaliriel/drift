"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, GitMerge, GitPullRequest, Github, Lightbulb } from "lucide-react";

import { LinkButton } from "@/components/ui/Button";
import { WaveText } from "@/components/ui/WaveText";
import { useDecorativeVisibility } from "@/features/marketing/hooks/useDecorativeVisibility";

const repository = "https://github.com/sarahaliriel/drift";

type OrbitName = "ideas" | "contributions" | "evolution";

export function OpenSource() {
  const reduced = Boolean(useReducedMotion());
  const artRef = useRef<HTMLDivElement>(null);
  const sectionRef = useDecorativeVisibility<HTMLElement>();
  const rateFrame = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (rateFrame.current !== null) cancelAnimationFrame(rateFrame.current);
      rateFrame.current = null;
    },
    [],
  );

  const setOrbitRate = (orbit: OrbitName, targetRate: number) => {
    const orbitMotion = artRef.current?.querySelector<HTMLElement>(
      `[data-orbit-motion="${orbit}"]`,
    );
    const animations = [
      orbitMotion,
      orbitMotion?.querySelector<HTMLElement>(".open-orbit-counter"),
    ].flatMap(
      (element) => element?.getAnimations().filter((item) => item.playState !== "idle") ?? [],
    );
    if (!animations.length || reduced) return;

    if (rateFrame.current !== null) cancelAnimationFrame(rateFrame.current);
    const from = animations.map((animation) => animation.playbackRate);
    const startedAt = performance.now();
    const updateRate = (now: number) => {
      const progress = Math.min((now - startedAt) / 260, 1);
      const eased = 1 - (1 - progress) ** 3;
      animations.forEach((animation, index) => {
        animation.playbackRate = from[index] + (targetRate - from[index]) * eased;
      });
      if (progress < 1) rateFrame.current = requestAnimationFrame(updateRate);
      else rateFrame.current = null;
    };
    rateFrame.current = requestAnimationFrame(updateRate);
  };

  return (
    <section
      ref={sectionRef}
      className='open-section'
      data-navbar-theme='dark'
      aria-labelledby='open-title'
    >
      <div className='container-wide open-grid'>
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className='open-content'
        >
          <p className='section-eyebrow'>OPEN SOURCE / COMMUNITY</p>
          <h2 id='open-title'>
            Built in
            <br />
            <em>the open.</em>
          </h2>
          <p className='open-lead'>Good design systems are built together.</p>
          <p>
            Drift is evolving, and contributions, ideas and feedback help shape what comes next.
          </p>
          <div className='open-actions'>
            <a
              href={repository}
              target='_blank'
              rel='noopener noreferrer'
              className='open-primary'
              data-magnetic
            >
              <WaveText>Explore GitHub</WaveText> <ArrowUpRight size={18} />
            </a>
            <LinkButton
              href={`${repository}/issues`}
              target='_blank'
              rel='noopener noreferrer'
              variant='ghost'
              size='lg'
              className='open-secondary px-6'
            >
              Contribute to Drift <ArrowUpRight className='size-4' aria-hidden='true' />
            </LinkButton>
          </div>
        </motion.div>
        <motion.div
          ref={artRef}
          initial={reduced ? false : { opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className='open-art'
          aria-label='Ciclo colaborativo: ideias, contribuições e evolução.'
        >
          <div className='open-art-orbit orbit-one' />
          <div className='open-art-orbit orbit-two' />
          <div className='open-art-orbit orbit-three' />
          <div className='open-art-core'>
            <Github size={64} strokeWidth={1.3} aria-hidden='true' />
          </div>
          <div className='open-orbit-path orbit-ideas' data-orbit-motion='ideas'>
            <div className='open-orbit-counter'>
              <div
                className='open-art-node'
                data-orb='ideas'
                tabIndex={0}
                role='img'
                aria-label='Ideas'
                onPointerEnter={() => setOrbitRate("ideas", 0.3)}
                onPointerLeave={() => setOrbitRate("ideas", 1)}
                onFocus={() => setOrbitRate("ideas", 0.3)}
                onBlur={() => setOrbitRate("ideas", 1)}
              >
                <Lightbulb size={20} strokeWidth={1.6} aria-hidden='true' />
                <span className='open-orbit-tooltip' role='tooltip'>
                  Ideas
                </span>
              </div>
            </div>
          </div>
          <div className='open-orbit-path orbit-contributions' data-orbit-motion='contributions'>
            <div className='open-orbit-counter'>
              <div
                className='open-art-node'
                data-orb='contributions'
                tabIndex={0}
                role='img'
                aria-label='Contributions'
                onPointerEnter={() => setOrbitRate("contributions", 0.3)}
                onPointerLeave={() => setOrbitRate("contributions", 1)}
                onFocus={() => setOrbitRate("contributions", 0.3)}
                onBlur={() => setOrbitRate("contributions", 1)}
              >
                <GitPullRequest size={20} strokeWidth={1.6} aria-hidden='true' />
                <span className='open-orbit-tooltip' role='tooltip'>
                  Contributions
                </span>
              </div>
            </div>
          </div>
          <div className='open-orbit-path orbit-evolution' data-orbit-motion='evolution'>
            <div className='open-orbit-counter'>
              <div
                className='open-art-node'
                data-orb='evolution'
                tabIndex={0}
                role='img'
                aria-label='Evolution'
                onPointerEnter={() => setOrbitRate("evolution", 0.3)}
                onPointerLeave={() => setOrbitRate("evolution", 1)}
                onFocus={() => setOrbitRate("evolution", 0.3)}
                onBlur={() => setOrbitRate("evolution", 1)}
              >
                <GitMerge size={20} strokeWidth={1.6} aria-hidden='true' />
                <span className='open-orbit-tooltip' role='tooltip'>
                  Evolution
                </span>
              </div>
            </div>
          </div>
          <span className='open-art-label'>IDEAS → CONTRIBUTIONS → EVOLUTION</span>
        </motion.div>
      </div>
    </section>
  );
}
