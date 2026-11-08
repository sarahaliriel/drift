"use client";

import { motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { X } from "lucide-react";

import { CompactDesktopNavigation } from "@/components/marketing/site-header/compact-desktop-navigation";
import { DesktopNavigation } from "@/components/marketing/site-header/desktop-navigation";
import { MobileNavigation } from "@/components/marketing/site-header/mobile-navigation";
import { useHeaderScrollState } from "@/components/marketing/site-header/use-header-scroll-state";
import { WaveText } from "@/components/ui/WaveText";
import { cn } from "@/lib/utils";

const transition = {
  duration: 0.62,
  ease: [0.76, 0, 0.24, 1],
} as const;

function AnnouncementBanner({ onClose }: { onClose: () => void }) {
  return (
    <div className="marketing-announcement pointer-events-auto relative w-full overflow-hidden rounded-lg bg-primary text-primary-foreground">
      <a
        href="https://github.com/sarahaliriel/drift"
        target="_blank"
        rel="noopener noreferrer"
        className="marketing-announcement-link block py-2 pr-10 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-foreground"
        aria-label="Drift em breve — acompanhe o projeto no GitHub"
      >
        <span className="marketing-announcement-track flex w-max items-center gap-6 font-sans text-sm font-semibold uppercase tracking-wide sm:text-base" aria-hidden="true">
          {Array.from({ length: 8 }, (_, index) => (
            <span key={index} className="flex shrink-0 items-center gap-6">
              <WaveText>Drift platform coming soon</WaveText>
              <span>✳</span>
              <WaveText>Follow the project on GitHub</WaveText>
              <span>✳</span>
            </span>
          ))}
        </span>
      </a>
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-y-0 right-0 flex w-10 items-center justify-center bg-primary text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-foreground"
        aria-label="Fechar anúncio"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export function MarketingHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
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
          <div className="marketing-header-desktop-compact-panel flex items-center gap-4 xl:gap-6">
            <CompactDesktopNavigation currentPath={pathname} />
          </div>
          {isCompact && showAnnouncement && (
            <div className="absolute top-full left-0 mt-3 w-full">
              <AnnouncementBanner onClose={() => setShowAnnouncement(false)} />
            </div>
          )}
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

        {isCompact && showAnnouncement && (
          <div className="pointer-events-auto absolute inset-x-0 top-[6.75rem] mx-auto w-[min(calc(100%-1.5rem),34rem)] lg:hidden">
            <AnnouncementBanner onClose={() => setShowAnnouncement(false)} />
          </div>
        )}

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
