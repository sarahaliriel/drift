"use client";

import { motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { CompactDesktopNavigation } from "@/components/marketing/site-header/compact-desktop-navigation";
import { DesktopNavigation } from "@/components/marketing/site-header/desktop-navigation";
import { MobileNavigation } from "@/components/marketing/site-header/mobile-navigation";
import { useHeaderScrollState } from "@/components/marketing/site-header/use-header-scroll-state";
import { cn } from "@/lib/utils";

const transition = {
  duration: 0.62,
  ease: [0.76, 0, 0.24, 1],
} as const;

export function MarketingHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { isCompact, sentinelRef } = useHeaderScrollState();
  const reduceMotion = Boolean(useReducedMotion());

  return (
    <>
      <motion.header
        className="marketing-header fixed inset-x-0 top-0 z-50 h-20.5 bg-surface"
        data-compact={isCompact || undefined}
        animate={{
          backgroundColor: isCompact ? "transparent" : "var(--color-surface)",
        }}
        transition={reduceMotion ? { duration: 0.08 } : transition}
      >
        <motion.div
          className="marketing-header-desktop-full container-wide hidden h-full items-center lg:flex"
          animate={{
            opacity: isCompact ? 0 : 1,
            y: reduceMotion || !isCompact ? 0 : -10,
            scale: reduceMotion || !isCompact ? 1 : 0.995,
          }}
          transition={
            reduceMotion
              ? { duration: 0.08 }
              : {
                  ...transition,
                  duration: isCompact ? 0.3 : 0.5,
                  delay: isCompact ? 0 : 0.08,
                }
          }
          aria-hidden={isCompact || undefined}
          inert={isCompact}
        >
          <DesktopNavigation currentPath={pathname} />
        </motion.div>

        <motion.div
          className="marketing-header-desktop-compact absolute top-0 left-1/2 hidden items-center lg:flex"
          initial={false}
          animate={{
            opacity: isCompact ? 1 : 0,
            y: isCompact ? 22 : 12,
            x: "-50%",
            scale: reduceMotion || isCompact ? 1 : 0.975,
          }}
          transition={
            reduceMotion
              ? { duration: 0.08 }
              : {
                  ...transition,
                  duration: isCompact ? 0.58 : 0.32,
                  delay: isCompact ? 0.08 : 0,
                }
          }
          aria-hidden={!isCompact || undefined}
          inert={!isCompact}
        >
          <CompactDesktopNavigation currentPath={pathname} />
        </motion.div>

        <div
          className={cn(
            "marketing-header-inner container-wide relative z-20 flex h-full items-center lg:hidden",
            isCompact && "marketing-header-inner-compact",
          )}
        >
          <MobileNavigation
            isCompact={isCompact}
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            reduceMotion={reduceMotion}
            currentPath={pathname}
          />
        </div>

        <motion.div
          className="marketing-header-rule pointer-events-none absolute inset-x-0 bottom-0 h-px bg-border"
          animate={{ opacity: isCompact ? 0 : 1, scaleX: isCompact ? 0.2 : 1 }}
          transition={
            reduceMotion
              ? { duration: 0.08 }
              : { ...transition, duration: 0.3 }
          }
          aria-hidden="true"
        />
      </motion.header>

      <div className="relative h-20.5" aria-hidden="true">
        <div ref={sentinelRef} className="absolute inset-x-0 bottom-0 h-px" />
      </div>
    </>
  );
}
