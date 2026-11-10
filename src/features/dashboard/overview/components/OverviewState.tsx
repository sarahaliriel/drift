import { Button } from "@/components/ui/Button";
import { DashboardActionLink } from "@/features/dashboard/components/DashboardActionLink";

export function OverviewLoadingSkeleton() {
  return (
    <div className='overview-skeleton' aria-label='Loading workspace' aria-busy='true'>
      <div className='overview-skeleton-header'>
        <span />
        <span />
      </div>
      <div className='overview-skeleton-grid'>
        <div className='overview-skeleton-card is-featured' />
        <div className='overview-skeleton-card' />
        <div className='overview-skeleton-card is-projects' />
        <div className='overview-skeleton-card' />
        <div className='overview-skeleton-card is-latest' />
      </div>
    </div>
  );
}

export function OverviewEmptyWorkspace() {
  return (
    <section className='overview-empty-workspace' aria-labelledby='empty-workspace-heading'>
      <div className='overview-empty-visual' aria-hidden='true'>
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
      <p>Workspace setup</p>
      <h2 id='empty-workspace-heading'>Your workspace starts here.</h2>
      <span>Connect a repository or upload your files to start exploring your design system.</span>
      <DashboardActionLink href='/dashboard/projects/new'>
        Create your first project
      </DashboardActionLink>
    </section>
  );
}

export function OverviewErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <section className='overview-error-state' aria-labelledby='workspace-error-heading'>
      <p>Workspace unavailable</p>
      <h2 id='workspace-error-heading'>We couldn’t load your workspace.</h2>
      <span>Please try again. Your projects and analysis results have not been changed.</span>
      <Button size='sm' variant='outline' onClick={onRetry}>
        Try again
      </Button>
    </section>
  );
}
