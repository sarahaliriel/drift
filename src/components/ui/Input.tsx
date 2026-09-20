import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-xl border bg-white px-4 text-sm text-foreground shadow-[0_1px_0_rgb(0_0_0/0.02)] outline-none placeholder:text-muted/70 hover:border-brand-hover focus:border-brand-hover focus:ring-4 focus:ring-brand/20 disabled:bg-background disabled:text-muted",
        className,
      )}
      {...props}
    />
  );
}
