import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <main className="container-shell py-10 sm:py-14">
      <section className="surface-card p-6 sm:p-8">
        <p className="font-hand text-xs uppercase tracking-[0.14em] text-muted">
          Workspace
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-[-0.02em]">Drift</h1>
        <p className="mt-3 max-w-xl text-muted">
          Workspace foundation in progress. Project analysis and consistency
          checks will arrive in a later phase.
        </p>
      </section>
    </main>
  );
}
