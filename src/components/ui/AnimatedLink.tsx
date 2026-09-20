import Link from "next/link";
import type { ComponentProps } from "react";

import { WaveText } from "@/components/ui/WaveText";
import { cn } from "@/lib/utils";

type AnimatedLinkProps = Omit<ComponentProps<typeof Link>, "children"> & {
  children: string;
  tone?: "default" | "muted" | "inverse";
};

const tones = {
  default: "text-foreground",
  muted: "text-muted hover:text-foreground",
  inverse: "text-white/60 hover:text-white",
} as const;

export function AnimatedLink({
  children,
  className,
  tone = "default",
  ...props
}: AnimatedLinkProps) {
  return (
    <Link
      className={cn("animated-link wave-interactive", tones[tone], className)}
      {...props}
    >
      <WaveText>{children}</WaveText>
    </Link>
  );
}
