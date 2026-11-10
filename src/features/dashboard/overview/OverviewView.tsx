"use client";

import { useDashboard, DashboardActionLink as ActionLink } from "@/features/dashboard/public";
import { ScanSearch } from "lucide-react";
import { DesignSystemStatusCard } from "@/features/dashboard/overview/components/DesignSystemStatusCard";
import { FindingsPreviewCard } from "@/features/dashboard/overview/components/FindingsPreviewCard";
import { LatestScanCard } from "@/features/dashboard/overview/components/LatestScanCard";
import { ProjectsSummaryCard } from "@/features/dashboard/overview/components/ProjectsSummaryCard";
import { RecentProjectsCard } from "@/features/dashboard/overview/components/RecentProjectsCard";
import {
  OverviewEmptyWorkspace,
  OverviewErrorState,
  OverviewLoadingSkeleton,
} from "@/features/dashboard/overview/components/OverviewState";

export function OverviewView() {
  const { projects, scans, findings, loading, error, reload } = useDashboard();
  if (loading)
    return (
      <>
        <OverviewHeader />
        <OverviewLoadingSkeleton />
      </>
    );
  if (error)
    return (
      <>
        <OverviewHeader />
        <OverviewErrorState
          onRetry={() => {
            void reload();
          }}
        />
      </>
    );
  if (!projects.length)
    return (
      <>
        <OverviewHeader />
        <OverviewEmptyWorkspace />
      </>
    );
  const openFindings = findings.filter((finding) => finding.status === "open");
  const latestScan = [...scans].sort(
    (a, b) =>
      new Date(b.completedAt || b.startedAt).getTime() -
      new Date(a.completedAt || a.startedAt).getTime(),
  )[0];
  return (
    <>
      <OverviewHeader />
      <div className='overview-grid'>
        <DesignSystemStatusCard findings={openFindings} projects={projects} scans={scans} />
        <ProjectsSummaryCard projects={projects} scans={scans} />
        <RecentProjectsCard projects={projects} scans={scans} findings={openFindings} />
        <FindingsPreviewCard
          findings={openFindings}
          projects={projects}
          hasScans={scans.length > 0}
        />
        <LatestScanCard scan={latestScan} projects={projects} />
      </div>
    </>
  );
}

function OverviewHeader() {
  return (
    <header className='overview-header'>
      <div>
        <p className='overview-eyebrow'>Workspace / Overview</p>
        <h1>Overview.</h1>
        <p className='overview-description'>A clearer view of your design system.</p>
      </div>
      <ActionLink href='/dashboard/projects/new'>
        New scan <ScanSearch size={16} aria-hidden='true' />
      </ActionLink>
    </header>
  );
}
