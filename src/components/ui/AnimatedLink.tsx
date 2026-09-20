import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";
import { renderWaveText } from "@/components/ui/WaveText";

type AnimatedLinkProps = Omit<ComponentProps<typeof Link>, "children"> & {
  children: ReactNode;
  tone?: "default" | "muted" | "inverse";
};

const tones = {
  default: "text-foreground",
  muted: "text-muted hover:text-foreground",
  inverse: "text-secondary-foreground/75 hover:text-secondary-foreground",
} as const;

export function AnimatedLink({
  children,
  className,
  tone = "default",
  ...props
}: AnimatedLinkProps) {
  return (
    <Link
      className={cn("animated-link", tones[tone], className)}
      {...props}
    >
      {renderWaveText(children)}
    </Link>
  );
}
