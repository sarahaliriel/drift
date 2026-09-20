export const marketingNavigation = [
  { label: "Overview", href: "/#overview" },
] as const;

export type MarketingNavigationItem = (typeof marketingNavigation)[number];
