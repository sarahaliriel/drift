import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DashboardStatus as Status } from "@/features/dashboard/public";
import { dateLabel } from "@/lib/date-label";
import type { Project } from "@/features/projects/public";
import type { Scan } from "@/features/scans/public";
import { WaveText } from "@/components/ui/WaveText";
import { InteractiveBentoCard } from "./InteractiveBentoCard";

export function LatestScanCard({ scan, projects }: { scan?: Scan; projects: Project[] }) {
  if (!scan)
    return (
      <InteractiveBentoCard className='overview-latest-scan' elevate>
        <section aria-labelledby='latest-scan-empty-heading'>
          <div className='overview-latest-empty'>
            <h2 id='latest-scan-empty-heading'>Latest scan</h2>
            <strong>No scans yet.</strong>
            <span>Run a first scan from a project when it is available.</span>
          </div>
        </section>
      </InteractiveBentoCard>
    );
  const project = projects.find((item) => item.id === scan.projectId);
  return (
    <InteractiveBentoCard className='overview-latest-scan' borderGlow elevate>
      <section aria-labelledby='latest-scan-heading'>
        <div className='overview-latest-scan-copy'>
          <h2 id='latest-scan-heading'>Latest scan</h2>
          <strong>{project?.name || "Project"}</strong>
          <span>
            {dateLabel(scan.completedAt || scan.startedAt)} · {scan.findingsCount} findings
          </span>
        </div>
        <Status status={scan.status} />
        <Link
          href={project ? `/dashboard/projects/${project.id}` : "/dashboard/projects"}
          className='overview-inline-link'
        >
          <WaveText>Open project</WaveText> <ArrowUpRight size={14} />
        </Link>
      </section>
    </InteractiveBentoCard>
  );
}
