"use client";
import { useParams } from "next/navigation";
import {
  useDashboard,
  DashboardActionLink,
  DashboardEmptyState,
  DashboardPageHeader,
} from "@/features/dashboard/public";
import { Button } from "@/components/ui/Button";
import { DashboardStatus } from "@/features/dashboard/public";
import { dateLabel } from "@/lib/date-label";
export function ProjectDetailsView() {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, scans, findings, loading } = useDashboard();
  const project = projects.find((p) => p.id === projectId);
  if (loading) return <div className='dash-loading'>Loading project…</div>;
  if (!project)
    return (
      <DashboardEmptyState
        title='Project not found.'
        description='This project may only exist in another browser.'
        action={<DashboardActionLink href='/dashboard/projects'>View projects</DashboardActionLink>}
      />
    );
  const scan = scans.find((s) => s.id === project.lastScanId);
  const related = findings.filter((f) => f.projectId === project.id);
  return (
    <>
      <DashboardPageHeader
        title={project.name}
        description={`${project.sourceType === "github" ? "GitHub repository" : "Uploaded files"} · ${project.sourceMetadata.label}`}
        action={
          <Button
            disabled
            size='sm'
            className='rounded-xl px-5'
            title='Scanning will be available in a future release'
          >
            Run scan · Coming soon
          </Button>
        }
      />
      <div className='dash-detail-top'>
        <DashboardStatus status={project.status} />
        <span>Created {dateLabel(project.createdAt)}</span>
        <span>Updated {dateLabel(project.updatedAt)}</span>
      </div>
      <section className='dash-section'>
        <div className='dash-section-heading'>
          <h2>Project overview</h2>
        </div>
        <dl className='dash-definition'>
          <div>
            <dt>Source</dt>
            <dd>{project.sourceType === "github" ? "GitHub demo" : "Upload demo"}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{scan ? "Last demo scan completed" : "Ready for a future scan"}</dd>
          </div>
          <div>
            <dt>Open findings</dt>
            <dd>{related.filter((f) => f.status === "open").length}</dd>
          </div>
        </dl>
      </section>
      <section className='dash-section'>
        <div className='dash-section-heading'>
          <h2>Latest scan</h2>
        </div>
        {scan ? (
          <div className='dash-info-row'>
            <DashboardStatus status={scan.status} />
            <span>{dateLabel(scan.completedAt || scan.startedAt)}</span>
            <span>{scan.findingsCount} findings</span>
            {scan.commitSha && <code>{scan.commitSha}</code>}
          </div>
        ) : (
          <div className='dash-inline-empty'>
            <h3>No scans yet.</h3>
            <p>
              Your project is ready. Run your first scan to start identifying inconsistencies when
              scanning becomes available.
            </p>
          </div>
        )}
      </section>
      <section className='dash-section'>
        <div className='dash-section-heading'>
          <h2>Recent findings</h2>
        </div>
        {related.length ? (
          <div className='dash-list'>
            {related.slice(0, 3).map((f) => (
              <div className='dash-finding-row' key={f.id}>
                <strong>{f.title}</strong>
                <span>
                  {f.filePath}:{f.line}
                </span>
                <small>{f.severity}</small>
              </div>
            ))}
          </div>
        ) : (
          <p className='dash-muted'>No findings to show before a scan.</p>
        )}
      </section>
      <section className='dash-section'>
        <div className='dash-section-heading'>
          <h2>Source details</h2>
        </div>
        <dl className='dash-definition'>
          <div>
            <dt>{project.sourceType === "github" ? "Repository" : "Source"}</dt>
            <dd>{project.sourceMetadata.label}</dd>
          </div>
          {project.sourceMetadata.branch && (
            <div>
              <dt>Branch</dt>
              <dd>{project.sourceMetadata.branch}</dd>
            </div>
          )}
          {project.sourceMetadata.files?.map((file) => (
            <div key={file.name}>
              <dt>File</dt>
              <dd>
                {file.name} · {(file.size / 1024).toFixed(1)} KB
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
