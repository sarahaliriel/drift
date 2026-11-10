import Link from "next/link";
import { ArrowUpRight, Braces, Palette, Ruler, Type } from "lucide-react";
import type { Project } from "@/features/projects/public";
import type { Finding } from "@/features/findings/public";
import { InteractiveBentoCard } from "./InteractiveBentoCard";
import { TokenConsistencyPreview } from "./TokenConsistencyPreview";

const visualForFinding = (finding: Finding) => {
  const title = finding.title.toLowerCase();
  if (title.includes("color"))
    return {
      Icon: Palette,
      label: "Color token review",
      detail: "No detected color values are available in this preview.",
    };
  if (title.includes("spacing") || title.includes("radius"))
    return { Icon: Ruler, label: "Scale alignment", detail: finding.suggestion };
  if (title.includes("text"))
    return { Icon: Type, label: "Type scale review", detail: finding.suggestion };
  return { Icon: Braces, label: "System rule", detail: finding.suggestion };
};

export function FindingsPreviewCard({
  findings,
  projects,
  hasScans,
}: {
  findings: Finding[];
  projects: Project[];
  hasScans: boolean;
}) {
  const finding = findings[0];
  if (!finding)
    return (
      <InteractiveBentoCard
        className='overview-findings-preview overview-empty-preview'
        spotlight='subtle'
        elevate
      >
        <section aria-labelledby='findings-empty-heading'>
          <h2 id='findings-empty-heading'>
            {hasScans ? "No open findings." : "No findings to review yet."}
          </h2>
          <span>
            {hasScans
              ? "Completed scans have no open findings in this workspace."
              : "Run a first scan from a project to start identifying potential inconsistencies."}
          </span>
        </section>
      </InteractiveBentoCard>
    );
  const project = projects.find((item) => item.id === finding.projectId);
  const visual = visualForFinding(finding);
  const Icon = visual.Icon;
  const description =
    project && !finding.description.toLowerCase().includes(project.name.toLowerCase())
      ? `${finding.description} Found in ${project.name}.`
      : finding.description;
  return (
    <InteractiveBentoCard
      className='overview-findings-preview'
      spotlight='default'
      borderGlow
      elevate
    >
      <section aria-labelledby='finding-preview-heading'>
        <div className='overview-card-topline'>
          <p>{finding.tokenConsistency ? "Token consistency" : "Findings preview"}</p>
          <Link
            href='/dashboard/findings'
            className='overview-icon-link'
            aria-label='View findings'
          >
            <ArrowUpRight size={16} />
          </Link>
        </div>
        {finding.tokenConsistency ? (
          <>
            <h2 id='finding-preview-heading'>{finding.title}</h2>
            <p>{description}</p>
            <TokenConsistencyPreview data={finding.tokenConsistency} />
          </>
        ) : (
          <>
            <div className='overview-finding-visual'>
              <Icon size={22} aria-hidden='true' />
              <span>{visual.label}</span>
            </div>
            <h2 id='finding-preview-heading'>{finding.title}</h2>
            <p>{description}</p>
            <small>{visual.detail}</small>
          </>
        )}
      </section>
    </InteractiveBentoCard>
  );
}
