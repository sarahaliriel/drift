import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Alert({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("alert-success text-center", className)} role="status">
      {children}
    </div>
  );
}
