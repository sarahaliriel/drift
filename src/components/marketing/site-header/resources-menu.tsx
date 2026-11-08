"use client";

import { BookOpen, ChevronDown, CircleHelp, Github, History, Sparkles } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatedLink } from "@/components/ui/AnimatedLink";
import { WaveText } from "@/components/ui/WaveText";
import { resourcesNavigation } from "@/config/marketing-navigation";
import { cn } from "@/lib/utils";

const icons = { book: BookOpen, sparkles: Sparkles, help: CircleHelp, github: Github, history: History };

export function ResourcesMenu({ compact = false }: { compact?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [isOpen]);

  return <div ref={menuRef} className="resources-menu relative" onKeyDown={(event) => {
    if (event.key === "Escape") { setIsOpen(false); menuRef.current?.querySelector("button")?.focus(); }
  }}>
    <button type="button" aria-expanded={isOpen} aria-controls={menuId} aria-haspopup="true" onClick={() => setIsOpen(!isOpen)} className="resources-trigger flex items-center gap-1.5 whitespace-nowrap text-[0.94rem] font-medium text-foreground/75 hover:text-foreground focus-visible:text-foreground">
      <WaveText>Resources</WaveText> <ChevronDown className={cn("size-3.5 transition-transform", isOpen && "rotate-180")} aria-hidden="true" />
    </button>
    <div id={menuId} inert={!isOpen} className={cn(
      "resources-dropdown absolute top-full z-50 rounded-2xl border border-border bg-surface-elevated p-2 shadow-md transition-[opacity,transform,visibility] duration-200",
      compact ? "left-0 mt-3 w-full" : "left-1/2 mt-4 w-80 -translate-x-1/2",
      isOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0",
    )}>
      {resourcesNavigation.map((item) => {
        const Icon = icons[item.icon];
        return <AnimatedLink key={item.label} href={item.href} prefetch={item.placeholder ? false : undefined} target={item.external ? "_blank" : undefined} rel={item.external ? "noopener noreferrer" : undefined} onClick={() => setIsOpen(false)} className="group flex items-start gap-3 rounded-xl px-3 py-2.5 after:hidden hover:bg-surface-secondary focus-visible:bg-surface-secondary">
          <Icon className="mt-0.5 size-4 shrink-0 text-muted group-hover:text-foreground" aria-hidden="true" />
          <span><span className="block text-sm font-semibold text-foreground"><WaveText>{item.label}</WaveText></span><span className="mt-0.5 block text-xs leading-5 text-muted">{item.description}</span></span>
        </AnimatedLink>;
      })}
    </div>
  </div>;
}
