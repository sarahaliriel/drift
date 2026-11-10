import { DashboardEmptyState, DashboardPageHeader } from "@/features/dashboard/public";
export default function FindingsPage() {
  return (
    <>
      <DashboardPageHeader
        title='Findings'
        description='Explore design system inconsistencies across projects.'
      />
      <DashboardEmptyState
        title='Findings explorer is coming soon.'
        description='Sample findings are available on the existing demo project pages.'
      />
    </>
  );
}
