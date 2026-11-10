export type DashboardStatusValue = "ready" | "scanned" | "completed" | "pending";

export function DashboardStatus({ status }: { status: DashboardStatusValue }) {
  return (
    <span className={`dash-status ${status}`}>
      {status === "ready"
        ? "Not scanned"
        : status === "scanned" || status === "completed"
          ? "Completed"
          : "Pending"}
    </span>
  );
}
