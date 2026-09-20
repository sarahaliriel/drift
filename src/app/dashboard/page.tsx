import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return <main className="container-shell py-10 sm:py-14"><section className="rounded-2xl border bg-white p-6 sm:p-8"><h1 className="text-2xl font-semibold tracking-tight">Drift workspace</h1><p className="mt-2 text-muted">Migration in progress.</p></section></main>;
}
