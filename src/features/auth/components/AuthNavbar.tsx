"use client";

import { ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";

import { CompactDesktopNavigation } from "@/components/navigation/compact-desktop-navigation";
import { LinkButton } from "@/components/ui/Button";

const routeCta = {
  "/login": { label: "Sign up", href: "/cadastro" },
  "/cadastro": { label: "Sign in", href: "/login" },
  "/recuperar-senha": { label: "Sign in", href: "/login" },
} as const;

export function AuthNavbar() {
  const pathname = usePathname();
  const cta = routeCta[pathname as keyof typeof routeCta] ?? routeCta["/login"];

  return (
    <header className='auth-navbar'>
      <div className='auth-navbar-panel'>
        <CompactDesktopNavigation
          currentPath={pathname}
          cta={
            <LinkButton
              href={cta.href}
              size='sm'
              className='auth-navbar-cta shrink-0 rounded-xl px-3'
            >
              {cta.label} <ArrowRight className='size-4' aria-hidden='true' />
            </LinkButton>
          }
        />
      </div>
    </header>
  );
}
