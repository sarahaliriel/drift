import { DashboardEmptyState, DashboardPageHeader } from "@/features/dashboard/public";
export default function ScansPage() {
  return (
    <>
      <DashboardPageHeader
        title='Scans'
        description='Scan history will appear here once analysis is available.'
      />
      <DashboardEmptyState
        title='Scan history is coming soon.'
        description='Project setup is available now. Scan execution will arrive in a later phase.'
      />
    </>
  );
}
