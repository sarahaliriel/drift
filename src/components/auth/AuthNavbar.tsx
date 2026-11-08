"use client";

import { ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";

import { AnimatedLink } from "@/components/ui/AnimatedLink";
import { LinkButton } from "@/components/ui/Button";
import { marketingNavigation } from "@/config/marketing-navigation";

const routeCta = {
  "/login": { label: "Create account", href: "/cadastro" },
  "/cadastro": { label: "Sign in", href: "/login" },
  "/recuperar-senha": { label: "Sign in", href: "/login" },
} as const;

const authNavigation = marketingNavigation.map((item) =>
  item.label === "Platform" ? { ...item, label: "Home", href: "/" } : item,
);

export function AuthNavbar() {
  const pathname = usePathname();
  const cta = routeCta[pathname as keyof typeof routeCta] ?? routeCta["/login"];

  return (
    <header className="auth-navbar">
      <nav className="auth-navbar-panel" aria-label="Product navigation">
        <div className="auth-navbar-links">
          {authNavigation.map((item) => (
            <AnimatedLink key={item.label} href={item.href}>
              {item.label}
            </AnimatedLink>
          ))}
        </div>
        <LinkButton
          href={cta.href}
          className="auth-navbar-cta"
          aria-label={`${cta.label} — go to ${cta.href === "/login" ? "sign in" : "create account"}`}
        >
          {cta.label} <ArrowRight className="size-5" aria-hidden="true" />
        </LinkButton>
      </nav>
    </header>
  );
}
