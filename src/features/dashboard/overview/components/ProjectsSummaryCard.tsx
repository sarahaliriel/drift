import Link from "next/link";
import { ArrowUpRight, Github, Upload } from "lucide-react";
import type { Project } from "@/features/projects/public";
import type { Scan } from "@/features/scans/public";
import { AnimatedCounter } from "./AnimatedCounter";
import { InteractiveBentoCard } from "./InteractiveBentoCard";

export function ProjectsSummaryCard({ projects, scans }: { projects: Project[]; scans: Scan[] }) {
  const scannedProjectIds = new Set(scans.map((scan) => scan.projectId));
  const awaitingScan = projects.filter((project) => !scannedProjectIds.has(project.id)).length;
  return (
    <InteractiveBentoCard
      className='overview-projects-summary'
      spotlight='subtle'
      borderGlow
      elevate
    >
      <section aria-labelledby='projects-summary-heading'>
        <div className='overview-card-topline'>
          <h2 id='projects-summary-heading'>Projects</h2>
          <Link
            href='/dashboard/projects'
            className='overview-icon-link'
            aria-label='View all projects'
          >
            <ArrowUpRight size={16} />
          </Link>
        </div>
        <strong className='overview-summary-number'>
          <AnimatedCounter value={projects.length} />
        </strong>
        <div className='overview-project-avatars' aria-label={`${projects.length} projects`}>
          {projects.slice(0, 4).map((project) => (
            <span key={project.id} title={project.name}>
              {project.sourceType === "github" ? <Github size={14} /> : <Upload size={14} />}
            </span>
          ))}
        </div>
        <p className='overview-card-copy'>
          {awaitingScan
            ? `${awaitingScan} awaiting a first scan`
            : "Every project has been scanned"}
        </p>
      </section>
    </InteractiveBentoCard>
  );
}
