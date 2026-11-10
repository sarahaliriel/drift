import Link from "next/link";
import { WaveText } from "@/components/ui/WaveText";
import { DashboardStatus } from "@/features/dashboard/public";
import { dateLabel } from "@/lib/date-label";
import type { Project } from "../model/types";
import type { Scan } from "@/features/scans/public";

export function ProjectRow({
  project,
  scan,
  findings,
}: {
  project: Project;
  scan?: Scan;
  findings: number;
}) {
  return (
    <Link href={`/dashboard/projects/${project.id}`} className='dash-project-row'>
      <span className='dash-project-icon'>{project.name.slice(0, 1)}</span>
      <span className='dash-project-primary'>
        <strong>
          <WaveText>{project.name}</WaveText>
        </strong>
        <small>
          {project.sourceType === "github" ? "GitHub" : "Upload"} · {project.sourceMetadata.label}
        </small>
      </span>
      <span className='dash-row-meta'>
        {scan ? `Scanned ${dateLabel(scan.completedAt || scan.startedAt)}` : "No scans yet"}
      </span>
      <span className='dash-row-meta'>{scan ? `${findings} open findings` : "—"}</span>
      <DashboardStatus status={project.status} />
      <span aria-hidden='true' className='dash-row-arrow'>
        ↗
      </span>
    </Link>
  );
}
