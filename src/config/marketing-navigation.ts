export const marketingNavigation = [
  { label: "Product", href: "/#product" },
  { label: "Solutions", href: "/#solutions" },
  { label: "About", href: "/about" }, // Planned route: connect before production.
] as const;

export type MarketingNavigationItem = (typeof marketingNavigation)[number];

export const resourcesNavigation = [
  {
    label: "Documentation",
    href: "/docs",
    description: "Learn how Drift works.",
    external: false,
    placeholder: true,
    icon: "book",
  },
  {
    label: "Getting Started",
    href: "/docs/getting-started",
    description: "Set up your first scan.",
    external: false,
    placeholder: true,
    icon: "sparkles",
  },
  {
    label: "FAQ",
    href: "/#faq",
    description: "Answers to common questions.",
    external: false,
    placeholder: false,
    icon: "help",
  },
  {
    label: "GitHub",
    href: "https://github.com/sarahaliriel/drift",
    description: "Explore the open-source project.",
    external: true,
    placeholder: false,
    icon: "github",
  },
  {
    label: "Changelog",
    href: "/changelog",
    description: "See what's new in Drift.",
    external: false,
    placeholder: true,
    icon: "history",
  },
] as const;
