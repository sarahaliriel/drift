"use client";

import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { AnimatedLink } from "@/components/ui/AnimatedLink";
import { LinkButton } from "@/components/ui/Button";
import { marketingNavigation, resourcesNavigation } from "@/config/marketing-navigation";
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
  const [resourcesOpen, setResourcesOpen] = useState(false);
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
        ...menuRef.current.querySelectorAll<HTMLElement>("a[href], button"),
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
      <Link href="/" className="relative z-30 shrink-0" aria-label="Drift">
        <Image
          src="/logos/drift-logo-v1.png"
          alt="Drift"
          width={48}
          height={48}
          priority
        />
      </Link>

      <div className="flex items-center gap-2">
        <AnimatePresence initial={false}>
          {isCompact && !isOpen && (
            <motion.div
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 10 }}
              transition={{ duration: reduceMotion ? 0.08 : 0.24 }}
            >
              <LinkButton
                href="/cadastro"
                size="sm"
                className="h-11 rounded-xl px-3.5"
              >
                Scan project{" "}
                <ArrowRight className="size-4" aria-hidden="true" />
              </LinkButton>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          ref={menuButtonRef}
          type="button"
          className="relative z-30 grid size-12 place-items-center rounded-full border border-border bg-surface-elevated hover:bg-surface-secondary"
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
            transition={{
              duration: reduceMotion ? 0.08 : 0.28,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={cn(
              "marketing-mobile-menu fixed inset-0 z-10 overflow-y-auto bg-surface",
              isCompact && "marketing-mobile-menu-compact",
            )}
            aria-label="Navegação móvel"
          >
            <div className="mx-auto flex h-full max-w-lg flex-col px-5 pt-25 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              <div className="border-t border-border">
                {marketingNavigation.slice(0, 2).map((item) => (
                  <AnimatedLink
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                    aria-current={
                      currentPath === item.href ? "page" : undefined
                    }
                    onClick={() => onOpenChange(false)}
                    className={[
                      "flex min-h-16 w-full items-center border-b border-border py-4",
                      "text-[1.2rem] font-medium after:hidden hover:text-accent",
                      "aria-[current=page]:text-accent",
                    ].join(" ")}
                  >
                    {item.label}
                  </AnimatedLink>
                ))}
                <div className="border-b border-border">
                  <button type="button" aria-expanded={resourcesOpen} aria-controls="mobile-resources" onClick={() => setResourcesOpen(!resourcesOpen)} className="flex min-h-16 w-full items-center justify-between text-[1.2rem] font-medium hover:text-secondary">
                    Resources <ChevronDown className={cn("size-4 transition-transform", resourcesOpen && "rotate-180")} />
                  </button>
                  {resourcesOpen && <div id="mobile-resources" className="grid gap-1 pb-4 pl-4">
                    {resourcesNavigation.map((item) => <AnimatedLink key={item.label} href={item.href} target={item.external ? "_blank" : undefined} rel={item.external ? "noopener noreferrer" : undefined} onClick={() => onOpenChange(false)} className="flex min-h-11 items-center text-base font-medium after:hidden hover:text-secondary">{item.label}</AnimatedLink>)}
                  </div>}
                </div>
                {marketingNavigation.slice(2).map((item) => (
                  <AnimatedLink
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                    aria-current={
                      currentPath === item.href ? "page" : undefined
                    }
                    onClick={() => onOpenChange(false)}
                    className="flex min-h-16 w-full items-center border-b border-border py-4 text-[1.2rem] font-medium after:hidden hover:text-accent aria-[current=page]:text-accent"
                  >
                    {item.label}
                  </AnimatedLink>
                ))}
              </div>
              <div className="mt-auto grid gap-3 pt-8">
                <LinkButton
                  href="/login"
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => onOpenChange(false)}
                >
                  Sign in
                </LinkButton>
                <LinkButton
                  href="/cadastro"
                  size="lg"
                  className="w-full"
                  onClick={() => onOpenChange(false)}
                >
                  Scan project{" "}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </LinkButton>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
