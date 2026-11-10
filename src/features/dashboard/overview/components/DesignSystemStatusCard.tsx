import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/features/projects/public";
import type { Finding } from "@/features/findings/public";
import type { Scan } from "@/features/scans/public";
import { WaveText } from "@/components/ui/WaveText";
import { AnimatedCounter } from "./AnimatedCounter";
import { InteractiveBentoCard } from "./InteractiveBentoCard";

export function DesignSystemStatusCard({
  findings,
  projects,
  scans,
}: {
  findings: Finding[];
  projects: Project[];
  scans: Scan[];
}) {
  const affectedProjects = new Set(findings.map((finding) => finding.projectId)).size;
  const scannedProjectIds = new Set(scans.map((scan) => scan.projectId));
  const scannedProjects = projects.filter((project) => scannedProjectIds.has(project.id)).length;
  const awaitingScan = projects.length - scannedProjects;
  const hasScans = scans.length > 0;
  const projectName = (projectId: string) =>
    projects.find((project) => project.id === projectId)?.name ?? "Unknown project";
  return (
    <InteractiveBentoCard className='overview-status-card' spotlight='default' borderGlow elevate>
      <section aria-labelledby='status-heading'>
        <div className='overview-card-topline'>
          <h2 id='status-heading'>Design system status</h2>
          <Link
            href={hasScans ? "/dashboard/findings" : "/dashboard/projects"}
            className='overview-inline-link'
          >
            <WaveText>{hasScans ? "View findings" : "Open projects"}</WaveText>{" "}
            <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className='overview-status-content'>
          <div>
            <p className='overview-stat'>
              <strong>
                <AnimatedCounter value={findings.length} />
              </strong>
              {hasScans ? " open findings" : " analyzed findings"}
            </p>
            <p className='overview-card-copy'>
              {hasScans
                ? `Across ${affectedProjects} ${affectedProjects === 1 ? "project" : "projects"}. Prioritize the areas where your system is beginning to drift.`
                : `${awaitingScan} ${awaitingScan === 1 ? "project is" : "projects are"} ready for a first scan. Findings will appear here after analysis.`}
            </p>
          </div>
          <div
            className='overview-signal'
            aria-label={`${findings.length} open findings, ${scannedProjects} scanned projects, and ${awaitingScan} projects awaiting a scan`}
          >
            <div className='overview-signal-grid' role='list'>
              {findings.map((finding) => (
                <span
                  key={finding.id}
                  role='listitem'
                  className={`is-${finding.severity}`}
                  title={`${finding.severity} finding · ${projectName(finding.projectId)}`}
                  aria-label={`${finding.severity} open finding in ${projectName(finding.projectId)}`}
                />
              ))}
              {projects
                .filter((project) => scannedProjectIds.has(project.id))
                .map((project) => (
                  <span
                    key={`scanned-${project.id}`}
                    role='listitem'
                    className='is-scanned'
                    title={`Scanned · ${project.name}`}
                    aria-label={`Scanned project: ${project.name}`}
                  />
                ))}
              {projects
                .filter((project) => !scannedProjectIds.has(project.id))
                .map((project) => (
                  <span
                    key={`awaiting-${project.id}`}
                    role='listitem'
                    className='is-awaiting'
                    title={`Awaiting first scan · ${project.name}`}
                    aria-label={`Project awaiting first scan: ${project.name}`}
                  />
                ))}
            </div>
            <div className='overview-signal-key'>
              <span title={`${findings.length} open findings`}>
                <i className='is-open' />
                {findings.length} open
              </span>
              <span title={`${scannedProjects} scanned projects`}>
                <i className='is-scanned' />
                {scannedProjects} scanned
              </span>
              <span title={`${awaitingScan} projects awaiting their first scan`}>
                <i className='is-awaiting' />
                {awaitingScan} awaiting
              </span>
            </div>
          </div>
        </div>
      </section>
    </InteractiveBentoCard>
  );
}
