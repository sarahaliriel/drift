"use client";

import { ChevronLeft, ChevronRight, Menu, Monitor, Moon, Sun, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { dashboardNavigation, settingsNavigation } from "@/config/dashboard-navigation";
import { useDashboard } from "@/features/dashboard/public";
import { WaveText } from "@/components/ui/WaveText";

type Theme = "light" | "dark" | "system";
const themes = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function DashboardSidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useDashboard();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [themeClosing, setThemeClosing] = useState(false);
  const drawer = useRef<HTMLElement>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const themePopover = useRef<HTMLDivElement>(null);
  const themeCloseTimer = useRef<number | null>(null);

  const closeThemePopover = (animated = false) => {
    if (!animated) {
      setThemeClosing(false);
      setThemeOpen(false);
      return;
    }
    setThemeClosing(true);
    if (themeCloseTimer.current) window.clearTimeout(themeCloseTimer.current);
    themeCloseTimer.current = window.setTimeout(() => {
      setThemeOpen(false);
      setThemeClosing(false);
      themeCloseTimer.current = null;
    }, 380);
  };

  useEffect(() => {
    queueMicrotask(() => {
      const saved = localStorage.getItem("drift-sidebar-collapsed");
      setCollapsed(saved === null ? matchMedia("(max-width: 900px)").matches : saved === "true");
    });
  }, []);

  useEffect(
    () => () => {
      if (themeCloseTimer.current) window.clearTimeout(themeCloseTimer.current);
    },
    [],
  );

  useEffect(() => {
    if (!drawerOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    drawer.current?.querySelector<HTMLElement>("button, a")?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDrawerOpen(false);
        menuTrigger.current?.focus();
      }
      if (event.key !== "Tab" || !drawer.current) return;
      const items = Array.from(drawer.current.querySelectorAll<HTMLElement>("a,button,select"));
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      }
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [drawerOpen]);

  useEffect(() => {
    if (!themeOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (themePopover.current && !themePopover.current.contains(event.target as Node))
        closeThemePopover();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeThemePopover();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [themeOpen]);

  const toggleCollapsed = () => {
    setCollapsed((current) => {
      const next = !current;
      localStorage.setItem("drift-sidebar-collapsed", String(next));
      document.documentElement.dataset.dashboardSidebar = next ? "collapsed" : "expanded";
      return next;
    });
    closeThemePopover();
  };

  const navItem = (
    item: (typeof dashboardNavigation)[number] | typeof settingsNavigation,
    mobile: boolean,
  ) => {
    const Icon = item.icon;
    const active =
      item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => {
          if (mobile) setDrawerOpen(false);
        }}
        aria-label={item.label}
        aria-current={active ? "page" : undefined}
        data-tooltip={item.label}
        className={`dash-nav-item ${active ? "is-active" : ""}`}
      >
        <Icon size={19} strokeWidth={1.8} />
        <span className='dash-copy'>
          <WaveText>{item.label}</WaveText>
        </span>
      </Link>
    );
  };

  const themeChoices = (mobile: boolean) => (
    <div className='dash-theme-options' role='group' aria-label='Appearance'>
      {themes.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type='button'
          onClick={() => {
            setTheme(value as Theme);
            if (!mobile) setThemeOpen(false);
          }}
          className={theme === value ? "selected" : ""}
          aria-label={`${label} theme`}
          aria-pressed={theme === value}
          title={`${label} theme`}
        >
          <Icon size={16} />
        </button>
      ))}
    </div>
  );

  const content = (mobile: boolean) => (
    <>
      <div className='dash-sidebar-top'>
        <Link
          href='/dashboard'
          onClick={() => {
            if (mobile) setDrawerOpen(false);
          }}
          className='dash-brand'
          aria-label='Drift overview'
        >
          <Image src='/logos/drift-logo-v1.png' alt='' width={34} height={34} priority />
          <span className='dash-copy dash-wordmark'>
            <WaveText>Drift</WaveText>
          </span>
        </Link>
        {mobile && (
          <button
            type='button'
            className='dash-icon-button dash-mobile-close'
            onClick={() => {
              setDrawerOpen(false);
              menuTrigger.current?.focus();
            }}
            aria-label='Close menu'
          >
            <X size={19} />
          </button>
        )}
      </div>
      <div className='dash-sidebar-scroll'>
        <nav aria-label='Main navigation' className='dash-nav'>
          {dashboardNavigation.map((item) => navItem(item, mobile))}
        </nav>
      </div>
      <div className='dash-sidebar-footer'>
        <nav aria-label='Secondary navigation'>{navItem(settingsNavigation, mobile)}</nav>
        <div className='dash-appearance'>
          <span className='dash-copy'>Appearance</span>
          {mobile ? (
            themeChoices(true)
          ) : (
            <>
              <div className='dash-expanded-theme'>{themeChoices(false)}</div>
              <div className='dash-compact-theme' ref={themePopover}>
                <button
                  type='button'
                  className='dash-appearance-trigger'
                  onClick={() => {
                    if (!themeClosing) setThemeOpen((value) => !value);
                  }}
                  aria-label='Appearance'
                  aria-expanded={themeOpen}
                  aria-haspopup='menu'
                  title='Appearance'
                >
                  <Sun size={18} />
                </button>
                {themeOpen && (
                  <div
                    className={`dash-theme-popover${themeClosing ? " is-closing" : ""}`}
                    role='menu'
                    aria-label='Appearance'
                  >
                    {themes.map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        type='button'
                        role='menuitemradio'
                        aria-checked={theme === value}
                        onClick={() => {
                          setTheme(value as Theme);
                          closeThemePopover(true);
                        }}
                      >
                        <Icon size={16} />
                        <WaveText>{label}</WaveText>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        <div className='dash-account' title='Demo workspace, local preview'>
          <span className='dash-avatar'>D</span>
          <span className='dash-copy'>
            <strong>Demo workspace</strong>
            <small>Local preview</small>
          </span>
        </div>
      </div>
    </>
  );

  return (
    <>
      <button
        ref={menuTrigger}
        type='button'
        className='dash-mobile-menu dash-icon-button'
        onClick={() => setDrawerOpen(true)}
        aria-label='Open menu'
        aria-expanded={drawerOpen}
        aria-controls='dashboard-drawer'
      >
        <Menu size={20} />
      </button>
      <div className={`dash-sidebar-region ${collapsed ? "collapsed" : ""}`}>
        <aside className='dash-sidebar' aria-label='Dashboard sidebar'>
          {content(false)}
        </aside>
        <button
          type='button'
          className='dash-collapse-trigger'
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
      {drawerOpen && (
        <div
          className='dash-drawer-backdrop'
          onMouseDown={() => {
            setDrawerOpen(false);
            menuTrigger.current?.focus();
          }}
        >
          <aside
            ref={drawer}
            id='dashboard-drawer'
            role='dialog'
            aria-modal='true'
            aria-label='Dashboard navigation'
            className='dash-drawer'
            onMouseDown={(event) => event.stopPropagation()}
          >
            {content(true)}
          </aside>
        </div>
      )}
    </>
  );
}
