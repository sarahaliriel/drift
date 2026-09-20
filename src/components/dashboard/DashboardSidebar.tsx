"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { dashboardNavigationGroups } from "@/config/dashboard-navigation";

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[220px] flex-col border-r border-black/[0.06] bg-white px-3 py-5 xl:w-[248px] xl:px-4 lg:flex">
      <Link href="/" className="px-2 text-xl font-semibold tracking-tight">Drift</Link>
      <nav className="mt-9 space-y-6" aria-label="Menu da dashboard">
        {dashboardNavigationGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 text-[11px] font-bold uppercase tracking-[0.12em] text-muted">{group.label}</p>
            <div className="mt-2 space-y-1">
              {group.items.map(({ label, href, icon: Icon }) => {
                const active = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
                return (
                  <Link
                    key={label}
                    href={href}
                    className={`flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition ${
                      active ? "bg-brand-lime-soft text-foreground" : "text-muted hover:bg-background hover:text-foreground focus-visible:bg-background focus-visible:text-foreground"
                    }`}
                  >
                    <Icon className="size-4.25" />
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="mt-auto">
        <Link href="/login" className="flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-muted transition hover:bg-background hover:text-foreground focus-visible:bg-background focus-visible:text-foreground">
          <LogOut className="size-4.25" />
          Sair
        </Link>
      </div>
    </aside>
  );
}
