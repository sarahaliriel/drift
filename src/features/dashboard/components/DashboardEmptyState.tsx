import type { ReactNode } from "react";

export function DashboardEmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className='dash-empty'>
      <div className='dash-empty-mark'>✳</div>
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </div>
  );
}
