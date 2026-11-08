"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Github } from "lucide-react";

const repository = "https://github.com/sarahaliriel/drift";
export function OpenSource() {
  const reduced = Boolean(useReducedMotion());
  return <section className="open-section" data-navbar-theme="dark" aria-labelledby="open-title"><div className="container-wide open-grid">
    <motion.div initial={reduced ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="open-content">
      <p className="section-eyebrow">OPEN SOURCE / COMMUNITY</p><h2 id="open-title">Built in<br /><em>the open.</em></h2><p className="open-lead">Good design systems are built together.</p><p>Drift is evolving, and contributions, ideas and feedback help shape what comes next.</p>
      <div className="open-actions"><a href={repository} target="_blank" rel="noopener noreferrer" className="open-primary">Explore GitHub <ArrowUpRight size={18}/></a><a href={`${repository}/issues`} target="_blank" rel="noopener noreferrer" className="open-secondary">Contribute to Drift <ArrowUpRight size={18}/></a></div>
    </motion.div>
    <motion.div initial={reduced ? false : { opacity: 0, scale: 0.94 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="open-art" aria-hidden="true"><div className="open-art-orbit orbit-one"/><div className="open-art-orbit orbit-two"/><div className="open-art-core"><Github size={64} strokeWidth={1.3}/></div><span className="open-art-node node-one">+</span><span className="open-art-node node-two">✳</span><span className="open-art-node node-three">↗</span><span className="open-art-label">IDEAS → CONTRIBUTIONS → EVOLUTION</span></motion.div>
  </div></section>;
}
