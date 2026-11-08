"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useId, useRef, useState } from "react";

import { resourcesNavigation } from "@/config/marketing-navigation";
import { cn } from "@/lib/utils";

type ResourcesMenuProps = {
  compact?: boolean;
};

export function ResourcesMenu({ compact = false }: ResourcesMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={menuRef}
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={(event) => {
        if (!menuRef.current?.contains(event.relatedTarget)) setIsOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setIsOpen(false);
          event.currentTarget.querySelector<HTMLButtonElement>("button")?.focus();
        }
      }}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen((open) => !open)}
        className={cn(
          "flex items-center gap-1 whitespace-nowrap text-[0.94rem] font-medium text-foreground/75 hover:text-foreground focus-visible:text-foreground",
          compact && "text-[0.9rem]",
        )}
      >
        Resources
        <ChevronDown
          className={cn("size-3.5 transition-transform", isOpen && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      <div
        id={menuId}
        className={cn(
          "absolute left-1/2 top-full z-50 mt-3 w-72 -translate-x-1/2 rounded-2xl border border-border bg-surface-elevated p-2 shadow-lg transition duration-150",
          isOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0",
        )}
      >
        {resourcesNavigation.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noreferrer" : undefined}
            className="block rounded-xl px-4 py-3 hover:bg-surface-secondary focus:bg-surface-secondary"
            onClick={() => setIsOpen(false)}
          >
            <span className="block text-sm font-semibold text-foreground">{item.label}</span>
            <span className="mt-0.5 block text-xs leading-5 text-muted">{item.description}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
