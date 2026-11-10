"use client";

import Link from "next/link";
import { type ComponentProps, type ReactNode, type Ref, useRef } from "react";
import { cn } from "@/lib/utils";

type InteractiveBentoCardProps = {
  children: ReactNode;
  className?: string;
  spotlight?: "off" | "subtle" | "default";
  borderGlow?: boolean;
  elevate?: boolean;
  href?: ComponentProps<typeof Link>["href"];
  ariaLabel?: string;
};

export function InteractiveBentoCard({
  children,
  className,
  spotlight = "off",
  borderGlow = false,
  elevate = false,
  href,
  ariaLabel,
}: InteractiveBentoCardProps) {
  const cardRef = useRef<HTMLElement>(null);

  const setPointerPosition = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || !cardRef.current) return;
    const bounds = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty("--bento-x", `${event.clientX - bounds.left}px`);
    cardRef.current.style.setProperty("--bento-y", `${event.clientY - bounds.top}px`);
  };

  const classNameValue = cn(
    "overview-card overview-interactive-card",
    spotlight !== "off" && `has-spotlight is-spotlight-${spotlight}`,
    borderGlow && "has-border-glow",
    elevate && "has-bento-elevation",
    href && "is-clickable",
    className,
  );
  const pointerProps = {
    onPointerEnter: setPointerPosition,
    onPointerMove: setPointerPosition,
  };

  if (href) {
    return (
      <Link
        ref={cardRef as Ref<HTMLAnchorElement>}
        href={href}
        aria-label={ariaLabel}
        className={classNameValue}
        {...pointerProps}
      >
        {children}
      </Link>
    );
  }

  return (
    <div ref={cardRef as Ref<HTMLDivElement>} className={classNameValue} {...pointerProps}>
      {children}
    </div>
  );
}
