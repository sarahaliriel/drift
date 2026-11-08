"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { dashboardNavigationGroups } from "@/config/dashboard-navigation";
import { AnimatedLink } from "@/components/ui/AnimatedLink";
import { WaveText } from "@/components/ui/WaveText";

export function DashboardHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b bg-surface-overlay px-4 backdrop-blur-xl sm:px-7 lg:hidden">
        <div className="flex items-center gap-3 lg:hidden">
          <button
            type="button"
            className="grid size-10 place-items-center rounded-xl border"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menu da dashboard"
          >
            <Menu className="size-5" />
          </button>
          <Link href="/" aria-label="Drift">
            <Image
              src="/logos/drift-logo-v1.png"
              alt="Drift"
              width={36}
              height={36}
              priority
            />
          </Link>
        </div>
      </header>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-surface-overlay"
            onClick={() => setMobileOpen(false)}
            aria-label="Fechar menu"
          />
          <div className="relative h-full w-[min(82vw,280px)] bg-surface">
            <div className="flex h-full flex-col p-5">
              <div className="flex items-center justify-between">
                <Link href="/" aria-label="Drift">
                  <Image
                    src="/logos/drift-logo-v1.png"
                    alt="Drift"
                    width={40}
                    height={40}
                    priority
                  />
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="animated-link text-sm font-semibold"
                >
                  <WaveText>Close</WaveText>
                </button>
              </div>
              <nav
                className="mt-8 space-y-5 overflow-y-auto"
                aria-label="Menu da dashboard"
              >
                {dashboardNavigationGroups.map((group) => (
                  <div key={group.label}>
                    <p className="px-3 text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
                      {group.label}
                    </p>
                    <div className="mt-2 space-y-1">
                      {group.items.map(({ label, href, icon: Icon }) => {
                        const active =
                          href === "/dashboard"
                            ? pathname === href
                            : pathname.startsWith(href);

                        return (
                          <AnimatedLink
                            key={label}
                            href={href}
                            onClick={() => setMobileOpen(false)}
                            className={[
                              "flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium",
                              active
                                ? "bg-primary text-primary-foreground"
                                : "text-muted hover:bg-surface-secondary hover:text-foreground",
                            ].join(" ")}
                          >
                            <Icon className="size-[18px]" /> {label}
                          </AnimatedLink>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
