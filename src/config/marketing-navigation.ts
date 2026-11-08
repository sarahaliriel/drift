export const marketingNavigation = [
  { label: "Platform", href: "/#product" },
  { label: "Solutions", href: "/#solutions" },
  { label: "About", href: "https://sarahaliriel.work" },
] as const;

export type MarketingNavigationItem = (typeof marketingNavigation)[number];

export const resourcesNavigation = [
  {
    label: "Docs",
    href: "/docs",
    description: "Guides and product documentation",
    external: false,
  },
  {
    label: "GitHub",
    href: "https://github.com/sarahaliriel/drift",
    description: "Explore the Drift repository",
    external: true,
  },
] as const;
