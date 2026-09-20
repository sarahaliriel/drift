"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { CompactDesktopNavigation } from "@/components/marketing/site-header/compact-desktop-navigation";
import { Button, LinkButton } from "@/components/ui/Button";

const routeCta = {
  "/login": { label: "Create account", href: "/cadastro" },
  "/cadastro": { label: "Sign in", href: "/login" },
  "/recuperar-senha": "Go back",
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
          aria-label={`${cta.label} — go to the ${
            cta.href === "/login" ? "sign-in" : "sign-up"
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
        aria-label="Go back to the previous page"
      >
        {cta}
      </Button>
    );
  }

  return (
    <header className="auth-navbar">
      <div className="auth-navbar-mobile">
        <Link href="/" aria-label="Drift">
          <Image src="/logos/drift-logo-v1.png" alt="Drift" width={40} height={40} priority />
        </Link>
        {renderCta()}
      </div>
      <div className="marketing-header-desktop-compact auth-navbar-desktop items-center">
        <CompactDesktopNavigation currentPath={pathname} cta={renderCta()} />
      </div>
    </header>
  );
}
