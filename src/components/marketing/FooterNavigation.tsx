"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { AnimatedLink } from "@/components/ui/AnimatedLink";
import { footerNavigation } from "@/config/footer-navigation";

export function FooterNavigation() {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  function toggleGroup(groupId: string) {
    setExpandedGroups((currentGroups) => ({
      ...currentGroups,
      [groupId]: !currentGroups[groupId],
    }));
  }

  return (
    <nav
      className="footer-nav grid grid-cols-1 gap-0 md:grid-cols-3 md:gap-x-8 md:gap-y-12"
      aria-label="Navegação do rodapé"
    >
      {footerNavigation.map((group) => {
        const isExpanded = expandedGroups[group.id] ?? false;
        const panelId = `${group.id}-links`;

        return (
          <section
            key={group.id}
            className="footer-nav-group"
            aria-labelledby={group.id}
          >
            <h3 id={group.id}>
              <button
                type="button"
                className="footer-accordion-trigger"
                aria-expanded={isExpanded}
                aria-controls={panelId}
                onClick={() => toggleGroup(group.id)}
              >
                <span>{group.title}</span>
                <Plus className="footer-accordion-icon size-4" aria-hidden="true" />
              </button>
              <span className="hidden text-sm font-semibold tracking-[-0.01em] text-white md:inline">
                {group.title}
              </span>
            </h3>

            <div
              id={panelId}
              className="footer-nav-panel"
              data-expanded={isExpanded ? "true" : "false"}
            >
              <ul className="footer-nav-list mt-0 text-sm md:mt-6 md:space-y-3.5">
                {group.items.map((item) => (
                  <li key={item.label} className="footer-nav-item flex items-center md:min-h-11">
                    {item.href ? (
                      <AnimatedLink
                        href={item.href}
                        tone="inverse"
                        className="footer-nav-link text-white/70 hover:text-brand"
                      >
                        {item.label}
                      </AnimatedLink>
                    ) : (
                      <span className="inline-flex text-white/55">
                        {item.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}
    </nav>
  );
}
