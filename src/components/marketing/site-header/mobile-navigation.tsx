"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { AnimatedLink } from "@/components/ui/AnimatedLink";
import { LinkButton } from "@/components/ui/Button";
import { marketingNavigation } from "@/config/marketing-navigation";
import { cn } from "@/lib/utils";

type MobileNavigationProps = {
  isCompact: boolean;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  reduceMotion: boolean;
  currentPath: string;
};

export function MobileNavigation({
  isCompact,
  isOpen,
  onOpenChange,
  reduceMotion,
  currentPath,
}: MobileNavigationProps) {
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const menuButton = menuButtonRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
        return;
      }

      if (event.key !== "Tab" || !menuRef.current) return;

      const focusableElements = [
        menuButtonRef.current,
        ...menuRef.current.querySelectorAll<HTMLElement>("a[href]"),
      ].filter((element): element is HTMLElement => Boolean(element));
      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const focusFrame = window.requestAnimationFrame(() => {
      menuRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
    });

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      menuButton?.focus();
    };
  }, [isOpen, onOpenChange]);

  return (
    <div className="flex h-full w-full items-center justify-between lg:hidden">
      <Link href="/" className="relative z-30 shrink-0 text-xl font-semibold tracking-tight">Drift</Link>

      <div className="flex items-center gap-2">
        <AnimatePresence initial={false}>
          {isCompact && !isOpen && (
            <motion.div
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 10 }}
              transition={{ duration: reduceMotion ? 0.08 : 0.24 }}
            >
              <LinkButton href="/cadastro" size="sm" className="h-11 rounded-xl px-3.5">
                Get started
              </LinkButton>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          ref={menuButtonRef}
          type="button"
          className="relative z-30 grid size-12 place-items-center rounded-full border border-black/10 bg-white hover:bg-black/4"
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isOpen}
          aria-controls="menu-mobile"
          onClick={() => onOpenChange(!isOpen)}
        >
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            ref={menuRef}
            id="menu-mobile"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: reduceMotion ? 0.08 : 0.28, ease: [0.22, 1, 0.36, 1] }}
            className={cn("marketing-mobile-menu fixed inset-0 z-10 bg-white", isCompact && "marketing-mobile-menu-compact")}
            aria-label="Navegação móvel"
          >
            <div className="mx-auto flex h-full max-w-lg flex-col px-5 pt-25 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              <div className="border-t border-black/[0.08]">
              {marketingNavigation.map((item) => (
                <AnimatedLink
                  key={item.label}
                  href={item.href}
                  aria-current={currentPath === item.href ? "page" : undefined}
                  onClick={() => onOpenChange(false)}
                  className="flex min-h-16 w-full items-center border-b border-black/[0.08] py-4 text-[1.2rem] font-medium after:hidden hover:text-brand-green aria-[current=page]:text-brand-green"
                >
                  {item.label}
                </AnimatedLink>
              ))}
              </div>
              <div className="mt-auto grid gap-3 pt-8">
                <LinkButton href="/login" variant="outline" size="lg" className="w-full" onClick={() => onOpenChange(false)}>
                  Sign in
                </LinkButton>
                <LinkButton href="/cadastro" size="lg" className="w-full" onClick={() => onOpenChange(false)}>
                  Get started
                </LinkButton>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
