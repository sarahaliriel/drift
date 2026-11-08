"use client";

import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { dashboardNavigationGroups } from "@/config/dashboard-navigation";
import { AnimatedLink } from "@/components/ui/AnimatedLink";

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[220px] flex-col border-r border-border bg-surface px-3 py-5 xl:w-[248px] xl:px-4 lg:flex">
      <Link href="/" className="ml-2 shrink-0" aria-label="Drift">
        <Image
          src="/logos/drift-logo-v1.png"
          alt="Drift"
          width={40}
          height={40}
          priority
        />
      </Link>
      <nav className="mt-9 space-y-6" aria-label="Menu da dashboard">
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
                    className={`flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted hover:bg-surface-secondary hover:text-foreground focus-visible:bg-surface-secondary focus-visible:text-foreground"
                    }`}
                  >
                    <Icon className="size-4.25" />
                    {label}
                  </AnimatedLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="mt-auto">
        <AnimatedLink
          href="/login"
          className={[
            "flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold",
            "text-muted transition hover:bg-surface-secondary hover:text-foreground",
            "focus-visible:bg-surface-secondary focus-visible:text-foreground",
          ].join(" ")}
        >
          <LogOut className="size-4.25" />
          Sair
        </AnimatedLink>
      </div>
    </aside>
  );
}
