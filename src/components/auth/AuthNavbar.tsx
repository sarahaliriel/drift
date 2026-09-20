"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import { CompactDesktopNavigation } from "@/components/marketing/site-header/compact-desktop-navigation";
import { Button, LinkButton } from "@/components/ui/Button";

const routeCta = {
  "/login": { label: "Criar conta", href: "/cadastro" },
  "/cadastro": { label: "Entrar", href: "/login" },
  "/recuperar-senha": "Voltar",
} as const;

export function AuthNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const cta = routeCta[pathname as keyof typeof routeCta] ?? routeCta["/login"];

  function goBack() {
    const referrer = document.referrer;
    const hasSafeHistory =
      window.history.length > 1 &&
      referrer.length > 0 &&
      new URL(referrer).origin === window.location.origin;

    if (hasSafeHistory) {
      router.back();
      return;
    }

    window.location.assign("/login");
  }

  function renderCta() {
    if (typeof cta !== "string") {
      return (
        <LinkButton
          href={cta.href}
          size="sm"
          className="auth-navbar-cta shrink-0 rounded-xl px-4 active:translate-y-px"
          aria-label={`${cta.label} — ir para ${
            cta.href === "/login" ? "a tela de login" : "a tela de cadastro"
          }`}
        >
          {cta.label}
        </LinkButton>
      );
    }

    return (
      <Button
        size="sm"
        className="auth-navbar-cta shrink-0 rounded-xl px-4 active:translate-y-px"
        onClick={goBack}
        aria-label="Voltar para a página anterior"
      >
        {cta}
      </Button>
    );
  }

  return (
    <header className="auth-navbar">
      <div className="auth-navbar-mobile">
        <Link href="/" className="text-xl font-semibold tracking-tight">Drift</Link>
        {renderCta()}
      </div>
      <div className="marketing-header-desktop-compact auth-navbar-desktop items-center">
        <CompactDesktopNavigation currentPath={pathname} cta={renderCta()} />
      </div>
    </header>
  );
}
