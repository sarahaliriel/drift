import { DashboardPageHeader } from "@/features/dashboard/public";
export default function SettingsPage() {
  return (
    <>
      <DashboardPageHeader
        title='Settings'
        description='Workspace preferences and account settings.'
      />
      <section className='dash-section'>
        <div className='dash-section-heading'>
          <h2>Appearance</h2>
        </div>
        <p className='dash-muted'>
          Choose Light, Dark, or System from the sidebar. Your choice is saved in this browser.
        </p>
      </section>
      <section className='dash-section'>
        <div className='dash-section-heading'>
          <h2>Workspace</h2>
        </div>
        <p className='dash-muted'>
          This is a local demo workspace. Account and collaboration settings are coming later.
        </p>
      </section>
    </>
  );
}
