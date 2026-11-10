import Link from "next/link";
import { ArrowRight, Github, Upload } from "lucide-react";
import type { Project } from "@/features/projects/public";
import type { Finding } from "@/features/findings/public";
import type { Scan } from "@/features/scans/public";
import { WaveText } from "@/components/ui/WaveText";
import { InteractiveBentoCard } from "./InteractiveBentoCard";

export function RecentProjectsCard({
  projects,
  scans,
  findings,
}: {
  projects: Project[];
  scans: Scan[];
  findings: Finding[];
}) {
  const recent = [...projects].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 3);
  return (
    <InteractiveBentoCard
      className='overview-recent-projects'
      spotlight='subtle'
      borderGlow
      elevate
    >
      <section aria-labelledby='recent-projects-heading'>
        <div className='overview-card-topline'>
          <div>
            <h2 id='recent-projects-heading'>Recent projects</h2>
            <span>Pick up where you left off.</span>
          </div>
          <Link href='/dashboard/projects' className='overview-inline-link'>
            <WaveText>View all</WaveText> <ArrowRight size={14} />
          </Link>
        </div>
        <div className='overview-project-list'>
          {recent.map((project) => {
            const scan = scans.find((item) => item.id === project.lastScanId);
            const count = findings.filter((finding) => finding.projectId === project.id).length;
            const source = project.sourceType === "github" ? "GitHub" : "Upload";
            const SourceIcon = project.sourceType === "github" ? Github : Upload;
            return (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className='overview-project-item'
              >
                <span className='overview-project-source'>
                  <SourceIcon size={15} />
                </span>
                <span className='overview-project-details'>
                  <strong>
                    <WaveText>{project.name}</WaveText>
                  </strong>
                  <small>
                    {source} · {project.sourceMetadata.label}
                  </small>
                </span>
                <span className={`overview-project-state${scan ? "" : " is-muted"}`}>
                  {scan ? `${count} findings` : "Not scanned"}
                </span>
                <ArrowRight className='overview-project-arrow' size={16} aria-hidden='true' />
              </Link>
            );
          })}
        </div>
        <p className='overview-projects-end'>
          Nothing more to see — you’re all caught up with recent projects.
        </p>
      </section>
    </InteractiveBentoCard>
  );
}
