"use client";

import { useEffect, useRef } from "react";

import { AnimatedLink } from "@/components/ui/AnimatedLink";
import { WaveText } from "@/components/ui/WaveText";
import { footerNavigation } from "@/config/footer-navigation";

export function FooterNavigation() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav || !window.IntersectionObserver || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          nav.dataset.reveal = "visible";
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );

    nav.dataset.reveal = "pending";
    observer.observe(nav);
    return () => {
      observer.disconnect();
      delete nav.dataset.reveal;
    };
  }, []);

  return (
    <nav ref={navRef} className="footer-nav" aria-label="Navegação do rodapé">
      {footerNavigation.map((group, index) => (
        <section
          key={group.id}
          className="footer-nav-group"
          aria-labelledby={group.id}
          style={{ transitionDelay: `${index * 65}ms` }}
        >
          <h3 id={group.id} className="footer-nav-heading">
            <span className="footer-nav-number">{group.number} /</span>{" "}
            <span>{group.title}</span>
          </h3>
          <ul className="footer-nav-list">
            {group.items.map((item) => (
              <li key={item.label} className="footer-nav-item">
                {item.href ? (
                  <AnimatedLink href={item.href} className="footer-nav-link">
                    {item.label}
                  </AnimatedLink>
                ) : (
                  // Destination pending: keep the label visible without a fake link.
                  <span className="footer-nav-pending animated-link">
                    <WaveText>{item.label}</WaveText>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </nav>
  );
}
