"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { AnimatedLink } from "@/components/ui/AnimatedLink";
import { WaveText } from "@/components/ui/WaveText";
import { footerNavigation } from "@/config/footer-navigation";

export function FooterNavigation() {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );

  function toggleGroup(groupId: string) {
    setExpandedGroups((currentGroups) => ({
      ...currentGroups,
      [groupId]: !currentGroups[groupId],
    }));
  }

  return (
    <nav
      className="footer-nav grid grid-cols-1 gap-0 md:grid-cols-3 md:gap-x-8"
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
                className="footer-accordion-trigger animated-link"
                aria-expanded={isExpanded}
                aria-controls={panelId}
                onClick={() => toggleGroup(group.id)}
              >
                <WaveText>{group.title}</WaveText>
                <Plus
                  className="footer-accordion-icon size-4"
                  aria-hidden="true"
                />
              </button>
              <span className="hidden text-sm font-semibold tracking-[-0.01em] text-secondary-foreground md:inline">
                {group.title}
              </span>
            </h3>

            <div
              id={panelId}
              className="footer-nav-panel"
              data-expanded={isExpanded ? "true" : "false"}
            >
              <ul className="footer-nav-list mt-0 text-sm md:mt-5 md:space-y-2.5">
                {group.items.map((item) => (
                  <li
                    key={item.label}
                    className="footer-nav-item flex items-center md:min-h-8"
                  >
                    {item.href ? (
                      <AnimatedLink
                        href={item.href}
                        tone="inverse"
                        className="footer-nav-link text-secondary-foreground/75 hover:text-primary"
                      >
                        {item.label}
                      </AnimatedLink>
                    ) : (
                      <span className="inline-flex text-secondary-foreground/60">
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
